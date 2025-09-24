const taskRepo = require('../repositories/taskRepository');
const projectRepo = require('../repositories/projectRepository');

const createTask = async ({ title, description, status, priority, deadline, projectId, createdBy }) => {
  const project = await projectRepo.findById(projectId);
  if (!project) throw Object.assign(new Error('Project not found'), { status: 404 });
  if (project.owner.toString() !== createdBy.toString()) throw Object.assign(new Error('Forbidden'), { status: 403 });
  return taskRepo.createTask({ title, description, status, priority, deadline, projectId, createdBy });
};

const updateTask = async (id, ownerId, updates) => taskRepo.updateTask(id, ownerId, updates);
const deleteTask = async (id, ownerId) => taskRepo.deleteTask(id, ownerId);
const getTasksByProject = async ({ projectId, ownerId, filters, page, limit }) => {
  const project = await projectRepo.findById(projectId);
  if (!project) throw Object.assign(new Error('Project not found'), { status: 404 });
  if (project.owner.toString() !== ownerId.toString()) throw Object.assign(new Error('Forbidden'), { status: 403 });
  return taskRepo.findByProject({ projectId, ownerId, filters, page, limit });
};

module.exports = { createTask, updateTask, deleteTask, getTasksByProject };
