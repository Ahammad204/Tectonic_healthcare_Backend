import { UploadApiResponse } from "cloudinary";
import { prisma } from "../../lib/prisma";
import { IApplyAsDoctorPayload } from "./doctor.interface";
import { cloudinary } from "../../lib/cloudinary";
import config from "../../config";
import bcrypt from "bcryptjs";
import { Role } from "../../../generated/prisma/enums";

const applyAsDoctor = async (
  payload: IApplyAsDoctorPayload,
  resume: Express.Multer.File,
  additionalFiles: Express.Multer.File[],
) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isUserExists) {
    throw new Error("User with this email already exists");
  }
  const resumeResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
          },
          async (error, result) => {
            if (error) {
              // throw new Error(error.message);
              return reject(error);
            }

            if (!result) {
              return reject(new Error("No result return from cloudinary"));
            }

            resolve(result);
          },
        )
        .end(resume?.buffer);
    },
  );

  const additionalFilesResult = await Promise.all(
    additionalFiles.map(
      (file) =>
        new Promise<UploadApiResponse>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "auto",
              },
              async (error, result) => {
                if (error) {
                  // throw new Error(error.message);
                  return reject(error);
                }

                if (!result) {
                  return reject(
                    new Error("No result returned from cloudinary"),
                  );
                }

                resolve(result);
              },
            )
            .end(file?.buffer);
        }),
    ),
  );

  const randomDoctorPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(
    randomDoctorPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const doctorApplication = await prisma.user.create({
    data: {
      ...payload.user,
      password: hashedPassword,
      role: Role.DOCTOR,

      doctor: {
        create: {
          name: payload.user.name,
          email: payload.user.email,
          contactNumber: payload.user.contactNumber,
          specialization: payload.doctor.specialization,
          experience: payload.doctor.experience,
          ...payload.doctor,
          resumeUrl: resumeResult.secure_url,
          resumePublicId: resumeResult.public_id,
          additionalFiles: additionalFilesResult.map((file) => ({
            url: file.secure_url,
            publicId: file.public_id,
          })),
        },
      },
    },
  });

  return doctorApplication;
};

export const DoctorServices = {
  applyAsDoctor,
};
