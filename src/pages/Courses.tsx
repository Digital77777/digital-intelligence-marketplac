
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const navigate = useNavigate();
  const [youtubeApiKey, setYoutubeApiKey] = useState(localStorage.getItem('youtube_api_key') || '');

  const handleApiKeySubmit = () => {
    if (!youtubeApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your YouTube API key",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem('youtube_api_key', youtubeApiKey);
    toast({
      title: "Success",
      description: "YouTube API key saved successfully!",
    });
  };

  const courses = [
    {
      id: 'ai-intro',
      title: '🔍 Introduction to Artificial Intelligence',
      description: 'Learn the fundamentals of AI and its applications in modern technology.',
      videoId: 'JMUxmLyrhSk', // Example AI intro video
      duration: '45 min'
    },
    {
      id: 'ai-world',
      title: '🤖 How AI is Changing the World',
      description: 'Explore how AI is transforming industries and society.',
      videoId: 'mJeNghZXtMo', // Example AI world video
      duration: '38 min'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            📘 Learning Hub
          </h1>
          <Button 
            onClick={() => navigate('/')}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Back to Home
          </Button>
        </div>

        {!youtubeApiKey && (
          <Card className="mb-8 bg-yellow-900/20 border-yellow-600/50">
            <CardHeader>
              <CardTitle className="text-yellow-400">YouTube API Key Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                To play videos embedded here, please enter your YouTube API key. 
                Get one from the Google Developers Console.
              </p>
              <div className="flex gap-4">
                <Input
                  type="password"
                  placeholder="Enter YouTube API key"
                  value={youtubeApiKey}
                  onChange={(e) => setYoutubeApiKey(e.target.value)}
                  className="flex-1 bg-white/10 text-white placeholder:text-gray-400"
                />
                <Button onClick={handleApiKeySubmit} className="bg-yellow-600 hover:bg-yellow-700">
                  Save Key
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue={courses[0].id} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            {courses.map((course) => (
              <TabsTrigger 
                key={course.id} 
                value={course.id}
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                {course.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {courses.map((course) => (
            <TabsContent key={course.id} value={course.id} className="mt-6">
              <Card className="bg-indigo-800/30 border-indigo-600/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{course.title}</CardTitle>
                  <p className="text-gray-300">{course.description}</p>
                  <p className="text-sm text-indigo-300">Duration: {course.duration}</p>
                </CardHeader>
                <CardContent>
                  {youtubeApiKey ? (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${course.videoId}?key=${youtubeApiKey}`}
                        title={course.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400">Enter YouTube API key to watch videos</p>
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
