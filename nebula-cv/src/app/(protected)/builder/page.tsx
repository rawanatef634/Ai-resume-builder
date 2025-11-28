// src/app/(protected)/builder/page.tsx (Server Component)

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/utils/supabase/server'
import { BuilderClient } from './BuilderClient';

// Import all necessary types from the Client file
import { 
  DbResumeRow, 
  ResumeSummary, 
  DEFAULT_HEADER,
  ResumeHeader 
} from './BuilderClient'; 

// Data structure passed from Server to Client
type InitialData = {
  initialResume: DbResumeRow | null;
  resumesList: ResumeSummary[];
  userPlan: 'free' | 'pro';
};

export default async function BuilderPageServer() {
  const cookieStore = cookies();
  const supabase = await createSupabaseServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Redirect to login if no user
  if (!user) {
    redirect('/login');
  }

  // 2. Fetch User Profile/Plan
  const { data: profileData } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const userPlan = (profileData?.plan === "pro" ? "pro" : "free") as 'free' | 'pro';

  // 3. Fetch all resumes (including full JSON for the latest one)
  const { data: resumesData, error } = await supabase
    .from("resumes")
    .select("id, title, updated_at, resume_json")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching resumes:", error);
  }

  let initialResume: DbResumeRow | null = null;
  const resumesList: ResumeSummary[] = [];

  if (resumesData && resumesData.length > 0) {
    // Set the latest resume as the initial one
    initialResume = resumesData[0] as DbResumeRow;
    
    // Populate the summary list for the dropdown
    resumesData.forEach((row: any) => {
      resumesList.push({
        id: row.id,
        title: row.title,
        updated_at: row.updated_at,
      });
    });
  }

  const initialData: InitialData = {
    initialResume,
    resumesList,
    userPlan,
  };

  // Pass all data to your Client Component
  return <BuilderClient initialData={initialData} />;
}