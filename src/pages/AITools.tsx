
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AITools = () => {
  const navigate = useNavigate();
  const [deepseekApiKey, setDeepseekApiKey] = useState(localStorage.getItem('deepseek_api_key') || '');
  const [imagePrompt, setImagePrompt] = useState('');
  const [textToSummarize, setTextToSummarize] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleApiKeySubmit = () => {
    if (!deepseekApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your DeepSeek API key",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem('deepseek_api_key', deepseekApiKey);
    toast({
      title: "Success",
      description: "DeepSeek API key saved successfully!",
    });
  };

  const generateImage = async () => {
    if (!deepseekApiKey || !imagePrompt) {
      toast({
        title: "Error",
        description: "Please enter both API key and image prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Note: DeepSeek doesn't have image generation, so we'll use a placeholder
      // In a real implementation, you'd use a different API for image generation
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${deepseekApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: `Generate a detailed description for an AI image based on this prompt: ${imagePrompt}`
            }
          ],
          max_tokens: 200
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      // For demo purposes, we'll show a placeholder image
      setGeneratedImage(`https://via.placeholder.com/512x512/4338ca/ffffff?text=${encodeURIComponent(imagePrompt.slice(0, 20))}`);
      
      toast({
        title: "Success",
        description: "Image description generated! (Placeholder image shown)",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const summarizeText = async () => {
    if (!deepseekApiKey || !textToSummarize) {
      toast({
        title: "Error",
        description: "Please enter both API key and text to summarize",
        variant: "destructive",
      });
      return;
    }

    setIsSummarizing(true);
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${deepseekApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes text clearly and concisely.'
            },
            {
              role: 'user',
              content: `Please summarize the following text: ${textToSummarize}`
            }
          ],
          max_tokens: 300
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      setSummary(data.choices[0].message.content);
      
      toast({
        title: "Success",
        description: "Text summarized successfully!",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to summarize text. Please check your API key.",
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

        {!deepseekApiKey && (
          <Card className="mb-8 bg-yellow-900/20 border-yellow-600/50">
            <CardHeader>
              <CardTitle className="text-yellow-400">DeepSeek API Key Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                To use AI tools, please enter your DeepSeek API key. 
                Get one from the DeepSeek platform.
              </p>
              <div className="flex gap-4">
                <Input
                  type="password"
                  placeholder="Enter DeepSeek API key"
                  value={deepseekApiKey}
                  onChange={(e) => setDeepseekApiKey(e.target.value)}
                  className="flex-1 bg-white/10 text-white placeholder:text-gray-400"
                />
                <Button onClick={handleApiKeySubmit} className="bg-yellow-600 hover:bg-yellow-700">
                  Save Key
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                disabled={!deepseekApiKey}
              />
              <Button 
                onClick={generateImage}
                disabled={isGenerating || !deepseekApiKey}
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
                disabled={!deepseekApiKey}
              />
              <Button 
                onClick={summarizeText}
                disabled={isSummarizing || !deepseekApiKey}
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
