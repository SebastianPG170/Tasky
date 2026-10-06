import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/login', authController.login);    // POST /api/auth/login
router.post('/logout', authController.logout);  // POST /api/auth/logout
router.get('/me', authController.me);           // GET  /api/auth/me
router.post('/registro', authController.registro); // POST /api/auth/registro

export default router;