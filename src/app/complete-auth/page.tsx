'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function CompleteAuthPage() {
  const { getToken, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded) {
        console.log("🔄 Clerk is not loaded yet");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log("✅ Clerk is loaded");
      console.log("🌐 API URL is:", apiUrl);

      try {
        const token = await getToken();
        console.log("🔑 Fetched Clerk JWT:", token?.substring(0, 20), "...");

        if (!token) {
          console.error("❌ No token received from Clerk");
          return;
        }

        console.log("📡 Making request to:", `${apiUrl}/me`);

        const res = await fetch(`${apiUrl}/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📥 Response status:", res.status);

        if (res.ok) {
          const json = await res.json();
          console.log("✅ Synced user:", json);
          router.push("/dashboard");
        } else {
          const errorText = await res.text();
          console.error("❌ Failed to sync user —", res.status, errorText);
        }
      } catch (err) {
        console.error("💥 Network or fetch error:", err);
      }
    };

    syncUser();
  }, [getToken, isLoaded, router]);

  return (
    <div className="p-4 text-center">
      <p className="text-gray-600">Finishing sign-in...</p>
    </div>
  );
}
