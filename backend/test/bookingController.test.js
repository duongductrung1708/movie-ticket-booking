const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { setBookingTimeout } = require("../services/timeoutManager");
const {
  getShowtimeById,
  updateSeatLayoutShowtime,
  convertSeatFormat,
} = require("../services/showtimeService");
const {
  createBooking,
  createBookingDetails,
} = require("../services/bookingService");

// Mock external functions from the services
jest.mock("../services/timeoutManager", () => ({
  setBookingTimeout: jest.fn(),
}));

jest.mock("../services/showtimeService", () => ({
  getShowtimeById: jest.fn(),
  updateSeatLayoutShowtime: jest.fn(),
  convertSeatFormat: jest.fn(),
}));

jest.mock("../services/bookingService", () => ({
  createBooking: jest.fn(),
  createBookingDetails: jest.fn(),
  deleteBooking: jest.fn(),
  deleteBookingDetails: jest.fn(),
}));

describe("createBookingData controller", () => {
  const mockReqBody = {
    userId: "user123",
    showtimeId: "showtime123",
    seatIds: ["seat1", "seat2"],
    serviceIds: ["service1*2", "service2*3"],
    status: "processing",
  };

  const mockShowtimeData = {
    _id: "showtime123",
    seatLayout: [
      [
        { _id: "seat1", status: "available" },
        { _id: "seat2", status: "available" },
      ],
      [
        { _id: "seat3", status: "available" },
        { _id: "seat4", status: "available" },
      ],
    ],
    room_id: "room123",
  };
  it("should create a booking successfully", async () => {
    const bookingId = new mongoose.Types.ObjectId();
    const bookingDetailsId = new mongoose.Types.ObjectId();
    // Arrange
    getShowtimeById.mockResolvedValue(mockShowtimeData);
    updateSeatLayoutShowtime.mockResolvedValue();
    createBooking.mockResolvedValue({
      _id: bookingId,
      status: "processing",
    });
    convertSeatFormat.mockResolvedValue(["A1", "A2"]);
    setBookingTimeout.mockImplementation((_, callback, __) => callback());
    createBookingDetails.mockResolvedValue({ _id: bookingDetailsId });

    // Act
    const response = await request(app)
      .post("/api/bookings/create")
      .send(mockReqBody);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body.booking._id).toBe(bookingId.toString());
    expect(response.body.bookingDetails._id).toBe(bookingDetailsId.toString());

    // Verify that mocks were called with expected values
    expect(getShowtimeById).toHaveBeenCalledWith("showtime123");
    expect(updateSeatLayoutShowtime).toHaveBeenCalledWith(
      "showtime123",
      mockReqBody.seatIds,
      "reserved"
    );
    expect(createBooking).toHaveBeenCalledWith(
      mockReqBody.userId,
      mockReqBody.showtimeId,
      "room123",
      expect.any(String), // String for seat layout
      mockReqBody.status
    );
  });

  it("should handle errors and revert seat status", async () => {
    const bookingId = new mongoose.Types.ObjectId();
    // Arrange
    getShowtimeById.mockResolvedValue(mockShowtimeData);
    updateSeatLayoutShowtime.mockResolvedValue();
    createBooking.mockResolvedValue({
      _id: bookingId,
      status: "processing",
    });
    convertSeatFormat.mockResolvedValue(['A6', 'A7', 'A8'])
    createBookingDetails.mockImplementation(() => {
      throw new Error("Service failure");
    });

    // Act
    const response = await request(app)
      .post("/api/bookings/create") // Change to the actual endpoint route
      .send(mockReqBody);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe(
      "An error occurred, reverting seat status."
    );
  });
});
