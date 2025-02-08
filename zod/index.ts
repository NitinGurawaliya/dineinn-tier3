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
  restaurantName: zod.string(),
  contactNumber: zod.string(),
  location: zod.string(),
  weekdaysWorking: zod.string().optional(),
  weekendWorking: zod.string().optional(),
  instagram: zod.string().optional(),
  facebook: zod.string().optional(),
  logo: zod.string().optional(),
});
