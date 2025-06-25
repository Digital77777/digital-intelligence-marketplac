
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import HeroSection from './HeroSection';
import FeatureGrid from './FeatureGrid';
import WaitlistSignup from './WaitlistSignup';
import ReferralProgram from './ReferralProgram';
import WhatsAppShareButton from './WhatsAppShareButton';

const WaitlistLandingPage = () => {
  const [hasJoined, setHasJoined] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      toast({
        title: "Professional Referral Detected! 🎉",
        description: "You're joining through a colleague's referral link"
      });
    }
  }, []);

  const handleSignupSuccess = (email: string) => {
    setUserEmail(email);
    setHasJoined(true);
  };

  if (hasJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Welcome to the Future! 🎉
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                You're now on the exclusive waitlist for our AI Business Intelligence Platform
              </p>
              <div className="mb-8">
                <WhatsAppShareButton referralCode={userEmail} />
              </div>
            </div>
            
            <ReferralProgram userEmail={userEmail} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      <HeroSection referralCode={referralCode} />
      <FeatureGrid />
      <WaitlistSignup referralCode={referralCode} onSuccess={handleSignupSuccess} />
      
      {/* Footer */}
      <div className="container mx-auto px-4 py-8 text-center border-t border-white/10">
        <p className="text-gray-400">
          © 2024 AI Business Intelligence Platform. Enterprise Solutions Launching July 2025.
        </p>
      </div>
    </div>
  );
};

export default WaitlistLandingPage;
