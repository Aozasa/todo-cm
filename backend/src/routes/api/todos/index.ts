import express from 'express';
import { createTodo } from '../../../controllers/todoController';
import { verifyMiddleware } from '../../../controllers/applicationController';
const router = express.Router();

router.post('/', verifyMiddleware, createTodo);

module.exports = router;
