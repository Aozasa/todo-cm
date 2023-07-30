import express from 'express';
import { createTodo, listTodo, updateTodo } from '../../../controllers/todoController';
import { verifyMiddleware } from '../../../controllers/applicationController';
const router = express.Router();

router.post('/', verifyMiddleware, createTodo);
router.get('/', verifyMiddleware, listTodo);
router.patch('/:todoId', verifyMiddleware, updateTodo);

module.exports = router;
