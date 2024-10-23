import { useParams } from "react-router-dom";
import '../styles/bookingDetails.css'; // Assuming you have a CSS file for styling
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getBookingById } from "../services/bookingService";

export default function BookingDetails() {
    const id = useParams().id;

    const [bookingData, setBookingData] = useState(null)
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const booking = await getBookingById(id)
                console.log(booking);
                setBookingData(booking[0])
            } catch (error) {
                console.error(error);
                toast.error("Error")
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
                    <img className="event-logo" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9d4a564f-746a-4c09-80f9-fac15b21c406/dfy91yt-976c34d9-98d7-4db0-beda-6d1de266b586.jpg/v1/fill/w_1920,h_1097,q_75,strp/batman_wallpaper_by_imagineaiart99_dfy91yt-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzlkNGE1NjRmLTc0NmEtNGMwOS04MGY5LWZhYzE1YjIxYzQwNlwvZGZ5OTF5dC05NzZjMzRkOS05OGQ3LTRkYjAtYmVkYS02ZDFkZTI2NmI1ODYuanBnIiwiaGVpZ2h0IjoiPD0xMDk3Iiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uud2F0ZXJtYXJrIl0sIndtayI6eyJwYXRoIjoiXC93bVwvOWQ0YTU2NGYtNzQ2YS00YzA5LTgwZjktZmFjMTViMjFjNDA2XC9pbWFnaW5lYWlhcnQ5OS00LnBuZyIsIm9wYWNpdHkiOjk1LCJwcm9wb3J0aW9ucyI6MC40NSwiZ3Jhdml0eSI6ImNlbnRlciJ9fQ.ooWxbsNn7qj6IMng3QXmi__8TECqYg-Qf2U0RePZtD8" alt="Movie Poster" />
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
