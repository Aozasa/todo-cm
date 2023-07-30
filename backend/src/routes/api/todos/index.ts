import express from 'express';
import { createTodo, listTodo } from '../../../controllers/todoController';
import { verifyMiddleware } from '../../../controllers/applicationController';
const router = express.Router();

router.post('/', verifyMiddleware, createTodo);
router.get('/', verifyMiddleware, listTodo);

module.exports = router;
