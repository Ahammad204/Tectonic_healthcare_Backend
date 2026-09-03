import { catchAsync } from "../../utils/catchAsync";
import { DoctorServices } from "./doctor.service";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";

const applyAsDoctor = catchAsync(async (req: Request, res: Response) => {
  // const result = await DoctorServices.applyAsDoctor();

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const resume = files?.["resume"] ? files["resume"][0] : null;
  const additionalFiles = files?.["additionalFiles"] || [];
  const data = JSON.parse(req.body.data ); 

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Doctor application submitted successfully",
    data: {},
  });
});

export const DoctorController = {
  applyAsDoctor,
};
