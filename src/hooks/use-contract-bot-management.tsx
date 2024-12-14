import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export function useContractBotManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startBot = useCallback(async (botId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('contract-bot-management', {
        body: { action: 'start', botId }
      });

      if (error) throw error;

      toast({
        title: 'Bot Started',
        description: data.message,
      });

      queryClient.invalidateQueries({ queryKey: ["contract-bots"] });
      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, queryClient]);

  const stopBot = useCallback(async (botId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('contract-bot-management', {
        body: { action: 'stop', botId }
      });

      if (error) throw error;

      toast({
        title: 'Bot Stopped',
        description: data.message,
      });

      queryClient.invalidateQueries({ queryKey: ["contract-bots"] });
      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, queryClient]);

  return {
    startBot,
    stopBot,
  };
}