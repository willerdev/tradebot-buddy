import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface BotAction {
  action: 'start' | 'stop' | 'status'
  botId: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
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
    )

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get the request body
    const { action, botId } = await req.json() as BotAction

    // Verify bot ownership
    const { data: bot, error: botError } = await supabaseClient
      .from('trading_bots')
      .select('*')
      .eq('id', botId)
      .eq('user_id', user.id)
      .single()

    if (botError || !bot) {
      return new Response(
        JSON.stringify({ error: 'Bot not found or unauthorized' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Handle different actions
    switch (action) {
      case 'start':
        // Update bot status to running
        const { error: startError } = await supabaseClient
          .from('trading_bots')
          .update({ status: 'running', last_error: null })
          .eq('id', botId)

        if (startError) {
          throw startError
        }

        // Create notification for bot start
        await supabaseClient.from('notifications').insert({
          user_id: user.id,
          title: 'Bot Started',
          message: `Trading bot ${bot.name} has been started`,
          type: 'bot_status'
        })

        return new Response(
          JSON.stringify({ message: 'Bot started successfully' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )

      case 'stop':
        // Update bot status to stopped
        const { error: stopError } = await supabaseClient
          .from('trading_bots')
          .update({ status: 'stopped' })
          .eq('id', botId)

        if (stopError) {
          throw stopError
        }

        // Create notification for bot stop
        await supabaseClient.from('notifications').insert({
          user_id: user.id,
          title: 'Bot Stopped',
          message: `Trading bot ${bot.name} has been stopped`,
          type: 'bot_status'
        })

        return new Response(
          JSON.stringify({ message: 'Bot stopped successfully' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )

      case 'status':
        // Get bot's latest trades and performance metrics
        const { data: trades, error: tradesError } = await supabaseClient
          .from('bot_trades')
          .select('*')
          .eq('bot_id', botId)
          .order('created_at', { ascending: false })
          .limit(10)

        if (tradesError) {
          throw tradesError
        }

        return new Response(
          JSON.stringify({
            status: bot.status,
            performance_metrics: bot.performance_metrics,
            recent_trades: trades,
            last_error: bot.last_error
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})