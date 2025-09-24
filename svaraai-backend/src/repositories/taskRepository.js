const Task = require('../models/Task');

const createTask = (payload) => new Task(payload).save();
const updateTask = (id, ownerId, updates) => Task.findOneAndUpdate({ _id: id, createdBy: ownerId }, updates, { new: true });
const deleteTask = (id, ownerId) => Task.findOneAndDelete({ _id: id, createdBy: ownerId });
const findById = (id) => Task.findById(id);

const findByProject = async ({ projectId, ownerId, filters = {}, page = 1, limit = 10 }) => {
  const query = { projectId };
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.deadlineFrom || filters.deadlineTo) query.deadline = {};
  if (filters.deadlineFrom) query.deadline.$gte = new Date(filters.deadlineFrom);
  if (filters.deadlineTo) query.deadline.$lte = new Date(filters.deadlineTo);

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Task.find(query).sort('-createdAt').skip(skip).limit(limit),
    Task.countDocuments(query)
  ]);
  return { items, total };
};

module.exports = { createTask, updateTask, deleteTask, findById, findByProject };
