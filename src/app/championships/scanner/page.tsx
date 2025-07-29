'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';

import {
  QrCode,
  Camera,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Shield,
  Clock,
  MapPin,
  RefreshCw,
  Flashlight,
  FlashlightOff,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  validateCredentialQRCode,
  logCredentialAccess,
  CredentialData,
} from '@/lib/credential-utils';
import { supabase } from '@/lib/supabase';
import {
  Badge,
  Button,
  Card,
  Column,
  Heading,
  Input,
  Label,
  Option,
  Select,
  Text,
} from '@once-ui-system/core';

interface AccessPoint {
  id: string;
  name: string;
  description: string;
  location: string;
  required_access_levels: string[];
}

interface ScanResult {
  valid: boolean;
  credential?: CredentialData;
  error?: string;
  reason?: string;
  timestamp: Date;
}

export default function CredentialScannerPage() {
  const { user, hasPermission } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [selectedAccessPoint, setSelectedAccessPoint] = useState<string>('');
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [stats, setStats] = useState({
    totalScans: 0,
    granted: 0,
    denied: 0,
    errors: 0,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (hasPermission('championships', 'read')) {
      fetchAccessPoints();
      updateStats();
    }
  }, [hasPermission]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const fetchAccessPoints = async () => {
    try {
      const { data, error } = await supabase
        .from('venue_access_points')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setAccessPoints(data || []);
    } catch (error) {
      console.error('Error fetching access points:', error);
      toast.error('Failed to load access points');
    }
  };

  const updateStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('credential_access_log')
        .select('scan_result')
        .gte('created_at', today.toISOString())
        .eq('scanned_by', user?.id);

      if (error) throw error;

      const totalScans = data?.length || 0;
      const granted =
        data?.filter((log) => log.scan_result === 'granted').length || 0;
      const denied =
        data?.filter((log) =>
          ['denied', 'expired', 'revoked'].includes(log.scan_result)
        ).length || 0;
      const errors = totalScans - granted - denied;

      setStats({ totalScans, granted, denied, errors });
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsScanning(true);
      startQRDetection();
    } catch (error) {
      console.error('Error starting camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    setFlashlightOn(false);
  };

  const toggleFlashlight = async () => {
    try {
      if (streamRef.current) {
        const track = streamRef.current.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        if (capabilities.torch) {
          await track.applyConstraints({
            advanced: [{ torch: !flashlightOn }],
          });
          setFlashlightOn(!flashlightOn);
        } else {
          toast.error('Flashlight not supported on this device');
        }
      }
    } catch (error) {
      console.error('Error toggling flashlight:', error);
      toast.error('Failed to toggle flashlight');
    }
  };

  const startQRDetection = () => {
    const detectQR = () => {
      if (!videoRef.current || !canvasRef.current || !isScanning) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context?.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          // In a real implementation, you would use a QR code detection library
          // like jsQR or qr-scanner here
          // For now, we'll simulate detection
          // This is where you'd integrate with a QR detection library:
          // import jsQR from 'jsqr'
          // const imageData = context?.getImageData(0, 0, canvas.width, canvas.height)
          // const code = jsQR(imageData?.data, imageData?.width, imageData?.height)
          // if (code) {
          //   handleQRCodeDetected(code.data)
          // }
        } catch (error) {
          console.error('QR detection error:', error);
        }
      }

      if (isScanning) {
        requestAnimationFrame(detectQR);
      }
    };

    detectQR();
  };

  const handleQRCodeDetected = async (qrData: string) => {
    if (!selectedAccessPoint) {
      toast.error('Please select an access point first');
      return;
    }

    try {
      // Validate the QR code
      const validation = await validateCredentialQRCode(qrData);

      const result: ScanResult = {
        valid: validation.valid,
        credential: validation.credential,
        error: validation.error,
        reason: validation.reason,
        timestamp: new Date(),
      };

      setCurrentResult(result);
      setScanResults((prev) => [result, ...prev.slice(0, 9)]); // Keep last 10 results

      // Log the access attempt
      if (validation.credential) {
        const accessPoint = accessPoints.find(
          (ap) => ap.id === selectedAccessPoint
        );
        const scanResult = validation.valid ? 'granted' : 'denied';

        await logCredentialAccess(
          validation.credential.id,
          validation.credential.championship_event_id,
          accessPoint?.name || 'Unknown',
          accessPoint?.required_access_levels[0] || 'general',
          scanResult,
          user?.id,
          'web-scanner',
          undefined // GPS coordinates would go here
        );
      }

      // Update stats
      updateStats();

      // Show result feedback
      if (validation.valid) {
        toast.success('Access granted!');
        // You could trigger a success sound/vibration here
      } else {
        toast.error(`Access denied: ${validation.error}`);
        // You could trigger an error sound/vibration here
      }

      // Auto-clear result after a few seconds
      setTimeout(() => {
        setCurrentResult(null);
      }, 5000);
    } catch (error) {
      console.error('Error processing QR code:', error);
      toast.error('Failed to process QR code');
    }
  };

  const handleManualCodeSubmit = () => {
    if (!manualCode.trim()) {
      toast.error('Please enter a credential code');
      return;
    }

    handleQRCodeDetected(manualCode);
    setManualCode('');
  };

  const getResultIcon = (result: ScanResult) => {
    if (result.valid) {
      return <CheckCircle className="h-8 w-8" />;
    } else if (
      result.reason === 'EXPIRED' ||
      result.reason === 'NOT_YET_VALID'
    ) {
      return <Clock className="h-8 w-8" />;
    } else {
      return <XCircle className="h-8 w-8" />;
    }
  };

  const getResultColor = (result: ScanResult) => {
    if (result.valid) {
      return 'border-green-500 bg-green-50';
    } else if (
      result.reason === 'EXPIRED' ||
      result.reason === 'NOT_YET_VALID'
    ) {
      return 'border-yellow-500 bg-yellow-50';
    } else {
      return 'border-red-500 bg-red-50';
    }
  };

  if (!hasPermission('championships', 'read')) {
    return (
      <div className="container py-6">
        <Card>
          <Column className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You don't have permission to access the credential scanner.
            </p>
          </Column>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-orbitron flex items-center gap-2">
            <QrCode className="h-8 w-8" />
            Credential Scanner
          </h1>
          <p className="text-muted-foreground mt-2">
            Scan championship credentials for venue access
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <Column gap="xs" className="pb-3">
            <Heading variant="heading-sm" className="text-sm font-medium">
              Total Scans
            </Heading>
          </Column>
          <Column>
            <div className="text-2xl font-bold">{stats.totalScans}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </Column>
        </Card>

        <Card>
          <Column gap="xs" className="pb-3">
            <Heading variant="heading-sm" className="text-sm font-medium">
              Access Granted
            </Heading>
          </Column>
          <Column>
            <div className="text-2xl font-bold">{stats.granted}</div>
            <p className="text-xs text-muted-foreground">Successful scans</p>
          </Column>
        </Card>

        <Card>
          <Column gap="xs" className="pb-3">
            <Heading variant="heading-sm" className="text-sm font-medium">
              Access Denied
            </Heading>
          </Column>
          <Column>
            <div className="text-2xl font-bold">{stats.denied}</div>
            <p className="text-xs text-muted-foreground">Denied/expired</p>
          </Column>
        </Card>

        <Card>
          <Column gap="xs" className="pb-3">
            <Heading variant="heading-sm" className="text-sm font-medium">
              Errors
            </Heading>
          </Column>
          <Column>
            <div className="text-2xl font-bold">{stats.errors}</div>
            <p className="text-xs text-muted-foreground">Scan errors</p>
          </Column>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Scanner Interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Access Point Selection */}
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm" className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Access Point
              </Heading>
              <Text variant="body-sm" muted>
                Select the venue entrance or area you're monitoring
              </Text>
            </Column>
            <Column>
              <Select
                value={selectedAccessPoint}
                onValueChange={setSelectedAccessPoint}
              >
                {accessPoints.map((point) => (
                  <SelectItem key={point.id} value={point.id}>
                    {point.name} - {point.location}
                  </SelectItem>
                ))}
              </Select>
            </Column>
          </Card>

          {/* Camera Scanner */}
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm" className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                QR Code Scanner
              </Heading>
              <Text variant="body-sm" muted>
                Position the QR code within the camera view
              </Text>
            </Column>
            <Column>
              <div className="space-y-4">
                {/* Camera View */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {isScanning ? (
                    <>
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        playsInline
                        muted
                      />
                      <canvas ref={canvasRef} className="hidden" />

                      {/* Scanning Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="border-2 border-white rounded-lg w-64 h-64 relative">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg"></div>
                        </div>
                      </div>

                      {/* Current Scan Result */}
                      {currentResult && (
                        <div
                          className={`absolute top-4 left-4 right-4 p-4 rounded-lg border-2 ${getResultColor(currentResult)}`}
                        >
                          <div className="flex items-center gap-3">
                            {getResultIcon(currentResult)}
                            <div>
                              <p className="font-bold">
                                {currentResult.valid
                                  ? 'ACCESS GRANTED'
                                  : 'ACCESS DENIED'}
                              </p>
                              {currentResult.credential && (
                                <p className="text-sm">
                                  {currentResult.credential.holder_name}
                                </p>
                              )}
                              {currentResult.error && (
                                <p className="text-sm text-red-600">
                                  {currentResult.error}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white">
                        <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Camera not active</p>
                        <p className="text-sm opacity-75">
                          Click "Start Scanner" to begin
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Controls */}
                <div className="flex gap-2">
                  {!isScanning ? (
                    <Button
                      onClick={startCamera}
                      disabled={!selectedAccessPoint}
                      className="flex-1"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Start Scanner
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={stopCamera}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Stop Scanner
                      </Button>
                      <Button
                        onClick={toggleFlashlight}
                        variant="outline"
                        size="sm"
                      >
                        {flashlightOn ? (
                          <FlashlightOff className="h-4 w-4" />
                        ) : (
                          <Flashlight className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          stopCamera();
                          setTimeout(startCamera, 100);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Column>
          </Card>

          {/* Manual Code Entry */}
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm">Manual Code Entry</Heading>
              <Text variant="body-sm" muted>
                Enter credential code manually if QR code is unreadable
              </Text>
            </Column>
            <Column>
              <div className="flex gap-2">
                <Input
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Enter credential number or QR code data"
                  onKeyPress={(e) =>
                    e.key === 'Enter' && handleManualCodeSubmit()
                  }
                />
                <Button
                  onClick={handleManualCodeSubmit}
                  disabled={!selectedAccessPoint}
                >
                  Validate
                </Button>
              </div>
            </Column>
          </Card>
        </div>

        {/* Scan History Sidebar */}
        <div className="space-y-6">
          {/* Recent Scans */}
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm" className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Scans
              </Heading>
              <Text variant="body-sm" muted>
                Last 10 scan results
              </Text>
            </Column>
            <Column>
              <div className="space-y-2">
                {scanResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No scans yet
                  </p>
                ) : (
                  scanResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${getResultColor(result)}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {result.valid ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                          {result.valid ? 'Granted' : 'Denied'}
                        </span>
                      </div>

                      {result.credential && (
                        <p className="text-sm font-medium">
                          {result.credential.holder_name}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground">
                        {result.timestamp.toLocaleTimeString()}
                      </p>

                      {result.error && (
                        <p className="text-xs text-red-600 mt-1">
                          {result.error}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Column>
          </Card>

          {/* Access Point Info */}
          {selectedAccessPoint && (
            <Card>
              <Column gap="xs">
                <Heading variant="heading-sm">Access Point Details</Heading>
              </Column>
              <Column>
                {(() => {
                  const point = accessPoints.find(
                    (ap) => ap.id === selectedAccessPoint
                  );
                  return point ? (
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium">Name</p>
                        <p className="text-muted-foreground">{point.name}</p>
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">
                          {point.location}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Required Access</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {point.required_access_levels.map((level, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {level.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {point.description && (
                        <div>
                          <p className="font-medium">Description</p>
                          <p className="text-muted-foreground">
                            {point.description}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : null;
                })()}
              </Column>
            </Card>
          )}

          {/* Scanner Tips */}
          <Card>
            <Column gap="xs">
              <Heading variant="heading-sm">Scanning Tips</Heading>
            </Column>
            <Column className="space-y-2 text-sm text-muted-foreground">
              <p>• Hold device steady and ensure good lighting</p>
              <p>• Position QR code within the green frame</p>
              <p>• Use flashlight in low-light conditions</p>
              <p>• For damaged QR codes, use manual entry</p>
              <p>• Check that correct access point is selected</p>
            </Column>
          </Card>
        </div>
      </div>
    </div>
  );
}
