import express from 'express';
import {
  createSession,
  deleteSession,
  refreshTokenSession,
  verifySession,
} from '../../../controllers/sessionController';
import { verifyMiddleware } from '../../../controllers/applicationController';
const router = express.Router();

router.post('/', createSession);
router.get('/', verifyMiddleware, verifySession);
router.delete('/', deleteSession);
router.post('/refresh', refreshTokenSession);

module.exports = router;
