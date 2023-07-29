import express from 'express';
const router = express.Router();

router.use('/users', require('./users'));
router.use('/sessions', require('./sessions'));

module.exports = router;
