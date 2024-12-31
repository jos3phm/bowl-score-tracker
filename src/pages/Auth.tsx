import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AuthChangeEvent } from "@supabase/supabase-js";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      if (session) {
        navigate("/");
      }

      // Handle auth events
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      }
    });

    return () => subscription.unsubscribe();
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
            <li>Check your email for confirmation after signing up</li>
          </ul>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb',
                  brandAccent: '#1d4ed8',
                }
              }
            }
          }}
          providers={[]}
          theme="light"
          localization={{
            variables: {
              sign_up: {
                password_input_placeholder: "Password (min. 6 characters)",
                email_input_placeholder: "Your email address"
              },
              sign_in: {
                password_input_placeholder: "Your password",
                email_input_placeholder: "Your email address"
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default AuthPage;