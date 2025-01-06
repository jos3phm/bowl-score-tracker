import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History, BarChart3, UserRound, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GameSetupForm } from "../bowling/setup/GameSetupForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Dashboard = () => {
  const navigate = useNavigate();

  const { data: activeSession, isLoading: sessionLoading } = useQuery({
    queryKey: ['activeSession'],
    queryFn: async () => {
      const { data: session, error } = await supabase
        .from('game_sessions')
        .select(`
          *,
          bowling_locations (name),
          leagues (name),
          tournaments (name),
          games (id)
        `)
        .is('ended_at', null)
        .single();

      if (error) {
        console.error('Error fetching active session:', error);
        return null;
      }
      return session;
    }
  });

  const { data: recentGames, isLoading: gamesLoading } = useQuery({
    queryKey: ['recentGames'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent games:', error);
        return [];
      }
      return data;
    }
  });

  const averageScore = recentGames?.reduce((sum, game) => sum + (game.total_score || 0), 0) / (recentGames?.length || 1);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Bowl Score Haven</h1>
      
      {sessionLoading || gamesLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : activeSession ? (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Active Session</CardTitle>
            <CardDescription>
              {activeSession.bowling_locations?.name || 'Unknown Location'}
              {activeSession.leagues?.name && ` - ${activeSession.leagues.name}`}
              {activeSession.tournaments?.name && ` - ${activeSession.tournaments.name}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Games in session: {activeSession.games?.length || 0}
              </p>
              <Button onClick={() => navigate('/new-game')}>
                Continue Session
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <GameSetupForm />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-secondary" />
              Recent Performance
            </CardTitle>
            <CardDescription>Your recent bowling stats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Recent Games: {recentGames?.length || 0}</p>
              <p>Average Score: {averageScore ? Math.round(averageScore) : 'N/A'}</p>
            </div>
            <Button 
              variant="secondary" 
              className="w-full mt-4"
              onClick={() => navigate("/stats")}
            >
              View Stats
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-blue-500" />
              Game History
            </CardTitle>
            <CardDescription>Review your past games</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/history")}
            >
              View History
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="h-5 w-5 text-green-500" />
              Profile
            </CardTitle>
            <CardDescription>Manage your bowling profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/profile")}
            >
              View Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};