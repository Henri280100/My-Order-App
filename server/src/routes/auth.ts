import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.post('/register', controllers.registerCtrl);
router.post('/login', controllers.loginCtrl);
router.post('/refresh-token', controllers.refreshTokenCtrl);
router.post('/logout', controllers.logoutUserCtrl);
router.get('/verify/:id/:token', controllers.verificationCtrl);
router.post('/forgot-password', controllers.forgotPasswordCtrl);
router.post('/reset-password/:id/:token', controllers.resetPasswordCtrl);

export default router;
