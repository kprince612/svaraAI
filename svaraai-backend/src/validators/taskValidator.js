const { body } = require('express-validator');

const createTaskValidation = [
  body('title').isString().notEmpty().withMessage('title required'),
  body('priority').optional().isIn(['low','medium','high']),
  body('status').optional().isIn(['todo','in-progress','done']),
  body('deadline').optional().isISO8601().toDate(),
  body('projectId').isMongoId().withMessage('projectId is required')
];

module.exports = { createTaskValidation };
