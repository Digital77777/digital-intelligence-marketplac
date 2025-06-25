
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const FeatureGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Learning Hub Card */}
        <Card className="bg-blue-800/50 border-blue-600/50 backdrop-blur-sm hover:bg-blue-800/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              📘 Learning Hub
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-200">
            <p className="mb-6 text-lg leading-relaxed">
              Master AI fundamentals with our curated courses designed for beginners and professionals alike.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-700/30 hover:bg-blue-700/50 transition-colors">
                <span className="text-lg">🔍</span>
                <span className="font-medium">Introduction to Artificial Intelligence</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-700/30 hover:bg-blue-700/50 transition-colors">
                <span className="text-lg">🤖</span>
                <span className="font-medium">How AI is Changing the World</span>
              </div>
            </div>
            <Button onClick={() => navigate('/courses')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Start Learning Now
            </Button>
          </CardContent>
        </Card>

        {/* AI Tools Directory Card */}
        <Card className="bg-purple-800/50 border-purple-600/50 backdrop-blur-sm hover:bg-purple-800/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              🧰 AI Tools Directory
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-200">
            <p className="mb-6 text-lg leading-relaxed">
              Discover powerful AI tools to supercharge your productivity and creativity.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-700/30 hover:bg-purple-700/50 transition-colors">
                <span className="text-lg">🖼️</span>
                <span className="font-medium">AI Image Generator</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-700/30 hover:bg-purple-700/50 transition-colors">
                <span className="text-lg">📝</span>
                <span className="font-medium">AI Text Summarizer</span>
              </div>
            </div>
            <Button onClick={() => navigate('/ai-tools')} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
              Try AI Tools Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeatureGrid;
