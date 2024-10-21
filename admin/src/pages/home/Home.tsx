import { useEffect, useState } from "react";
import BigChartBox from "../../components/bigChartBox/BigChartBox";
import ChartBox from "../../components/chartBox/ChartBox";
import TopBox from "../../components/topBox/TopBox";
import constants from "../../constants/constants";
import "./home.scss";
import { TopMovie } from "../../models/TopMovie";
import {
  getListTopMovies,
  getListTopValues,
  getLListRevenues,
} from "../../services/dashboardService.ts";

const Home = () => {
  const [listTopMovies, setListTopMovies] = useState<TopMovie[]>([]);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const [customer, setCustomer] = useState(0);
  const [bookings, setBookings] = useState(0);
  const [movies, setMovies] = useState(0);
  const [revenue, setRevenue] = useState<RevenueModel[]>([]);

  useEffect(() => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    setCurrentYear(year);
    const fetchTopMovies = async () => {
      try {
        setCurrentMonth(month);
        const response = await getListTopMovies({
          month: month,
        });
        setListTopMovies(response.data.topMovies);
      } catch (error) {
        console.error("Failed to fetch top movies:", error);
      }
    };
    const fetchTopValues = async () => {
      try {
        const response = await getListTopValues({
          month: month,
        });
        setCustomer(response.data.customers);
        setBookings(response.data.bookings);
        setMovies(response.data.movies);
      } catch (error) {
        console.error("Failed to fetch top values:", error);
      }
    };
    const fetchRevenue = async () => {
      try {
        const response = await getLListRevenues({
          year: year,
        });
        setRevenue(response.data.revenueByMonth);
      } catch (error) {
        console.error("Failed to fetch top values:", error);
      }
    };

    fetchRevenue();
    fetchTopMovies();
    fetchTopValues();
  }, []);

  return (
    <div className="home">
      <div className="box box1">
        <TopBox month={currentMonth} movies={listTopMovies} />
      </div>
      <div className="box box2">
        <ChartBox title={"Customers"} number={customer} />
      </div>
      <div className="box box3">
        <ChartBox title={"Success bookings in " + constants.MONTHS[currentMonth - 1]} number={bookings} />
      </div>
      <div className="box box5">
        <ChartBox title={"Movies"} number={movies} />
      </div>
      <div className="box box7">
        <BigChartBox year={currentYear} props={revenue}/>
      </div>
    </div>
  );
};

export default Home;
