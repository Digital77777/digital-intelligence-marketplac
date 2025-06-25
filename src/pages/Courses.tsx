
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Courses = () => {
  const navigate = useNavigate();
  const [validatedVideos, setValidatedVideos] = useState<{[key: string]: {embedUrl: string, title: string}}>({});

  const courses = [
    {
      id: 'ai-intro',
      title: '🔍 Introduction to Artificial Intelligence',
      description: 'Learn the fundamentals of AI and its applications in modern technology.',
      videoId: 'JMUxmLyrhSk',
      duration: '45 min'
    },
    {
      id: 'ai-world',
      title: '🤖 How AI is Changing the World',
      description: 'Explore how AI is transforming industries and society.',
      videoId: 'mJeNghZXtMo',
      duration: '38 min'
    }
  ];

  const validateVideo = async (videoId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('youtube-embed', {
        body: { videoId }
      });

      if (error) throw error;

      if (data.success) {
        setValidatedVideos(prev => ({
          ...prev,
          [videoId]: {
            embedUrl: data.embedUrl,
            title: data.title
          }
        }));
      } else {
        console.error('Video validation failed:', data.error);
        toast({
          title: "Video Error",
          description: `Could not load video: ${data.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error validating video:', error);
      toast({
        title: "Error",
        description: "Failed to validate video. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Validate all videos on component mount
    courses.forEach(course => {
      validateVideo(course.videoId);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            📘 Learning Hub
          </h1>
          <Button 
            onClick={() => navigate('/')}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Back to Home
          </Button>
        </div>

        <Tabs defaultValue={courses[0].id} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            {courses.map((course) => (
              <TabsTrigger 
                key={course.id} 
                value={course.id}
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                {course.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {courses.map((course) => (
            <TabsContent key={course.id} value={course.id} className="mt-6">
              <Card className="bg-blue-800/30 border-blue-600/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{course.title}</CardTitle>
                  <p className="text-gray-300">{course.description}</p>
                  <p className="text-sm text-blue-300">Duration: {course.duration}</p>
                </CardHeader>
                <CardContent>
                  {validatedVideos[course.videoId] ? (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={validatedVideos[course.videoId].embedUrl}
                        title={validatedVideos[course.videoId].title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400">Loading video...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Courses;
