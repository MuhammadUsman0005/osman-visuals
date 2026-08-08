import { supabase } from "@/integrations/supabase/client";

export const sendNotification = async ({
  user_id = null, // null = Global announcement
  type,
  title,
  message,
  action_url = null
}: {
  user_id?: string | null;
  type: string;
  title: string;
  message: string;
  action_url?: string | null;
}) => {
 const { error } = await (supabase as any)
  .from("notifications")
  .insert([{ user_id, type, title, message, action_url }]);
  
  if (error) console.error("Notification send error:", error);
};