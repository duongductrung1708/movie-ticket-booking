const Room = require('../models/Room');
const Theater = require('../models/Theater');
const TheaterService = require('../services/theaterService');
const path = require('path')
const fs = require('fs');
const { default: mongoose } = require('mongoose');

const TheaterController = {
  create: async (req, res) => {
    try {
      const theater = await TheaterService.create(req.body);
      res.status(201).json(theater);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      console.log(req.params);
      
      const theaters = await TheaterService.getAll();
      res.status(200).json(theaters);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const theater = await TheaterService.getById(req.params.id);
      if (theater) {
        res.status(200).json(theater);
      } else {
        res.status(404).json({ message: 'Theater not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message, message: 'Theater not found' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, address, city, rooms, removedRooms } = req.body; // `removedRooms` for rooms to be deleted
  
      // Find the theater by ID
      const theater = await Theater.findById(id).populate('rooms');
      if (!theater) {
        return res.status(404).json({ message: 'Theater not found' });
      }
  
      // Update theater fields if they are provided
      theater.name = name || theater.name;
      theater.address = address || theater.address;
      theater.city = city || theater.city;
  
      // Handle the theater image if it is uploaded
      const theaterImageFile = req.files.find((file) => file.fieldname === 'theaterImage');
      if (theaterImageFile) {
        // Delete the old theater image if it exists
        if (theater.image) {
          const oldImagePath = path.join(__dirname, '..', 'assets', theater.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
  
        // Set the new image filename
        theater.image = theaterImageFile.filename;
      }
  
      // If rooms are provided, update or create them
      const roomIds = []; // To hold the ObjectId references for the theater
      if (rooms) {
        const parsedRooms = JSON.parse(rooms);
  
        for (const roomData of parsedRooms) {
          let room;
  
          // Check if the roomData contains a valid ObjectId and find the existing room
          if (roomData.id && mongoose.Types.ObjectId.isValid(roomData.id)) {
            room = await Room.findById(roomData.id);
          }
  
          // If the room doesn't exist or the ID is not valid, create a new room
          if (!room) {
            room = new Room({
              name: roomData.name,
              type: roomData.roomType,
              seatLayout: roomData.seatLayout,
            });
          } else {
            // Update room details if the room already exists
            room.name = roomData.name || room.name;
            room.type = roomData.roomType || room.type;
            room.seatLayout = roomData.seatLayout || room.seatLayout;
          }
  
          // Find if an image was uploaded for this specific room based on its ID
          const roomImageFile = req.files.find((file) => file.fieldname === `roomImage_${roomData.id}`);
          if (roomImageFile) {
            // Delete the old room image if it's different from the new one
            if (room.image && room.image !== roomImageFile.filename) {
              const oldRoomImagePath = path.join(__dirname, '..', 'assets', room.image);
              if (fs.existsSync(oldRoomImagePath)) {
                fs.unlinkSync(oldRoomImagePath);
              }
            }
  
            // Set the new image filename
            room.image = roomImageFile.filename;
          }
  
          // Save the room and collect its ID
          await room.save();
          roomIds.push(room._id);
        }
  
        // Update the theater's rooms with the new or updated room IDs
        theater.rooms = roomIds;
      }
  
      // Handle removed rooms
      if (removedRooms) {
        const parsedRemovedRooms = JSON.parse(removedRooms);
  
        for (const removedRoomId of parsedRemovedRooms) {
          if (mongoose.Types.ObjectId.isValid(removedRoomId)) {
            const roomToRemove = await Room.findById(removedRoomId);
            if (roomToRemove) {
              // Delete room image from filesystem
              if (roomToRemove.image) {
                const roomImagePath = path.join(__dirname, '..', 'assets', roomToRemove.image);
                if (fs.existsSync(roomImagePath)) {
                  fs.unlinkSync(roomImagePath);
                }
              }
  
              // Remove the room from the database
              await Room.findOneAndDelete(removedRoomId);
            }
          }
        }
      }
  
      // Save the updated theater
      await theater.save();
      await theater.populate('rooms');
      res.status(200).json(theater);
    } catch (error) {
      console.error("Error updating theater:", error);
      res.status(500).json({ message: 'Error updating theater', error });
    }
  },

  delete: async (req, res) => {
    try {
      await TheaterService.delete(req.params.id);
      res.status(204).json({ message: "delete theater success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getShowtimesByTheater: async (req, res) => {
    try {
      const showtimes = await TheaterService.getShowtimesByTheater(req.params.id);
      if (showtimes.length > 0) {
        res.status(200).json(showtimes);
      } else {
        res.status(404).json({ message: 'No showtimes found for this theater' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createTheater: async (req, res) => {
    try {
      // Ensure that the theater image file is present before proceeding
      if (!req.files || !req.files.theaterImage) {
        return res.status(400).json({ success: false, message: "Theater image file is required" });
      }

      // Extract the theater image filename
      let theaterImageFilename = req.files.theaterImage[0].filename;

      // Parse rooms data if it's present
      let roomsData = [];
      if (req.body.rooms) {
        try {
          roomsData = JSON.parse(req.body.rooms);
        } catch (parseError) {
          return res.status(400).json({ success: false, message: "Invalid rooms data format" });
        }
      }

      // Create Room documents for each room in roomsData
      const roomPromises = roomsData.map(async (room, index) => {
        // Extract the room image if available
        const roomImageFilename = req.files.roomImages && req.files.roomImages[index]
          ? req.files.roomImages[index].filename
          : null;

        // Create a new Room instance
        const newRoom = new Room({
          name: room.name,
          image: roomImageFilename, // Assign room image if available
          type: room.roomType,
          seatLayout: room.seatLayout,
        });

        return await newRoom.save();
      });

      // Wait for all room creation promises to resolve
      const savedRooms = await Promise.all(roomPromises);

      // Collect the ObjectIds of the created rooms
      const roomIds = savedRooms.map((room) => room._id);

      // Create a new theater instance with the provided details and room references
      const theater = new Theater({
        name: req.body.name,
        address: req.body.address,
        image: theaterImageFilename,
        city: req.body.city,
        rooms: roomIds, // Referencing the created Room documents
      });

      // Save the theater to the database
      await theater.save();
      //populate room
      await theater.populate('rooms');
      res.status(201).json(theater );
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
  },

  getTheater: async (req, res) => {
    try {
      // Find the theater by ID and populate the 'rooms' field with the room documents
      const theater = await Theater.find().populate('rooms');

      // If the theater is not found, return a 404 response
      if (!theater) {
        return res.status(404).json({ success: false, message: 'Theater not found' });
      }

      // Return the theater data, including the populated rooms
      res.status(200).json(theater);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
  }
};

module.exports = TheaterController;
