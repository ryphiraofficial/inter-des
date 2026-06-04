import express from 'express';
import { login, logout } from '../../controllers/shared/authLoginController.js';
import { register } from '../../controllers/shared/authRegistrationController.js';
import { getMe, updateDetails, updatePassword } from '../../controllers/shared/authProfileController.js';

const router = express.Router();

import { protect } from '../../middleware/auth.js';

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

export default router;
