import "./topBox.scss"
import { TopMovie } from "../../models/TopMovie.ts"
import constants from "../../constants/constants";

interface TopBoxProps {
  movies: TopMovie[];
  month: number
}

const TopBox = ({ movies, month }: TopBoxProps) => {
  return (
    <div className="topBox">
      <div>
        <h1>Top Films In {constants.MONTHS[month-1]}</h1>
      </div>
      <div className="list">
        {Array.isArray(movies) && movies.length > 0 ? (
          movies.map((data, index) => (
            <div className="listItem" key={index}>
              <div className="user">
                <img src={data.movie.image} />
                <div className="userTexts">
                  <h5 className="username">{data.movie.title}</h5>
                </div>
              </div>
              <span className="amount">{data.totalBookings} booking</span>
            </div>
          ))
        ) : (
          <p>No movies available</p>
        )}
      </div>
    </div>
  );
};

export default TopBox;
