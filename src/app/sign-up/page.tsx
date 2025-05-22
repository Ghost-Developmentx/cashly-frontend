'use client';

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <SignUp path="/sign-up" routing="path" forceRedirectUrl="/complete-auth" />
        </div>
    )
}