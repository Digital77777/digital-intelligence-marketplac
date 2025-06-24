
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const WaitlistLandingPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Success! 🎉",
      description: "You've been added to our waitlist. We'll notify you when we launch in July 2025!",
    });
    
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            🚀 Digital Intelligence Marketplace
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Get early access to our AI-powered Learning Hub & Tools Directory launching July 2025. 
            <span className="block mt-2 font-semibold text-yellow-400">Start learning. Start building.</span>
          </p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Learning Hub Card */}
          <Card className="bg-indigo-800/50 border-indigo-600/50 backdrop-blur-sm hover:bg-indigo-800/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20">
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
                <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-700/30 hover:bg-indigo-700/50 transition-colors">
                  <span className="text-lg">🔍</span>
                  <span className="font-medium">Introduction to Artificial Intelligence</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-700/30 hover:bg-indigo-700/50 transition-colors">
                  <span className="text-lg">🤖</span>
                  <span className="font-medium">How AI is Changing the World</span>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/courses')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
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
              <Button 
                onClick={() => navigate('/ai-tools')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              >
                Try AI Tools Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Waitlist Signup */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Join the Future of AI Learning
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Be among the first to access our July 2025 beta release.
              <span className="block mt-2 font-semibold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                Learn. Build. Lead with AI.
              </span>
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white text-black placeholder:text-gray-500 border-0 h-12 text-lg rounded-lg focus:ring-2 focus:ring-yellow-400"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold h-12 px-8 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/20"
              >
                {isSubmitting ? "Joining..." : "Join Waitlist"}
              </Button>
            </form>
            
            <p className="text-sm text-gray-400 mt-4">
              🔒 We respect your privacy. No spam, just updates about the launch.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 text-center border-t border-white/10">
        <p className="text-gray-400">
          © 2024 Digital Intelligence Marketplace. Launching July 2025.
        </p>
      </div>
    </div>
  );
};

export default WaitlistLandingPage;
