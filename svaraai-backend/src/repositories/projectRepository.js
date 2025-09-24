const Project = require('../models/Project');

const createProject = (payload) => new Project(payload).save();
const listProjectsByOwner = (ownerId) => Project.find({ owner: ownerId }).sort('-createdAt');
const deleteProject = (id, ownerId) => Project.findOneAndDelete({ _id: id, owner: ownerId });
const findById = (id) => Project.findById(id);

module.exports = { createProject, listProjectsByOwner, deleteProject, findById };
