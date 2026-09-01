import { AppointmentStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { getBkashIdToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleware/checkAuth";

const bookAppointment = async (payload: any, user: RequestUser) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.create({
      data: {
        status: AppointmentStatus.PENDING,
      },
    });

    const bkashIdToken = await getBkashIdToken();

    if (!bkashIdToken) {
      throw new Error("No valid bkash access token");
    }

    const bkashCreatePaymentResponse = await fetch(
      `${config.bkash_base_url}/tokenized/checkout/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: bkashIdToken,
          "X-App-Key": config.bkash_app_key,
        },
        body: JSON.stringify({
          agreementID: "TokenizedMerchant01L3IKB6H1565072174986",
          mode: "0011",
          // payerReference: "01770618575",
          payerReference: user.email,
          callbackURL: `${config.bkash_callback_url}/appointment/book-appointment/payment/callback`,
          merchantAssociationInfo: "MI05MID54RF09123456One",
          amount: "1200",
          currency: "BDT",
          intent: "sale",
          // merchantInvoiceNumber: "Inv04",
          merchantInvoiceNumber: appointment.id,
        }),
      },
    );

    const bkashCreatePaymentResult = await bkashCreatePaymentResponse.json();

    await tx.payment.create({
      data: {
        merchantInvoiceNumber: bkashCreatePaymentResult.merchantInvoiceNumber,
        appointmentId: appointment.id,
        amount: "1200",
        gatewayResponse: bkashCreatePaymentResult,
        bkashPaymentId: bkashCreatePaymentResult.paymentID,
        payerReference: user.email,
      },
    });

    return bkashCreatePaymentResult.bkashURL;
  });

  return transactionResult;
};

const bookAppointmentCallback = async (query: Record<string, any>) => {
  const paymentId = query.paymentID;

  if (!paymentId) {
    throw new Error("There is no payment id");
  }

  const status = query.status;
  if (!status) {
    throw new Error("Payment status not found");
  }

  const bkashIdToken = await getBkashIdToken();
  if (!bkashIdToken) {
    throw new Error("No valid bkash access token");
  }

  const executePaymentResponse = await fetch(
    `${config.bkash_base_url}/tokenized/checkout/execute`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bkashIdToken,
        "X-App-Key": config.bkash_app_key,
      },
      body: JSON.stringify({
        paymentID: paymentId,
      }),
    },
  );

  const executePaymentResult = await executePaymentResponse.json();

  if (status === "success") {
    return {
      executePaymentResult,
      redirectUrl: `${config.frontend_url}/dashboard/my-appointment?status=success`,
    };
  }
  if (status === "failure") {
    return {
      executePaymentResult,
      redirectUrl: `${config.frontend_url}/dashboard/my-appointment?status=failure`,
    };
  }
  if (status === "cancel") {
    return {
      executePaymentResult,
      redirectUrl: `${config.frontend_url}/dashboard/my-appointment?status=cancel`,
    };
  }

  return {
    executePaymentResult,
    redirectUrl: `${config.frontend_url}/dashboard/my-appointment`,
  };
};

export const AppointmentServices = {
  bookAppointment,
  bookAppointmentCallback,
};
