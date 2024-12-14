import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface BotAction {
  action: 'start' | 'stop';
  botId: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { action, botId } = await req.json() as BotAction;

    const { data: bot, error: botError } = await supabaseClient
      .from('contract_bots')
      .select('*')
      .eq('id', botId)
      .eq('user_id', user.id)
      .single();

    if (botError || !bot) {
      return new Response(
        JSON.stringify({ error: 'Bot not found or unauthorized' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    switch (action) {
      case 'start':
        const { error: startError } = await supabaseClient
          .from('contract_bots')
          .update({ 
            status: 'running',
            last_error: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', botId);

        if (startError) throw startError;

        // Create notification for bot start
        await supabaseClient.from('notifications').insert({
          user_id: user.id,
          title: 'Contract Bot Started',
          message: `Contract bot ${bot.name} has been started`,
          type: 'bot_status'
        });

        return new Response(
          JSON.stringify({ message: 'Bot started successfully' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );

      case 'stop':
        const { error: stopError } = await supabaseClient
          .from('contract_bots')
          .update({ 
            status: 'stopped',
            updated_at: new Date().toISOString(),
          })
          .eq('id', botId);

        if (stopError) throw stopError;

        // Create notification for bot stop
        await supabaseClient.from('notifications').insert({
          user_id: user.id,
          title: 'Contract Bot Stopped',
          message: `Contract bot ${bot.name} has been stopped`,
          type: 'bot_status'
        });

        return new Response(
          JSON.stringify({ message: 'Bot stopped successfully' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});