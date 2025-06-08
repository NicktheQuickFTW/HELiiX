import { NextRequest, NextResponse } from 'next/server';
import { 
  scanManualDirectory, 
  getManualForSport, 
  getManualsBySport,
  getMissingSportManuals,
  BIG12_MANUALS_PATH 
} from '@/lib/big12-manuals';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const sportCode = searchParams.get('sportCode');

    switch (action) {
      case 'scan':
        // Scan directory and return all manuals
        const manuals = await scanManualDirectory();
        return NextResponse.json({ 
          success: true, 
          count: manuals.length,
          path: BIG12_MANUALS_PATH,
          manuals 
        });

      case 'bySport':
        // Get manuals organized by sport
        const organized = await getManualsBySport();
        return NextResponse.json({ 
          success: true, 
          sports: Object.keys(organized).length,
          data: organized 
        });

      case 'missing':
        // Get list of sports missing manuals
        const missing = await getMissingSportManuals();
        return NextResponse.json({ 
          success: true, 
          count: missing.length,
          missing 
        });

      case 'download':
        // Download specific manual
        if (!sportCode) {
          return NextResponse.json(
            { success: false, error: 'Sport code required' },
            { status: 400 }
          );
        }
        
        const manual = await getManualForSport(sportCode);
        if (!manual) {
          return NextResponse.json(
            { success: false, error: 'Manual not found' },
            { status: 404 }
          );
        }

        // Read file and return as blob
        try {
          const fileBuffer = fs.readFileSync(manual.filePath);
          
          return new NextResponse(fileBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="${manual.fileName}"`,
              'Content-Length': manual.fileSize.toString(),
            },
          });
        } catch (error) {
          return NextResponse.json(
            { success: false, error: 'Failed to read manual file' },
            { status: 500 }
          );
        }

      case 'info':
        // Get info for specific sport
        if (!sportCode) {
          return NextResponse.json(
            { success: false, error: 'Sport code required' },
            { status: 400 }
          );
        }
        
        const info = await getManualForSport(sportCode);
        return NextResponse.json({ 
          success: true, 
          found: !!info,
          manual: info 
        });

      default:
        // Return summary stats
        const allManuals = await scanManualDirectory();
        const byType = await getManualsBySport();
        const missingCount = await getMissingSportManuals();
        
        return NextResponse.json({
          success: true,
          summary: {
            totalManuals: allManuals.length,
            totalSports: Object.keys(byType).length,
            missingSports: missingCount.length,
            lastUpdated: new Date().toISOString(),
            sourcePath: BIG12_MANUALS_PATH
          }
        });
    }
  } catch (error) {
    console.error('Manuals API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle manual upload/update
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const sportCode = formData.get('sportCode') as string;

    if (!file || !sportCode) {
      return NextResponse.json(
        { success: false, error: 'File and sport code required' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create filename with sport code and timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${sportCode}_Manual_${timestamp}.pdf`;
    const filePath = path.join(BIG12_MANUALS_PATH, fileName);

    // Write file
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: 'Manual uploaded successfully',
      fileName,
      sportCode,
      size: buffer.length
    });
  } catch (error) {
    console.error('Manual upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload manual' },
      { status: 500 }
    );
  }
}