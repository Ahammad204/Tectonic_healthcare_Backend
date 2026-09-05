import z from "zod";

export const ApplyAsDoctorValidationZodSchema = z.object({
  user: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
  }),
  doctor: z.object({
    specialization: z.string().trim().min(2, "Specialization is required"),
    licenseNumber: z.string().trim().min(1, "License number is required"),
    qualifications: z.string().trim().min(1, "Qualifications are required"),
    experienceYears: z
      .number()
      .int("Experience years must be an integer")
      .min(0, "Experience years must be a non-negative integer")
      .optional(),
    bio: z.string().trim().min(1, "Bio is required").optional(),
    consultationFee: z
      .number()
      .min(0, "Consultation fee must be a non-negative number")
      .optional(),
    contactNumber: z
      .string()
      .trim()
      .min(1, "Contact number is required")
      .optional(),
  }),
});
