'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function CompleteAuthPage() {
  const { getToken, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      try {
        const token = await getToken();
        if (!token) {
          console.error("❌ No token received from Clerk");
          return;
        }

        // First sync the user
        const res = await fetch(`${apiUrl}/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          console.log("✅ User data:", userData);

          // Check onboarding status and redirect accordingly
          if (userData.onboarding_completed) {
            router.push("/dashboard");
          } else {
            router.push("/onboarding");
          }
        } else {
          console.error("❌ Failed to sync user");
          router.push("/sign-in");
        }
      } catch (err) {
        console.error("💥 Network error:", err);
        router.push("/sign-in");
      }
    };

    syncUser();
  }, [getToken, isLoaded, router]);

  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Setting up your account...</p>
        </div>
      </div>
  );
}
