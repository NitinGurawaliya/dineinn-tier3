import zod from "zod"


export const signupSchema = zod.object({
    name:zod.string(),
    email:zod.string().email(),
    password:zod.string().min(6)
})

export const signinSchema = zod.object({
    email:zod.string().email(),
    password:zod.string().min(6)
})

export const restaurantOnboardingSchema = zod.object({
    restaurantName :zod.string(),
    contactNumber :zod.string(),
    location:zod.string(),
    WeekendWorking:zod.string().optional(),
    WeekdaysWorking :zod.string().optional(),
    Logo:zod.string().optional(),              
    Instagram:zod.string().optional(),
    Facebook:zod.string().optional()
})