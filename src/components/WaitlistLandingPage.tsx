import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ReferralProgram from './ReferralProgram';

const WaitlistLandingPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      toast({
        title: "Referral Detected! 🎉",
        description: "You're joining through a friend's referral link"
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Add to waitlist
      const response = await fetch('https://dxddsndbtxpiqxpkuxcb.supabase.co/rest/v1/email_waiting_list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4ZGRzbmRidHhwaXF4cGt1eGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjA2NDAsImV4cCI6MjA2NjMzNjY0MH0.2vDzuvv8VvqoelTPMNxVemhzW1o1wo2xk4BMOHEd1TE',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4ZGRzbmRidHhwaXF4cGt1eGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjA2NDAsImV4cCI6MjA2NjMzNjY0MH0.2vDzuvv8VvqoelTPMNxVemhzW1o1wo2xk4BMOHEd1TE',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Failed to add to waitlist');
      }

      // Process referral if there's a referral code
      if (referralCode) {
        const referralResponse = await fetch('https://dxddsndbtxpiqxpkuxcb.supabase.co/functions/v1/referrals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'processReferral',
            email: email,
            referralCode: referralCode
          })
        });

        const referralData = await referralResponse.json();
        if (referralData.success && referralData.reward_earned) {
          toast({
            title: "Bonus Reward Earned! 🎁",
            description: `Your referrer just earned a ${referralData.reward_earned} reward!`
          });
        }
      }

      toast({
        title: "Success! 🎉",
        description: "You've been added to our waitlist. We'll notify you when we launch in July 2025!"
      });
      
      setHasJoined(true);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Welcome to the Community! 🎉
              </h1>
              <p className="text-xl text-gray-300">
                You're now on the waitlist for Digital Intelligence Marketplace
              </p>
            </div>
            
            <ReferralProgram userEmail={email} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent md:text-5xl text-4xl">
            Digital Intelligence Marketplace
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Get early access to our AI-powered Learning Hub & Tools Directory launching July 2025. 
            <span className="block mt-2 font-semibold text-yellow-400">Start learning. Start building.</span>
          </p>
          {referralCode && (
            <div className="mt-4 p-3 bg-green-400/20 border border-green-400/50 rounded-lg max-w-md mx-auto">
              <p className="text-green-300 text-sm">
                🎉 You're joining through a friend's referral! They'll get rewarded when you sign up.
              </p>
            </div>
          )}
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
              <Button onClick={() => navigate('/courses')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
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

            {/* Referral Program Preview */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl border border-purple-400/30">
              <h3 className="text-xl font-bold text-white mb-4">🎁 Referral Rewards Program</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-green-400 font-bold">5 Friends</div>
                  <div className="text-gray-300">Basic Plan - 3 Months Free</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-bold">10 Friends</div>
                  <div className="text-gray-300">Basic Plan - 6 Months Free</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-bold">20 Friends</div>
                  <div className="text-gray-300">Pro Plan - 6 Months Free</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Share your referral link and earn rewards when friends join!
              </p>
            </div>
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
