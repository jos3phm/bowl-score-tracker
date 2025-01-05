import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState<'sign_up' | 'sign_in'>('sign_in');

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("Session found, redirecting to home");
        navigate("/");
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN') {
        if (session) {
          console.log("New session detected, redirecting to home");
          // Ensure the profile exists before redirecting
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select()
            .eq('id', session.user.id)
            .single();

          if (profileError || !profile) {
            // Create profile if it doesn't exist
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email,
              });

            if (insertError) {
              console.error("Error creating profile:", insertError);
              toast({
                title: "Error",
                description: "There was a problem setting up your profile.",
                variant: "destructive",
              });
              return;
            }
          }
          
          navigate("/");
        }
      }

      if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Bowl Score Haven</h1>
        
        <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
          <p className="font-medium mb-2">Important Notes:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Password must be at least 6 characters long</li>
            <li>Make sure to use a valid email address</li>
            <li>Double-check your credentials when signing in</li>
            <li>If you forgot your password, use the reset option</li>
          </ul>
        </div>

        <div className="flex justify-center mb-4">
          <Button 
            variant={authMode === 'sign_in' ? 'default' : 'outline'}
            onClick={() => setAuthMode('sign_in')}
            className="mr-2"
          >
            Sign In
          </Button>
          <Button 
            variant={authMode === 'sign_up' ? 'default' : 'outline'}
            onClick={() => setAuthMode('sign_up')}
          >
            Sign Up
          </Button>
        </div>

        <Auth
          supabaseClient={supabase}
          view={authMode}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb',
                  brandAccent: '#1d4ed8',
                }
              }
            },
            className: {
              message: 'text-red-600 text-sm',
              button: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors',
              input: 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              label: 'block text-sm font-medium text-gray-700 mb-1',
            }
          }}
          providers={[]}
          theme="light"
          localization={{
            variables: {
              sign_up: {
                password_input_placeholder: "Password (min. 6 characters)",
                email_input_placeholder: "Your email address",
                button_label: "Create account"
              },
              sign_in: {
                password_input_placeholder: "Your password",
                email_input_placeholder: "Your email address",
                button_label: "Sign in"
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default AuthPage;