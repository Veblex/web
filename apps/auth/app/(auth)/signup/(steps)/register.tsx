import { z } from "zod";

const schema = z
    .object({
        step: z.literal(3),
        name: z.string().min(2, "Name must be at least 2 characters"),
        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(20)
            .regex(
                /^[a-z0-9_]+$/,
                "Only lowercase letters, numbers, and underscores"
            ),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must contain an uppercase letter")
            .regex(/[0-9]/, "Must contain a number"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export function Register() {
    return <p>Register</p>;
}
