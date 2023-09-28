import type { NextApiHandler } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../infrastructure/supabaseSchema";
import { TokenService } from "../../../infrastructure/TokensService";

const confirmHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.end(400).json({ error: "Invalid HTTP method" });
    return;
  }

  const supabase = createPagesServerClient<Database>(
    { req, res },
    {
      options: {
        global: {
          headers: {
            Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"}`,
          },
        },
      },
    }
  );

  const refreshToken = req.cookies["sb-refresh-token"];
  const accessToken = req.cookies["sb-access-token"];

  if (refreshToken && accessToken) {
    const {
      data: { user },
    } = await supabase.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    });

    if (!user) {
      res.status(400).json({ error: "Invalid refresh and/or access token" });
      return;
    }

    // When user confirms their account, we create a default organization for them.
    const insertOrganizationResult = await supabase
      .from("organizations")
      .insert({
        name: `${user.email}'s organization`,
      })
      .select("id");

    if (insertOrganizationResult.data) {
      // After the organization is created, we add the user to the organization.
      const insertOrganizationUserResult = await supabase
        .from("organizations_users")
        .insert({
          organization_id: insertOrganizationResult.data[0].id,
          user_id: user.id,
        });

      if (!insertOrganizationUserResult.error) {
        // Finally, we create a default project for the user in his organization.
        const insertProjectResult = await supabase
          .from("projects")
          .insert({
            name: `${user.email}'s project`,
            organization_id: insertOrganizationResult.data[0].id,
          })
          .select("id");

        if (!insertProjectResult.error) {
          const projectId = insertProjectResult.data[0].id;
          const token = TokenService.getAccessToken(projectId);

          await supabase
            .from("projects")
            .update({
              tokens: [token],
            })
            .eq("id", projectId);
        }
      }
    }

    res.redirect("/");
  } else {
    res.status(400).json({ error: "No refresh or access token" });
  }
};

export default confirmHandler;
