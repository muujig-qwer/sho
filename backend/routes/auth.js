import express from 'express';
import { register, login, getProfile, updateProfile, getAllUsers, createAdmin } from '../controllers/authController.js';
import { protect , admin} from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/register', upload.single('image'), register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('image'), updateProfile);
router.get('/users',  getAllUsers);
router.post('/create-admin', protect, admin, createAdmin);

export default router;