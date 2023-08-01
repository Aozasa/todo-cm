import express from 'express';
const router = express.Router();

router.use('/users', require('./users'));
router.use('/todos', require('./todos'));
router.use('/sessions', require('./sessions'));

module.exports = router;
