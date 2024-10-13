const Service = require("../models/Service");
const mongoose = require("mongoose");

// Create a new service
exports.createService = async (req, res) => {
  try {
    const newService = new Service({
      ...req.body,
    });
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: "Error creating service", error });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services", error });
  }
};

// Update service by ID
exports.updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: "Error updating service", error });
  }
};

// Delete service by ID
exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service", error });
  }
};

exports.purchaseService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.quantity <= 0) {
      return res.status(400).json({ message: "Service out of stock" });
    }

    service.quantity -= 1;
    await service.save();

    res
      .status(200)
      .json({ message: "Service purchased successfully", service });
  } catch (error) {
    res.status(500).json({ message: "Error processing purchase", error });
  }
};
