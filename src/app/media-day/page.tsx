import MediaDayProfileManager from '@/components/media-day/MediaDayProfileManager';
import ProfileGenerationPanel from '@/components/media-day/ProfileGenerationPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MediaDayPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Big 12 Media Day Management
          </h1>
          <p className="text-gray-600">
            Comprehensive profile management and research tools for 2025 Big 12
            Football Media Day
          </p>
        </div>

        <Tabs defaultValue="profiles" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profiles">Profile Manager</TabsTrigger>
            <TabsTrigger value="generator">Research & Generation</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="mt-6">
            <MediaDayProfileManager />
          </TabsContent>

          <TabsContent value="generator" className="mt-6">
            <ProfileGenerationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
