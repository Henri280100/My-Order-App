import * as user from '../controllers';
import express from 'express';
import verifyToken from '../middleware/verify-token.middleware';
import {
	isAdmin,
	isMod,
	isModeratorOrAdmin,
} from '../middleware/verify-roles.middleware';
import upload from '../middleware/upload.middleware';

const router = express.Router();
// PUBLIC ROUTES
router.put('/update-user/:id', upload.single('image'), user.updateUserCtrl);
router.get('/all-users', user.getALlUserCtrl);
router.get('/user-id/:id', user.getUserByIdCtrl);
router.delete('/delete/:id', user.deleteUserCtrl);
// PRIVATE ROUTES
// router.use(verifyToken);
// router.use('',isModeratorOrAdmin);
// router.use(isAdmin);
// router.use(isMod);
router.get('/admin', [verifyToken, isAdmin], user.getCurrentCtrl);
router.get('/mod', [verifyToken, isMod], user.getCurrentCtrl);
export default router;
