import { Suspense } from "react";
import SignupComponent from "@/components/Signup";

export default function SignupPage(){
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <SignupComponent />
        </Suspense>
    );
}