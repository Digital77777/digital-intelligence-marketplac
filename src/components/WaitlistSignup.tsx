
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WaitlistSignupProps {
  referralCode: string;
  onSuccess: (email: string) => void;
}

const WaitlistSignup: React.FC<WaitlistSignupProps> = ({ referralCode, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Add to waitlist using Supabase client
      const { error } = await supabase
        .from('email_waiting_list')
        .insert([{ email }]);

      if (error) {
        throw error;
      }

      // Process referral if there's a referral code
      if (referralCode) {
        const { data: referralData } = await supabase.functions.invoke('referrals', {
          body: {
            action: 'processReferral',
            email: email,
            referralCode: referralCode
          }
        });

        if (referralData?.success && referralData?.reward_earned) {
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
      
      onSuccess(email);
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

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Join the Future of AI Learning
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Be among the first to access our July 2025 beta release.
            <span className="block mt-2 font-semibold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Learn. Build. Lead with AI.
            </span>
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white text-black placeholder:text-gray-500 border-0 h-12 text-lg rounded-lg focus:ring-2 focus:ring-blue-400"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-400 hover:bg-blue-300 text-black font-bold h-12 px-8 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-400/20"
            >
              {isSubmitting ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>
          
          <p className="text-sm text-gray-400 mt-4">
            🔒 We respect your privacy. No spam, just updates about the launch.
          </p>

          <ReferralPreview />
        </div>
      </div>
    </div>
  );
};

const ReferralPreview = () => (
  <div className="mt-8 p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-400/30">
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
);

export default WaitlistSignup;
