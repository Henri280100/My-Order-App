import * as controllers from '../controllers';
import express from 'express';
import uploadCloud from '../middleware/uploader.middleware';
import upload from '../middleware/upload.middleware';

const router = express.Router();

router.post(
	'/register',
	uploadCloud.single('avatar'),
	controllers.registerCtrl
);
router.post('/login', controllers.rateLimitedLoginCtrl);
router.post('/refresh-token', controllers.refreshTokenCtrl);
// router.post('/revoke-token', revokeToken);
router.post('/logout', controllers.logoutUserCtrl);
router.get(
	'/email-verification;id=:id;accessToken=:accessToken',
	controllers.verificationCtrl
);
router.post('/resend-verification-email', controllers.resendVerificationEmail);
router.post('/forgot-password', controllers.forgotPasswordCtrl);
router.post('/reset-password/:id/:token', controllers.resetPasswordCtrl);
router.post(
	'/upload',
	uploadCloud.single('avatar'),
	controllers.uploadAvatarCtrl
);

export default router;
