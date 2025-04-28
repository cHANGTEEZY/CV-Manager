import { supabase } from "@/utils/supabaseClient";
import { toast } from "sonner";

const useLogout = () => {
  const signout = async () => {
    await supabase.auth.signOut({ scope: "local" });
    toast.success("Signed out successfully!");
  };
  return signout;
};

export default useLogout;
