import Login from "@/features/auth/components/Login";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return <Login />;
}
