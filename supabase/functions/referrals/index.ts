
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { action, email, referralCode } = await req.json()

    if (action === 'getReferralData') {
      // Get user's referral code and stats
      const { data: referralCodeData } = await supabaseClient
        .from('referral_codes')
        .select('code')
        .eq('email', email)
        .single()

      const { data: referralCount } = await supabaseClient
        .from('referrals')
        .select('*', { count: 'exact' })
        .eq('referrer_email', email)

      const { data: rewards } = await supabaseClient
        .from('rewards')
        .select('*')
        .eq('email', email)
        .order('earned_at', { ascending: false })

      return new Response(
        JSON.stringify({
          success: true,
          referralCode: referralCodeData?.code,
          referralCount: referralCount?.length || 0,
          rewards: rewards || []
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } else if (action === 'processReferral') {
      // Process a new referral
      const { data, error } = await supabaseClient
        .rpc('process_referral', {
          referral_code_input: referralCode,
          new_email: email
        })

      if (error) {
        throw error
      }

      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Invalid action' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  } catch (error) {
    console.error('Error in referrals function:', error)
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
