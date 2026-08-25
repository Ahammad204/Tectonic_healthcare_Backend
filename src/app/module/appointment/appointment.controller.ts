import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AppointmentServices } from "./appointment.service";

const bookAppointment = catchAsync(async (req: Request, res: Response) => {
  const result = await AppointmentServices.bookAppointment();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Image Updated successfully",
    data: result,
  });
});
const bookAppointmentCallback = catchAsync(
  async (req: Request, res: Response) => {
    const { executePaymentResult, redirectUrl } =
      await AppointmentServices.bookAppointmentCallback(req.query);

    res.redirect(redirectUrl);

    // sendResponse(res, {
    //   statusCode: httpStatus.CREATED,
    //   success: true,
    //   message: "bkash payment successfully",
    //   data: null,
    // });
  },
);

export const AppointmentController = {
  bookAppointment,
  bookAppointmentCallback,
};
