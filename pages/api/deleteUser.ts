import { NextApiHandler } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getServiceSupabase } from "../../utils/supabaseClient";

const ProtectedRoute: NextApiHandler = async (req, res) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient({ req, res });
  const supabaseService = getServiceSupabase();
  // const supabaseService = getServiceSupabase;
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

  let { data, error } = await supabaseService.auth.admin.deleteUser(
    req.body.id
  );

  console.log(data);
  console.log(error);

  res.json(data);
};

export default ProtectedRoute;
