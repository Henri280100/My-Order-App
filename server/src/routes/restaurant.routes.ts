import express from 'express';
import {
	merchantLoginCtrl,
	partnerRegisterCtrl,
	restaurantCtrl,
	storeDetailInfoCtrl,
	verifyEmailCtrl,
} from '../controllers';
import { upload } from '../middleware/multer.middleware';

const router = express.Router();

router.post('/new-partner/register', partnerRegisterCtrl);
router.put('/new-partner/verify-email', verifyEmailCtrl);
router.post(
	'/new-partner/restaurant-detail-form',
	upload.fields([
		{ name: 'storeImg', maxCount: 2 },
		{ name: 'kitchenImg', maxCount: 2 },
		{ name: 'menuImg', maxCount: 2 },
	]),
	storeDetailInfoCtrl
);
router.post(
	'/new-partner/restaurant',
	upload.single('restaurantImg'),
	restaurantCtrl
);
router.post('/new-partner/detail-form');
// Merchant
router.post('/merchant-login', merchantLoginCtrl);
// get merchant information
// update merchant information
// merchant statistics
// revenue
// merchant menu
// warehouse
// Employees
export default router;
