import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ConfettiComponent from "../Confetti";
import Modal from "react-modal";
import YouTube from "react-youtube";
import { getUpcomingMovies } from "../../services/api";

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.body};
  position: relative;
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontxx1};
  text-transform: capitalize;
  color: ${(props) => props.theme.text};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
  border-bottom: 2px solid ${(props) => props.theme.text};
  width: fit-content;

  @media (max-width: 64em) {
    font-size: ${(props) => props.theme.fontx1};
  }
`;

const SearchBar = styled.input`
  width: 30%;
  padding: 0.5rem;
  margin: 1rem auto;
  border: 2px solid ${(props) => props.theme.text};
  border-radius: 10px;
  text-align: center;
  font-size: ${(props) => props.theme.fontmd};
  display: block;

  @media (max-width: 48em) {
    width: 50%;
  }

  @media (max-width: 30em) {
    width: 60%;
  }
`;

const Container = styled.div`
  width: 75%;
  margin: 2rem auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem;

  @media (max-width: 64em) {
    width: 80%;
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 48em) {
    width: 90%;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 30em) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  color: ${(props) => props.theme.body};
  position: relative;
  backdrop-filter: blur(4px);
  border: 2px solid ${(props) => props.theme.text};
  border-radius: 20px;
  overflow: hidden;
  text-align: center;
  height: 100%;

  @media (max-width: 30em) {
    width: 70vw;
  }
`;

const MovieImage = styled.img`
  width: 100%;
  max-width: 150px;
  height: auto;
  border-radius: 15px;
  margin-bottom: 1rem;
`;

const Name = styled.h2`
  font-size: ${(props) => props.theme.fontmd};
  text-transform: uppercase;
  color: ${(props) => props.theme.text};
  margin-top: 1rem;
  min-height: 3rem;
`;

const ReleaseDate = styled.h3`
  font-size: ${(props) => props.theme.fontmd};
  color: ${(props) => `rgba(${props.theme.textRgba}, 0.9)`};
  font-weight: 400;
  margin-bottom: 1rem;
  min-height: 2rem;
`;

const Button = styled.button`
  display: block;
  margin-top: auto;
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.text};
  color: ${(props) => props.theme.body};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: gray;
  }

  @media (max-width: 1024px) {
    font-size: 1rem;
    padding: 0.7rem 1.2rem;
    margin: 0.5rem 1rem 1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0.8rem 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    margin: 0.5rem 1rem 1rem;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 2rem;
`;

const ShowMoreButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: ${(props) => props.theme.fontmd};
`;

const ModalContent = styled.div`
  position: relative;
  padding: 20px;
  border-radius: 10px;
  max-width: 650px !important;
  max-heigh: 650px !important;
  margin: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -20px;
  right: -7px;
  background: none;
  border: none;
  font-size: ${(props) => props.theme.fontx1};
  cursor: pointer;
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 100%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
`;

const StyledYouTube = styled(YouTube)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const extractYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const Movie = ({ img, name = "", releaseDate = "", trailerUrl = "" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const videoId = extractYouTubeVideoId(trailerUrl);

  const opts = {
    height: "490",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <>
      <Item>
        <MovieImage src={img} alt={name} />
        <Name>{name}</Name>
        <ReleaseDate>{releaseDate}</ReleaseDate>
        <Button onClick={openModal}>Watch Trailer</Button>
      </Item>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Watch Trailer"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          content: {
            maxWidth: "650px",
            maxHeight: "650px",
            margin: "auto",
            borderRadius: "10px",
          },
        }}
      >
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <VideoWrapper>
            {videoId ? (
              <StyledYouTube videoId={videoId} opts={opts} />
            ) : (
              <p>Trailer not available</p>
            )}
          </VideoWrapper>
        </ModalContent>
      </Modal>
    </>
  );
};

const UpcomingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [visibleMovies, setVisibleMovies] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getUpcomingMovies();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMovies = () => {
    if (visibleMovies < filteredMovies.length) {
      setVisibleMovies((prevValue) => prevValue + 5);
    } else {
      setVisibleMovies(5);
    }
  };

  return (
    <Section id="upcoming-movies">
      <ConfettiComponent />
      <Title>Upcoming Movies</Title>
      <SearchBar
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Container>
        {filteredMovies.slice(0, visibleMovies).map((movie, index) => (
          <Movie
            key={index}
            img={movie.poster_image}
            name={movie.title}
            releaseDate={movie.release_date}
            trailerUrl={movie.trailer_url}
          />
        ))}
      </Container>
      <ButtonWrapper>
        <ShowMoreButton onClick={toggleMovies}>
          {visibleMovies < filteredMovies.length
            ? "Show More →"
            : "Show Less ←"}
        </ShowMoreButton>
      </ButtonWrapper>
    </Section>
  );
};

export default UpcomingMovies;
