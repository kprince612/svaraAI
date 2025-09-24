const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');
const { body } = require('express-validator');

router.use(auth);

router.post('/', [
  body('title').isString().notEmpty().withMessage('title required'),
  body('priority').optional().isIn(['low','medium','high']),
  body('status').optional().isIn(['todo','in-progress','done']),
  body('deadline').optional().isISO8601().toDate(),
  body('projectId').isMongoId().withMessage('projectId is required')
], taskController.create);

router.put('/:id', taskController.update);
router.delete('/:id', taskController.remove);

// fetch tasks by project (project owner only)
router.get('/project/:projectId', taskController.fetchByProject);

module.exports = router;
