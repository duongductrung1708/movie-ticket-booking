const Contact = require("../models/Contact");
const Theater = require("../models/Theater");

// Create a new contact and filter theaters based on area
const createContact = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, service, area, theater, details } =
      req.body;

    const contact = new Contact({
      fullName,
      phoneNumber,
      email,
      service,
      area,
      details,
      theater,
    });

    await contact.save();

    res.status(201).json({ message: "Contact created successfully", contact });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating contact", error: error.message });
  }
};

// Get all contacts
const getAllContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const isPaginate = req.query.isPaginate === "true";

    let pipeline = [
      {
        $lookup: {
          from: "theaters",
          localField: "theater",
          foreignField: "_id",
          as: "theater",
        },
      },
      { $unwind: { path: "$theater", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          fullName: 1,
          phoneNumber: 1,
          email: 1,
          service: 1,
          area: 1,
          details: 1,
          timestamp: 1,
          theater: {
            name: 1,
          },
        },
      },
    ];

    const totalContacts = await Contact.aggregate([...pipeline, { $count: "total" }]);
    const total = totalContacts[0] ? totalContacts[0].total : 0;

    if (isPaginate) {
      pipeline.push({ $skip: skip }, { $limit: limit });
    }

    const contacts = await Contact.aggregate(pipeline);

    if (isPaginate) {
      res.status(200).json({
        total,
        contacts,
      });
    } else {
      res.status(200).json(contacts);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error: error.message });
  }
};

// Get a contact by ID
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).populate("theater");

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching contact", error: error.message });
  }
};

// Update a contact by ID
const updateContact = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, service, area, details } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { fullName, phoneNumber, email, service, area, details },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact updated successfully", contact });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating contact", error: error.message });
  }
};

// Delete a contact by ID
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting contact", error: error.message });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
