import * as user from '../controllers';
import express from 'express';
import verifyToken from '../middleware/verify-token.middleware';
import { isAdmin, isModeratorOrAdmin } from '../middleware/verify-roles.middleware';

const router = express.Router();
// PUBLIC ROUTES

// PRIVATE ROUTES
router.use(verifyToken);
router.use(isModeratorOrAdmin);
router.get('/', user.getCurrent);

export default router;
