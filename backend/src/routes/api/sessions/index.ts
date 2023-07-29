import express from 'express';
import { createSession, deleteSession, verifySession } from '../../../controllers/sessionController';
import { verifyMiddleware } from '../../../controllers/applicationController';
const router = express.Router();

router.post('/', createSession);
router.get('/', verifyMiddleware, verifySession);
router.delete('/', deleteSession);

module.exports = router;
