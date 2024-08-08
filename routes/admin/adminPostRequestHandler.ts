import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { sendResetPasswordEmail } from '@messaging/email';
import {
  getAdminAndProfileDataByEmailOrUsername,
  lookupPrimaryAdminInfo,
  getAdminPrimaryLoginInformation,
  getSearchAdminData,
} from '@datastore/admin/adminGetStore';
import { createNewAdmin } from '@datastore/admin/adminPostStore';
import { updateAdminData } from '@datastore/admin/adminPutStore';
import { LoginRequestSchema } from '../../schemas/commonSchemas';
import {
  createAdminRequestSchema,
  passwordResetRequestSchema,
  searchAdminRequestSchema,
} from '../../schemas/adminSchemas';
import { authorizeRequest } from '@middlewares/jwt';
import {
  generateJSONTokenCredentials,
  generateJWTAccessToken,
  generateJWTRefreshToken,
  generatePasswordHash,
  generateTemporaryPassCode,
  validatePassword,
} from '@util/index';
import {
  SEVEN_TWO_DAYS_SECONDS,
  TWENTY_FOUR_HOURS_SECONDS,
} from '@util/config';
import redisClient from '@lib/redis';

const adminPostRequestHandler = Router();

adminPostRequestHandler.post(
  `/login`,
  async (req: Request, res: Response, next: NextFunction) => {
    let responseMessage = 'Incorrect Credentials',
      success = false;
    try {
      const requestBody = LoginRequestSchema.parse(req.body);

      const admin = await getAdminPrimaryLoginInformation(requestBody.email);

      if (validatePassword(requestBody.password, admin?.password ?? '')) {
        const jwtData = {
          id: admin?.id,
          email: admin?.email,
          role: admin?.role,
          siteId: admin?.siteId,
          rememberMe: requestBody.rememberMe,
        };

        const accessToken = generateJWTAccessToken(
          jwtData,
          requestBody.rememberMe
        );
        const refreshToken = generateJWTRefreshToken(
          jwtData,
          requestBody.rememberMe
        );

        await redisClient.setRedisKey(
          admin?.id ?? '',
          refreshToken,
          requestBody?.rememberMe
            ? SEVEN_TWO_DAYS_SECONDS
            : TWENTY_FOUR_HOURS_SECONDS
        );
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: true,
        });
        responseMessage = 'Login Successful';
        success = true;
      }

      return JsonApiResponse(
        res,
        responseMessage,
        success,
        {
          role: admin?.role,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

// Create new admin
adminPostRequestHandler.post(
  '/create',
  authorizeRequest(['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'SITE_ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = createAdminRequestSchema.parse(req.body);

      // Set a temporary password if no password is set
      const tempPassword = generateTemporaryPassCode();

      requestBody.password = generatePasswordHash(
        requestBody?.password ?? tempPassword
      );

      const newAdmin = await createNewAdmin(requestBody);

      // // If password is set, then do not publish the tempPassword
      // if (newAdmin.success as boolean) {
      //   emitNewEvent(CREATE_ADMIN_QUEUE_NAME, {
      //     email: requestBody.email,
      //     firstName: requestBody?.firstName,
      //     lastName: requestBody?.lastName,
      //     tempPassword: tempPassword,
      //   });
      // }

      return JsonApiResponse(
        res,
        newAdmin.message,
        newAdmin.success,
        null,
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

// Search Admin
adminPostRequestHandler.post(
  '/search',
  authorizeRequest([
    'SUPER_ADMIN',
    'SITE_ADMIN',
    'HUMAN_RESOURCES',
    'HOSPITAL_ADMIN',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = searchAdminRequestSchema.parse(req.body);

      const { data, success, message } = await getSearchAdminData(requestBody);

      return JsonApiResponse(
        res,
        message,
        success,
        {
          admins: data[0],
          totalRows: data[1],
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Initiates a password reset process for an admin user by sending an email with a temporary token.
 * This endpoint accepts an email address, verifies if it is associated with an existing admin user,
 * and sends a reset token if the user is found.
 *
 * @route POST /admin/password-reset-requests
 * @param {string} email - The email address associated with the admin account for which a password reset is requested.
 * @returns {JSON} If successful, sends a password reset email and returns a success message.
 *                 If the email is not found, returns an error message indicating the user was not found.
 */
adminPostRequestHandler.post(
  `/password-reset-requests`,
  async (req: Request, res: Response, next: NextFunction) => {
    let responseMessage = 'User with email or username not found',
      success = false;
    try {
      const requestBody = passwordResetRequestSchema.parse({
        ...req.body,
      });

      const user = await lookupPrimaryAdminInfo(requestBody.email);

      if (user) {
        const token = generateJSONTokenCredentials(
          {
            id: user?.id,
            email: user?.email,
            role: user?.role,
          },
          Math.floor(Date.now() / 1000) + 60 * 10
        );

        const passwordResetEmailResponse = await sendResetPasswordEmail(
          user?.email,
          token,
          user?.personalInfo?.first_name
        );

        if (passwordResetEmailResponse.accepted.length !== 0) {
          return JsonApiResponse(
            res,
            `Password reset link sent to ${user?.email ?? ''}`,
            true,
            null,
            401
          );
        }
      } else {
        return JsonApiResponse(res, responseMessage, success, null, 401);
      }
    } catch (error) {
      next(error);
    }
  }
);

// Verify Admin Email, Username data, and send SMS to user number
adminPostRequestHandler.post(
  `/password/reset/user_verification/sms`,
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Passcode is send to the admin registered phone number',
      success = true;

    const { email } = req.body;

    try {
      const user = await getAdminAndProfileDataByEmailOrUsername(
        email as string
      );

      if (user) {
        const passwordResetCode = generateTemporaryPassCode();
        // await twilioSendSMSMessage(
        //   user?.personalInfo?.phone ?? '',
        //   `Your Temporary Code Is ${passwordResetCode}`
        // );

        const { ...adminData } = user;

        const updateUser = {
          ...adminData,
          password_reset_code: passwordResetCode,
          password_reset_request_timestamp: new Date(),
        };

        const updatedUser = await updateAdminData(user.id, updateUser);

        if (!updatedUser) {
          message = 'Error occurred while sending passcode';
          success = false;
        }
      } else {
        message = 'No User is registered with the provided Email or Username';
        success = false;
      }

      return JsonApiResponse(res, message, success, null, 200);
    } catch (error) {
      next(error);
    }
  }
);

// Verify Admin Email, Username data, and Call user number
adminPostRequestHandler.post(
  `/password/reset/user_verification/direct-call`,
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Passcode is send to the admin registered phone number',
      success = true;

    const { email } = req.body;

    try {
      const user = await getAdminAndProfileDataByEmailOrUsername(
        email as string
      );

      if (user) {
        const passwordResetCode = generateTemporaryPassCode();
        // await twilioSendAudioMessage(
        //   user?.personalInfo?.phone ?? '',
        //   `Your Temporary Code Is ${passwordResetCode}`
        // );

        const { ...adminData } = user;

        const updateUser = {
          ...adminData,
          password_reset_code: passwordResetCode,
          password_reset_request_timestamp: new Date(),
        };

        const updatedUser = await updateAdminData(user.id, updateUser);

        if (!updatedUser) {
          message = 'Error occurred while sending passcode';
          success = false;
        }
      } else {
        message = 'No User is registered with the provided Email or Username';
        success = false;
      }

      return JsonApiResponse(res, message, success, null, 200);
    } catch (error) {
      next(error);
    }
  }
);

// Verify Admin Email, Username data, and send code to user WhatsApp
adminPostRequestHandler.post(
  `/password/reset/user_verification/whatsApp`,
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Passcode is send to the admin registered phone number',
      success = true;

    const { email } = req.body;

    try {
      const user = await getAdminAndProfileDataByEmailOrUsername(
        email as string
      );

      if (user) {
        const passwordResetCode = generateTemporaryPassCode();
        // await twilioSendWhatsAppMessage(
        //   user?.personalInfo?.phone ?? '',
        //   `Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification. Thank you for taking the time to test with us.`
        // );

        const { ...adminData } = user;

        const updateUser = {
          ...adminData,
          password_reset_code: passwordResetCode,
          password_reset_request_timestamp: new Date(),
        };

        const updatedUser = await updateAdminData(user.id, updateUser);

        if (!updatedUser) {
          message = 'Error occurred while sending passcode';
          success = false;
        }
      } else {
        message = 'No User is registered with the provided Email or Username';
        success = false;
      }

      return JsonApiResponse(res, message, success, null, 200);
    } catch (error) {
      next(error);
    }
  }
);

export default adminPostRequestHandler;
