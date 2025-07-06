import RestaurantOnboardingForm from "@/components/OnboardingForm";

// Force dynamic rendering since this page may use client-side features
export const dynamic = 'force-dynamic';

export default function OnboardingPage(){
    return <div>
        <RestaurantOnboardingForm />
    </div>
}