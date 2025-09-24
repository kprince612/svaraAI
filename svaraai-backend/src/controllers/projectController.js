const projectService = require('../services/projectService');

const create = async (req, res, next) => {
  try {
    const project = await projectService.createProject({ ...req.body, owner: req.user.sub });
    res.status(201).json(project);
  } catch (err) { next(err); }
};

const list = async (req, res, next) => {
  try {
    const projects = await projectService.listProjects(req.user.sub);
    res.json(projects);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await projectService.deleteProject(req.params.id, req.user.sub);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

module.exports = { create, list, remove };
