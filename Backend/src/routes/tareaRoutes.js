import { Router } from 'express';
import * as tareaController from '../controllers/tareaController.js';

const router = Router();

router.get('/', tareaController.listar);   // GET  /api/tareas
router.post('/', tareaController.crear);   // POST /api/tareas
router.put('/:id', tareaController.actualizar);     // PUT    /api/tareas/:id
router.delete('/:id', tareaController.eliminar);    // DELETE /api/tareas/:id

export default router;