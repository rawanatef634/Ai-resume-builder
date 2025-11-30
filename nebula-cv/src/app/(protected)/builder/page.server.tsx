// example: src/app/builder/page.server.tsx (server component wrapper)
import { redirect } from "next/navigation";
import { createServerClient } from "@/utils/supabase/server";

export default async function BuilderServerPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // redirect to login (optional add ?redirectTo=)
    redirect(`/login?redirectTo=/builder`);
  }

  // return your page (can render client component inside)
  return <div>{/* render Builder client bundle here */}</div>;
}
