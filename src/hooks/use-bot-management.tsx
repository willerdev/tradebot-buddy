import { useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/integrations/supabase/client'

export function useBotManagement() {
  const { toast } = useToast()

  const startBot = useCallback(async (botId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('bot-management', {
        body: { action: 'start', botId }
      })

      if (error) throw error

      toast({
        title: 'Bot Started',
        description: data.message,
      })

      return data
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
      throw error
    }
  }, [toast])

  const stopBot = useCallback(async (botId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('bot-management', {
        body: { action: 'stop', botId }
      })

      if (error) throw error

      toast({
        title: 'Bot Stopped',
        description: data.message,
      })

      return data
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
      throw error
    }
  }, [toast])

  const getBotStatus = useCallback(async (botId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('bot-management', {
        body: { action: 'status', botId }
      })

      if (error) throw error
      return data
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
      throw error
    }
  }, [toast])

  return {
    startBot,
    stopBot,
    getBotStatus,
  }
}