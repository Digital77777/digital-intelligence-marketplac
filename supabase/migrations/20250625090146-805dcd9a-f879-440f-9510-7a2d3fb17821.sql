
-- First, add unique constraint to email_waiting_list
ALTER TABLE public.email_waiting_list ADD CONSTRAINT unique_email UNIQUE (email);

-- Create referral codes table
CREATE TABLE public.referral_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL REFERENCES public.email_waiting_list(email),
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referrals table to track who referred whom
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_email TEXT NOT NULL REFERENCES public.email_waiting_list(email),
  referred_email TEXT NOT NULL REFERENCES public.email_waiting_list(email),
  referral_code TEXT NOT NULL REFERENCES public.referral_codes(code),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(referred_email) -- Ensure each person can only be referred once
);

-- Create rewards table to track earned rewards
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL REFERENCES public.email_waiting_list(email),
  tier TEXT NOT NULL CHECK (tier IN ('basic_3_months', 'basic_6_months', 'pro_6_months')),
  referral_count INTEGER NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  claimed BOOLEAN NOT NULL DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX idx_referral_codes_email ON public.referral_codes(email);
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_email);
CREATE INDEX idx_rewards_email ON public.rewards(email);

-- Create function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a 6-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 6));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.referral_codes WHERE referral_codes.code = code) INTO exists;
    
    -- If code doesn't exist, return it
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle new waitlist signups and generate referral codes
CREATE OR REPLACE FUNCTION handle_waitlist_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate referral code for new user
  INSERT INTO public.referral_codes (email, code)
  VALUES (NEW.email, generate_referral_code());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate referral codes
CREATE TRIGGER on_waitlist_signup
  AFTER INSERT ON public.email_waiting_list
  FOR EACH ROW EXECUTE FUNCTION handle_waitlist_signup();

-- Create function to handle referrals and check for rewards
CREATE OR REPLACE FUNCTION process_referral(referral_code_input TEXT, new_email TEXT)
RETURNS JSON AS $$
DECLARE
  referrer_email_var TEXT;
  referral_count INTEGER;
  reward_tier TEXT;
  result JSON;
BEGIN
  -- Get referrer email from code
  SELECT email INTO referrer_email_var 
  FROM public.referral_codes 
  WHERE code = referral_code_input;
  
  IF referrer_email_var IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid referral code');
  END IF;
  
  IF referrer_email_var = new_email THEN
    RETURN json_build_object('success', false, 'message', 'Cannot refer yourself');
  END IF;
  
  -- Insert referral record
  INSERT INTO public.referrals (referrer_email, referred_email, referral_code)
  VALUES (referrer_email_var, new_email, referral_code_input);
  
  -- Count total referrals for this user
  SELECT COUNT(*) INTO referral_count
  FROM public.referrals
  WHERE referrer_email = referrer_email_var;
  
  -- Check for rewards
  IF referral_count >= 20 AND NOT EXISTS (
    SELECT 1 FROM public.rewards 
    WHERE email = referrer_email_var AND tier = 'pro_6_months'
  ) THEN
    INSERT INTO public.rewards (email, tier, referral_count)
    VALUES (referrer_email_var, 'pro_6_months', referral_count);
    reward_tier := 'pro_6_months';
  ELSIF referral_count >= 10 AND NOT EXISTS (
    SELECT 1 FROM public.rewards 
    WHERE email = referrer_email_var AND tier = 'basic_6_months'
  ) THEN
    INSERT INTO public.rewards (email, tier, referral_count)
    VALUES (referrer_email_var, 'basic_6_months', referral_count);
    reward_tier := 'basic_6_months';
  ELSIF referral_count >= 5 AND NOT EXISTS (
    SELECT 1 FROM public.rewards 
    WHERE email = referrer_email_var AND tier = 'basic_3_months'
  ) THEN
    INSERT INTO public.rewards (email, tier, referral_count)
    VALUES (referrer_email_var, 'basic_3_months', referral_count);
    reward_tier := 'basic_3_months';
  END IF;
  
  result := json_build_object(
    'success', true,
    'referrer_email', referrer_email_var,
    'referral_count', referral_count,
    'reward_earned', reward_tier
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
