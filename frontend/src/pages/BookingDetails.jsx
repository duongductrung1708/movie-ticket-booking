import { useNavigate, useParams } from "react-router-dom";
import '../styles/bookingDetails.css'; // Assuming you have a CSS file for styling
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getBookingById } from "../services/bookingService";

export default function BookingDetails() {
    const id = useParams().id;
    const navigate = useNavigate()
    const [bookingData, setBookingData] = useState(null)
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const booking = await getBookingById(id)
                if (!booking || Object.keys(booking).length === 0) {
                    toast.error('Booking not found');
                    navigate("/404"); // Navigate to the Not Found page
                } else {
                    setBookingData(booking[0]);
                }
            } catch (error) {
                console.error(error);
                toast.error("Booking not found")
                navigate("/404")
            }
        }
        fetchBooking()
    }, [])

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="booking-details-container">
            <h1 className="booking-title">Booking Details</h1>

            <div className="ticket-info">
                <div className="ticket-header">
                    <img className="event-logo" src={`http://localhost:8080/api/images/${bookingData?.movie.image}`} alt="Movie Poster" />
                    <div className="event-details">
                        <h2 className="event-title">{bookingData?.movie.title}</h2>
                        <p>{bookingData?.theater} - {bookingData?.address}</p>
                        <p>Room: {bookingData?.room}</p>
                        <p>Seats: {bookingData?.seats}</p>
                    </div>
                </div>

                <div className="ticket-details">
                    <strong>Showtime</strong>
                    <p>Date: {formatDate(bookingData?.showtime.date)}</p>
                    <p>Time: {bookingData?.showtime.start_time} - {bookingData?.showtime.end_time}</p>
                </div>

                <div className="payment-info">
                    <strong>Payment Info</strong>
                    <p>Amount: {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(bookingData?.amount)}</p>
                    <p>Payment Method: {bookingData?.paymentMethod}</p>
                    <p>Status: {bookingData?.booking_status}</p>
                </div>

                <div className="services-info">
                    <strong>Services</strong>
                    {bookingData?.services.map((service) => (
                        <p key={service.service_id}>{service.name} (x{service.quantity}): {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(service.price * 1000)}</p>
                    ))}
                </div>
                <div className="terms">
                    <strong>Terms & Conditions</strong>
                    <ul>
                        <li>This ticket is valid for one person.</li>
                        <li>Non-refundable.</li>
                    </ul>
                </div>

                <div className="contact-info">
                    <p>If you have any questions, contact us at:</p>
                    <p>kcinemasupport@gmail.vn</p>
                    <p>1900.6408 (VI)</p>
                </div>
            </div>
        </div>
    );
}
