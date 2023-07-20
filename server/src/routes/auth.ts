import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.post('/register', controllers.register);
router.post('/login', controllers.login);
router.post('/refresh-token', controllers.refreshTokenController);
router.post('/logout', controllers.logoutUser);
router.get('/verify/:id/:token', controllers.verification);

export default router;
