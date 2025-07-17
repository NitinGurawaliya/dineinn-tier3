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
  subdomain: zod.string()
    .min(3, { message: 'Subdomain must be at least 3 characters' })
    .max(63, { message: 'Subdomain must be at most 63 characters' })
    .regex(/^[a-z0-9-]+$/, { message: 'Subdomain can only contain lowercase letters, numbers, and hyphens' }),
});

export const editRestaurantDetailsSchema = zod.object({
  restaurantName: zod.string(),
  contactNumber: zod.string(),
  location: zod.string(),
  weekdaysWorking: zod.string().optional(),
  weekendWorking: zod.string().optional(),
  instagram: zod.string().optional(),
  facebook: zod.string().optional(),
  logo: zod.string().optional(),
})

export const RatingSchema = zod.object({
  stars:zod.number(),
  message:zod.string().optional(),
})

export const AnnouncementSchema = zod.object({
  title:zod.string(),
  content:zod.string()
})