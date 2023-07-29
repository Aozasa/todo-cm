import express from 'express';
import { createSession, deleteSession } from '../../../controllers/sessionController';
const router = express.Router();

router.post('/', createSession);
router.delete('/', deleteSession);

module.exports = router;
