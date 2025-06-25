
import React from 'react';

interface HeroSectionProps {
  referralCode?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ referralCode }) => {
  return (
    <div className="container mx-auto px-4 pt-16 pb-12 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <span className="inline-block px-4 py-2 bg-blue-400/20 border border-blue-400/50 rounded-full text-blue-300 text-sm font-medium">
            Launching July 2025
          </span>
        </div>
        <h1 className="font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent md:text-5xl text-4xl">
          AI-Powered Business Intelligence Platform
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Unlock your organization's potential with enterprise-grade AI tools, strategic insights, and expert-led training programs.
          <span className="block mt-4 font-semibold text-blue-400">
            Transform Data into Decisions. Scale with Intelligence.
          </span>
        </p>
        {referralCode && (
          <div className="mt-6 p-4 bg-blue-400/20 border border-blue-400/50 rounded-lg max-w-md mx-auto">
            <p className="text-blue-300 text-sm">
              🎉 You're joining through a professional referral! Your referrer will be rewarded when you sign up.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
