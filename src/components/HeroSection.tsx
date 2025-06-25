
import React from 'react';

interface HeroSectionProps {
  referralCode?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ referralCode }) => {
  return (
    <div className="container mx-auto px-4 pt-16 pb-12 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent md:text-5xl text-4xl">
          Digital Intelligence Marketplace
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Get early access to our AI-powered Learning Hub & Tools Directory launching July 2025. 
          <span className="block mt-2 font-semibold text-blue-400">Start learning. Start building.</span>
        </p>
        {referralCode && (
          <div className="mt-4 p-3 bg-blue-400/20 border border-blue-400/50 rounded-lg max-w-md mx-auto">
            <p className="text-blue-300 text-sm">
              🎉 You're joining through a friend's referral! They'll get rewarded when you sign up.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
