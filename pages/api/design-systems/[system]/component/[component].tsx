import { NextApiHandler } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const getComponentAPI: NextApiHandler = async (req, res) => {
  const { system, component } = req.query;
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient({ req, res });
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return res.status(401).json({
      error: "not_authenticated",
      description:
        "The user does not have an active session or is not authenticated",
    });

  // Run queries with RLS on the server
  const { data } = await supabase
    .from("component")
    .select("*")
    .filter("id", "eq", component)
    .single();
  res.json(data);
};

export default getComponentAPI;
