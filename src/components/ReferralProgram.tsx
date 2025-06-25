
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Copy, Gift, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import WhatsAppShareButton from './WhatsAppShareButton';

interface ReferralData {
  referralCode: string;
  referralCount: number;
  rewards: Array<{
    tier: string;
    referral_count: number;
    earned_at: string;
    claimed: boolean;
  }>;
}

interface ReferralProgramProps {
  userEmail: string;
}

const ReferralProgram: React.FC<ReferralProgramProps> = ({ userEmail }) => {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReferralData();
  }, [userEmail]);

  const fetchReferralData = async () => {
    try {
      const { data } = await supabase.functions.invoke('referrals', {
        body: {
          action: 'getReferralData',
          email: userEmail
        }
      });

      if (data?.success) {
        setReferralData(data);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!referralData?.referralCode) return;
    
    const referralLink = `${window.location.origin}?ref=${referralData.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard"
    });
  };

  const getRewardTierInfo = (tier: string) => {
    switch (tier) {
      case 'basic_3_months':
        return { name: 'Basic Plan - 3 Months Free', color: 'text-green-400' };
      case 'basic_6_months':
        return { name: 'Basic Plan - 6 Months Free', color: 'text-blue-400' };
      case 'pro_6_months':
        return { name: 'Pro Plan - 6 Months Free', color: 'text-purple-400' };
      default:
        return { name: tier, color: 'text-gray-400' };
    }
  };

  const getNextReward = () => {
    const count = referralData?.referralCount || 0;
    if (count < 5) return { target: 5, reward: 'Basic Plan - 3 Months Free' };
    if (count < 10) return { target: 10, reward: 'Basic Plan - 6 Months Free' };
    if (count < 20) return { target: 20, reward: 'Pro Plan - 6 Months Free' };
    return null;
  };

  if (isLoading) {
    return (
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardContent className="p-8">
          <div className="text-center text-white">Loading referral data...</div>
        </CardContent>
      </Card>
    );
  }

  if (!referralData) {
    return (
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardContent className="p-8">
          <div className="text-center text-white">Unable to load referral data</div>
        </CardContent>
      </Card>
    );
  }

  const nextReward = getNextReward();

  return (
    <div className="space-y-6">
      {/* Referral Stats */}
      <Card className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 border-purple-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-6 h-6" />
            Your Referral Program
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-3xl font-bold text-white">{referralData.referralCount}</div>
              <div className="text-gray-300">Friends Referred</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">{referralData.rewards.length}</div>
              <div className="text-gray-300">Rewards Earned</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{referralData.referralCode}</div>
              <div className="text-gray-300">Your Code</div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Share Your Referral Link</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={copyReferralLink}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <WhatsAppShareButton 
                referralCode={referralData.referralCode}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Tiers */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
            <Gift className="w-5 h-5" />
            Reward Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border-2 ${referralData.referralCount >= 5 ? 'border-green-400 bg-green-400/10' : 'border-gray-600 bg-gray-800/50'}`}>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">5 Friends</div>
                  <div className="text-sm text-green-400">Basic Plan - 3 Months Free</div>
                  {referralData.referralCount >= 5 && <div className="text-xs text-green-300 mt-1">✓ Earned!</div>}
                </div>
              </div>
              <div className={`p-4 rounded-lg border-2 ${referralData.referralCount >= 10 ? 'border-blue-400 bg-blue-400/10' : 'border-gray-600 bg-gray-800/50'}`}>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">10 Friends</div>
                  <div className="text-sm text-blue-400">Basic Plan - 6 Months Free</div>
                  {referralData.referralCount >= 10 && <div className="text-xs text-blue-300 mt-1">✓ Earned!</div>}
                </div>
              </div>
              <div className={`p-4 rounded-lg border-2 ${referralData.referralCount >= 20 ? 'border-purple-400 bg-purple-400/10' : 'border-gray-600 bg-gray-800/50'}`}>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">20 Friends</div>
                  <div className="text-sm text-purple-400">Pro Plan - 6 Months Free</div>
                  {referralData.referralCount >= 20 && <div className="text-xs text-purple-300 mt-1">✓ Earned!</div>}
                </div>
              </div>
            </div>

            {nextReward && (
              <div className="text-center p-4 bg-blue-400/10 border border-blue-400/30 rounded-lg">
                <div className="text-blue-400 font-semibold">
                  Next Reward: {nextReward.target - referralData.referralCount} more friends for {nextReward.reward}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Earned Rewards */}
      {referralData.rewards.length > 0 && (
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Your Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referralData.rewards.map((reward, index) => {
                const rewardInfo = getRewardTierInfo(reward.tier);
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className={`font-semibold ${rewardInfo.color}`}>
                        {rewardInfo.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        Earned with {reward.referral_count} referrals
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(reward.earned_at).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReferralProgram;
