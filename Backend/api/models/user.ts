import { z } from "zod"

export const userSchema = z.object({
    userId: z.string().uuid(),
    username: z.string().min(4),
    email: z.string().email(),
    password: z.string().min(8)
})

export const createUserSchema = userSchema.omit({ userId: true })

export const updateUserSchema = createUserSchema.partial();

export const emailSchema = z.object({
    email: z.string().email()
});

export const userIdSchema = z.string();

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});