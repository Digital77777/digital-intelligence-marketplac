
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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Attempting to add email to waitlist:', email);
      
      // Add to waitlist using Supabase client
      const { data, error } = await supabase
        .from('email_waiting_list')
        .insert([{ email }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        
        // Check if it's a duplicate email error
        if (error.code === '23505') {
          toast({
            title: "Already Registered",
            description: "This email is already on our waitlist!",
            variant: "destructive"
          });
          return;
        }
        
        throw error;
      }

      console.log('Email successfully added to waitlist:', data);

      // Process referral if there's a referral code
      if (referralCode) {
        try {
          const { data: referralData, error: referralError } = await supabase.functions.invoke('referrals', {
            body: {
              action: 'processReferral',
              email: email,
              referralCode: referralCode
            }
          });

          if (referralError) {
            console.error('Referral processing error:', referralError);
          } else if (referralData?.success && referralData?.reward_earned) {
            toast({
              title: "Bonus Reward Earned! 🎁",
              description: `Your referrer just earned a ${referralData.reward_earned} reward!`
            });
          }
        } catch (referralError) {
          console.error('Referral processing failed:', referralError);
          // Don't show error to user as main signup was successful
        }
      }

      toast({
        title: "Success! 🎉",
        description: "You've been added to our waitlist. We'll notify you when we launch in July 2025!"
      });
      
      onSuccess(email);
    } catch (error) {
      console.error('Unexpected error:', error);
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
            Get Early Access
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Join our exclusive waitlist and be the first to experience the future of AI-powered business intelligence.
            <span className="block mt-2 font-semibold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Launch: July 2025
            </span>
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your business email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white text-black placeholder:text-gray-500 border-0 h-12 text-lg rounded-lg focus:ring-2 focus:ring-blue-400"
              disabled={isSubmitting}
              required
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-400 hover:bg-blue-300 text-black font-bold h-12 px-8 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>
          
          <p className="text-sm text-gray-400 mt-4">
            🔒 We respect your privacy. No spam, enterprise-grade security.
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
        <div className="text-green-400 font-bold">5 Referrals</div>
        <div className="text-gray-300">3 Months Premium Access</div>
      </div>
      <div className="text-center">
        <div className="text-blue-400 font-bold">10 Referrals</div>
        <div className="text-gray-300">6 Months Premium Access</div>
      </div>
      <div className="text-center">
        <div className="text-purple-400 font-bold">20 Referrals</div>
        <div className="text-gray-300">12 Months Pro Access</div>
      </div>
    </div>
    <p className="text-xs text-gray-400 mt-3">
      Share your referral link and earn exclusive rewards when colleagues join!
    </p>
  </div>
);

export default WaitlistSignup;
