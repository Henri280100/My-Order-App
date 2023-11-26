import express from 'express';
import { partnerRegisterCtrl, verifyEmailCtrl } from '../controllers';

const router = express.Router();

router.post('/new-partner/register', partnerRegisterCtrl);
router.put('/new-partner/verify-email', verifyEmailCtrl);

export default router;
