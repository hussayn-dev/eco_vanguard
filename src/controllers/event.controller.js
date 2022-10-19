const Event = require("../models/eventModel");
const error = require("../errors/error-handler");
const { StatusCodes } = require("http-status-codes");
const { validate, eventSchema } = require("../utilities/joi");
const cloudinary = require("../config/cloudinary");

class EventController {
  async createEvent(req, res, next) {
    let { name, date, about } = req.body;
    if (!name || !date || !about)
      throw new error.BadRequestError("Input fields correctly");

    //validation
    const validateInput = validate(eventSchema, req.body);
    if (validateInput) throw new error.BadRequestError(validateInput);

    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(imageFile.path, {
        folder: "events",
      });
      event.imagePublicId = uploadResponse.public_id;
      event.imageSecureUrl = uploadResponse.secure_url;
    }

    const event = new Event({
      name,
      date,
      about,
      imagePublicId,
      imageSecureUrl,
    });
    await event.save();
    res
      .status(StatusCodes.CREATED)
      .json({
        data: event,
        status: true,
        message: "Event created successfully",
      });
  }
  async getAll(req, res, next) {
    let events = await Event.find({}).sort("-createdAt");
    res
      .status(StatusCodes.CREATED)
      .json({
        data: events,
        length: events.length,
        status: true,
        message: "successfull",
      });
  }
  async getOne(req, res, next) {
    const event = await Event.findById(req.params.id);
    if (!event) throw new error.BadRequestError("event not found");
    res
      .status(StatusCodes.OK)
      .json({ data: event, status: true, message: "Successful" });
  }
  async editOne(req, res, next) {
    const event = await Event.findById(req.params.id);
    if (!event) throw new error.BadRequestError("event not found");

    //validation
    const validateInput = validate(eventSchema, req.body);
    if (validateInput) throw new error.BadRequestError(validateInput);

    const updates = Object.keys(req.body);
    const allowedTasksUpdates = ["name", "date", "about"];
    const isValidOperation = updates.every((update) => {
      return allowedTasksUpdates.includes(update);
    });

    if (!isValidOperation) throw new error.NotFoundError("Property not found");
    updates.forEach(async (update) => {
      event[update] = req.body[update];
    });

    await event.save();
    res
      .status(StatusCodes.OK)
      .json({
        data: event,
        status: true,
        message: "Event updated successfully ",
      });
  }
  async deleteOne(req, res, next) {
    const event = await Event.findById(req.params.id);
    if (!event) throw new error.BadRequestError("event not found");

    await cloudinary.uploader.destroy(event.imagePublicId);

    await event.remove();

    const data = {
      status: true,
      message: "event successfully deleted",
      event,
    };
    res.status(StatusCodes.OK).json({ data });
  }

  async editImage(req, res, next) {
    const { id: eventId } = req.params;

    let message = "";
    let event = await Event.findById(eventId);
    if (!event) throw new error.NotFoundError("Event not found");

    if (req.file) {
      await cloudinary.uploader.destroy(event.imagePublicId);
      const uploadResponse = await cloudinary.uploader.upload(imageFile.path, {
        folder: "events",
      });
      event.imagePublicId = uploadResponse.public_id;
      event.imageSecureUrl = uploadResponse.secure_url;
      message = "Updates made successfully";
    } else {
      message = "No updates made";
    }

    await event.save();
    const data = {
      event,
      message,
      status: true,
    };
    res.status(StatusCodes.OK).json({ data });
  }
  async deleteImage(req, res, next) {
    const { id: eventId } = req.params;

    let event = await Event.findById(eventId);
    if (!event) throw new error.NotFoundError("Event not found");
    await cloudinary.uploader.destroy(event.imagePublicId);
    event.imagePublicId = "";
    event.imageSecureUrl = "";
    await event.save();
    const data = {
      event,
      message: "Image deleted successfully",
      status: true,
    };
    res.status(StatusCodes.OK).json({ data });
  }
}

const event = new EventController();
module.exports = event;
