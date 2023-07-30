import express from 'express';
import { createTodo, deleteTodo, listTodo, updateTodo } from '../../../controllers/todoController';
import { verifyMiddleware } from '../../../controllers/applicationController';
const router = express.Router();

router.post('/', verifyMiddleware, createTodo);
router.get('/', verifyMiddleware, listTodo);
router.patch('/:todoId', verifyMiddleware, updateTodo);
router.delete('/:todoId', verifyMiddleware, deleteTodo);

module.exports = router;
