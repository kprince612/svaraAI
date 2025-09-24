const taskService = require('../services/taskService');
const { validationResult } = require('express-validator');

const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const payload = { ...req.body, createdBy: req.user.sub };
    const task = await taskService.createTask(payload);
    res.status(201).json(task);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user.sub, req.body);
    if (!task) return res.status(404).json({ message: 'Not found or forbidden' });
    res.json(task);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const task = await taskService.deleteTask(req.params.id, req.user.sub);
    if (!task) return res.status(404).json({ message: 'Not found or forbidden' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

const fetchByProject = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority, deadlineFrom, deadlineTo } = req.query;
    const filters = { status, priority, deadlineFrom, deadlineTo };
    const result = await taskService.getTasksByProject({ projectId: req.params.projectId, ownerId: req.user.sub, filters, page: Number(page), limit: Number(limit) });
    res.json({ items: result.items, total: result.total, page: Number(page), limit: Number(limit) });
  } catch (err) { next(err); }
};

module.exports = { create, update, remove, fetchByProject };
