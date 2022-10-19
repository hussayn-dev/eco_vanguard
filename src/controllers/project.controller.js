const Project = require("../models/projectModel");
const error = require("../errors/error-handler");
const { StatusCodes } = require("http-status-codes");
const { validate, projectSchema } = require("../utilities/joi");
const cloudinary = require("../config/cloudinary");

class ProjectController {
  async createProject(req, res, next) {
    let { name, beneficiary, type, about } = req.body;
    if (!name || !beneficiary || !type || !about)
      throw new error.BadRequestError("Input fields correctly");

    //validation
    const validateInput = validate(projectSchema, req.body);
    if (validateInput) throw new error.BadRequestError(validateInput);

    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(imageFile.path, {
        folder: "projects",
      });
      project.imagePublicId = uploadResponse.public_id;
      project.imageSecureUrl = uploadResponse.secure_url;
    }

    const project = new Project({
      name,
      beneficiary,
      type,
      about,
      imagePublicId,
      imageSecureUrlx,
    });
    await project.save();
    res
      .status(StatusCodes.CREATED)
      .json({
        data: project,
        status: true,
        message: "Project created successfully",
      });
  }

  async getAll(req, res, next) {
    let queryObject = {};
    if (req.query.type) queryObject.type = req.query.type;
    let projects = await Project.find(queryObject);
    res
      .status(StatusCodes.CREATED)
      .json({
        data: projects,
        length: projects.length,
        status: true,
        message: "successfull",
      });
  }
  async getOne(req, res, next) {
    const project = await Project.findById(req.params.id);
    if (!project) throw new error.BadRequestError("project not found");
    res
      .status(StatusCodes.OK)
      .json({ data: project, status: true, message: "Successful" });
  }
  async editOne(req, res, next) {
    const project = await Project.findById(req.params.id);
    if (!project) throw new error.BadRequestError("project not found");

    //validation
    const validateInput = validate(projectSchema, req.body);
    if (validateInput) throw new error.BadRequestError(validateInput);

    const updates = Object.keys(req.body);
    const allowedProjectsUpdates = ["name", "beneficiary", "about", "type"];
    const isValidOperation = updates.every((update) => {
      return allowedProjectsUpdates.includes(update);
    });

    if (!isValidOperation) throw new error.NotFoundError("Property not found");
    updates.forEach(async (update) => {
      project[update] = req.body[update];
    });

    await project.save();
    res
      .status(StatusCodes.OK)
      .json({
        data: project,
        status: true,
        message: "Project updated successfully ",
      });
  }
  async deleteOne(req, res, next) {
    const project = await Project.findById(req.params.id);
    if (!project) throw new error.BadRequestError("project not found");

    await cloudinary.uploader.destroy(project.imagePublicId);
    await project.remove();

    const data = {
      status: true,
      message: "project successfully deleted",
      project,
    };
    res.status(StatusCodes.OK).json({ data });
  }

  async editImage(req, res, next) {
    const { id: proId } = req.params;

    let message = "";
    let project = await Project.findById(proId);
    if (!project) throw new error.NotFoundError("Project not found");

    if (req.file) {
      await cloudinary.uploader.destroy(project.imagePublicId);
      const uploadResponse = await cloudinary.uploader.upload(imageFile.path, {
        folder: "projects",
      });
      project.imagePublicId = uploadResponse.public_id;
      projectimageSecureUrl = uploadResponse.secure_url;
      message = "Updates made successfully";
    } else {
      message = "No updates made";
    }

    await project.save();
    const data = {
      project,
      message,
      status: true,
    };
    res.status(StatusCodes.OK).json({ data });
  }
  async deleteImage(req, res, next) {
    const { id: eventId } = req.params;

    let project = await Event.findById(eventId);
    if (!project) throw new error.NotFoundError("Project not found");
    await cloudinary.uploader.destroy(project.imagePublicId);
    project.imagePublicId = "";
    project.imageSecureUrl = "";
    await project.save();
    const data = {
      project,
      message: "Image deleted successfully",
      status: true,
    };
    res.status(StatusCodes.OK).json({ data });
  }
}

const project = new ProjectController();
module.exports = project;
