import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * AI tools other than the front-page search require a signed-in session
 * (the backend validates the JWT). Returns false and nudges the user when
 * there is no session.
 */
export async function ensureSignedIn(feature = "this feature"): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  if (data.session) return true;
  toast({
    title: "Sign in required",
    description: `Please sign in to use ${feature}. It is free and takes a minute.`,
    variant: "destructive",
  });
  return false;
}
