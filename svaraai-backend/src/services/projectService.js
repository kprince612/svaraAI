const projectRepo = require('../repositories/projectRepository');

const createProject = async ({ name, description, owner }) => {
  return projectRepo.createProject({ name, description, owner });
};

const listProjects = async (ownerId) => projectRepo.listProjectsByOwner(ownerId);

const deleteProject = async (projectId, ownerId) => projectRepo.deleteProject(projectId, ownerId);

module.exports = { createProject, listProjects, deleteProject };
