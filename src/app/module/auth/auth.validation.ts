import z from "zod";

const patientRegistrationZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  patient: z
    .object({
      contactNumber: z
        .string()
        .min(10, { message: "Contact number must be at least 10 digits long" })
        .optional(),
    })
    .optional(),
});

export const PatientValidation = {
  patientRegistrationZodSchema,
};
