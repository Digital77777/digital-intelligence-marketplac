
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AITools = () => {
  const navigate = useNavigate();
  const [imagePrompt, setImagePrompt] = useState('');
  const [textToSummarize, setTextToSummarize] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter an image prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-tools', {
        body: {
          action: 'generateImage',
          prompt: imagePrompt
        }
      });

      if (error) throw error;

      if (data.success) {
        setGeneratedImage(data.imageUrl);
        toast({
          title: "Success",
          description: "Image generated successfully!",
        });
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const summarizeText = async () => {
    if (!textToSummarize.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to summarize",
        variant: "destructive",
      });
      return;
    }

    setIsSummarizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-tools', {
        body: {
          action: 'summarizeText',
          text: textToSummarize
        }
      });

      if (error) throw error;

      if (data.success) {
        setSummary(data.summary);
        toast({
          title: "Success",
          description: "Text summarized successfully!",
        });
      } else {
        throw new Error(data.error || 'Failed to summarize text');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to summarize text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            🧰 AI Tools Directory
          </h1>
          <Button 
            onClick={() => navigate('/')}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Back to Home
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Image Generator */}
          <Card className="bg-purple-800/30 border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                🖼️ AI Image Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Describe the image you want to generate..."
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                className="bg-white/10 text-white placeholder:text-gray-400"
              />
              <Button 
                onClick={generateImage}
                disabled={isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? "Generating..." : "Generate Image"}
              </Button>
              {generatedImage && (
                <div className="mt-4">
                  <img src={generatedImage} alt="Generated" className="w-full rounded-lg" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Text Summarizer */}
          <Card className="bg-indigo-800/30 border-indigo-600/50">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                📝 AI Text Summarizer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                placeholder="Paste your text here to summarize..."
                value={textToSummarize}
                onChange={(e) => setTextToSummarize(e.target.value)}
                className="w-full h-32 p-3 bg-white/10 text-white placeholder:text-gray-400 rounded-lg border border-white/20 resize-none"
              />
              <Button 
                onClick={summarizeText}
                disabled={isSummarizing}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isSummarizing ? "Summarizing..." : "Summarize Text"}
              </Button>
              {summary && (
                <div className="mt-4 p-4 bg-white/10 rounded-lg">
                  <h4 className="font-semibold mb-2 text-indigo-300">Summary:</h4>
                  <p className="text-gray-200">{summary}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AITools;
