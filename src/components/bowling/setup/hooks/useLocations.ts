import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useLocations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bowling_locations')
        .select('id, name, address, city, state')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddLocation = async (locationData: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
  }) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) {
      toast({
        title: "Error",
        description: "Please sign in to add a location",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('bowling_locations')
      .insert([{ ...locationData, created_by: userData.user.id }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add location",
        variant: "destructive",
      });
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ['locations'] });
    toast({
      title: "Success",
      description: "Location added successfully",
    });

    return data;
  };

  return { locations, handleAddLocation };
};