import { BowlingGame } from "@/components/bowling/BowlingGame";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const NewGame = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');

  const { data: activeGame, isLoading } = useQuery({
    queryKey: ['activeGame', gameId],
    queryFn: async () => {
      if (!gameId) return null;

      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching game:', error);
        return null;
      }

      return data;
    },
    enabled: !!gameId
  });

  useEffect(() => {
    const checkAndCreateGame = async () => {
      if (!gameId && !isLoading) {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/');
          return;
        }

        // Get active session
        const { data: session } = await supabase
          .from('game_sessions')
          .select('id')
          .is('ended_at', null)
          .maybeSingle();

        if (!session) {
          navigate('/');
          return;
        }

        // Create new game in the session
        const { data: newGame, error } = await supabase
          .from('games')
          .insert([{
            session_id: session.id,
            game_type: 'practice',
            game_start_time: new Date().toISOString(),
            user_id: user.id // Add the user_id field
          }])
          .select()
          .single();

        if (error) {
          console.error('Error creating game:', error);
          navigate('/');
          return;
        }

        // Update URL with new game ID
        navigate(`/new-game?gameId=${newGame.id}`, { replace: true });
      }
    };

    checkAndCreateGame();
  }, [gameId, isLoading, navigate]);

  if (!gameId || isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <BowlingGame gameId={gameId} />
      </div>
    </div>
  );
};

export default NewGame;