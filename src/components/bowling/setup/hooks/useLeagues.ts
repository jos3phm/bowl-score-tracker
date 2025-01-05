import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useLeagues = (locationId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leagues } = useQuery({
    queryKey: ['leagues', locationId],
    queryFn: async () => {
      if (!locationId) return [];
      
      const { data, error } = await supabase
        .from('leagues')
        .select('id, name, location_id')
        .eq('location_id', locationId)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
    enabled: !!locationId,
  });

  const handleAddLeague = async (name: string) => {
    if (!locationId) {
      toast({
        title: "Error",
        description: "Please select a location first",
        variant: "destructive",
      });
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) {
      toast({
        title: "Error",
        description: "Please sign in to create a league",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('leagues')
      .insert([{
        name,
        location_id: locationId,
        is_active: true,
        created_by: userData.user.id
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add league",
        variant: "destructive",
      });
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ['leagues', locationId] });
    toast({
      title: "Success",
      description: "League added successfully",
    });

    return data;
  };

  return { leagues, handleAddLeague };
};