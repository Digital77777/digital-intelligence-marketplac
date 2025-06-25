
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface WhatsAppShareButtonProps {
  referralCode?: string;
  className?: string;
}

const WhatsAppShareButton: React.FC<WhatsAppShareButtonProps> = ({ referralCode, className = '' }) => {
  const shareOnWhatsApp = () => {
    const baseUrl = window.location.origin;
    const referralLink = referralCode ? `${baseUrl}?ref=${referralCode}` : baseUrl;
    const message = `🚀 Join me on the Digital Intelligence Marketplace waitlist! Get early access to AI-powered learning tools launching July 2025. ${referralLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={shareOnWhatsApp}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      Share on WhatsApp
    </Button>
  );
};

export default WhatsAppShareButton;
