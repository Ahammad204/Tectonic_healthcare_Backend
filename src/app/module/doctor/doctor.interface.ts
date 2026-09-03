export interface IApplyAsDoctorPayload {
  name: string;
  email: string;
  contactNumber: string;
  specialization: string;
  experience: number;
  user: any;
  doctor: any;
  resumeUrl: string;
  resumePublicId: string;
  additionalFiles?: {
    url: string;
    publicId: string;
  }[];
}
