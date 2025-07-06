import { Suspense } from "react";
import SigninComponent from "@/components/Signin";

export default function Signin(){
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <SigninComponent />
        </Suspense>
    );
}