import { Router } from 'express';
import * as tareaController from '../controllers/tareaController.js';

const router = Router();

router.get('/', tareaController.listar);   // GET  /api/tareas
router.post('/', tareaController.crear);   // POST /api/tareas

export default router;