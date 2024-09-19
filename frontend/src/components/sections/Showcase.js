import React, { useRef } from "react";
import styled, { keyframes } from "styled-components";
import ETH from "../../assets/icons8-ethereum-48.png";

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.text};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  & > *:first-child {
    animation-duration: 20s;

    @media (max-width: 30em) {
      animation-duration: 15s;
    }
  }
  & > *:last-child {
    animation-duration: 15s;

    @media (max-width: 30em) {
      animation-duration: 10s;
    }
  }
`;

const move = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const Row = styled.div`
  white-space: nowrap;
  box-sizing: content-box;
  margin: 2rem 0;
  display: flex;

  animation: ${move} linear infinite ${(props) => props.direction};
`;

const ImgContainer = styled.div`
  width: 15rem;
  margin: 0 1rem;
  background-color: ${(props) => props.theme.body};
  border-radius: 20px;
  cursor: pointer;

  @media (max-width: 48em) {
    width: 12rem;
  }

  @media (max-width: 30em) {
    width: 10rem;
  }

  img {
    width: 100%;
    height: auto;
  }
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  background-color: ${(props) => props.theme.text};
  border: 2px solid ${(props) => `rgba(${props.theme.bodyRgba}, 0.5)`};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  span {
    font-size: ${(props) => props.theme.fontsm};
    color: ${(props) => `rgba(${props.theme.bodyRgba},0.5)`};
    font-weight: 600;
    line-height: 1.5rem;
  }

  h1 {
    font-size: ${(props) => props.theme.fontmd};
    color: ${(props) => props.theme.body};
    font-weight: 600;

    @media (max-width: 38em) {
      font-size: ${(props) => props.theme.fontsm};
    }
  }
`;

const Price = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  img {
    width: 1rem;
    height: auto;
  }
`;

const NftItem = ({ img, number = 0, price = 0, description = "", passRef }) => {
  let play = (e) => {
    passRef.current.style.animationPlayState = "running";
  };
  let pause = (e) => {
    passRef.current.style.animationPlayState = "paused";
  };

  return (
    <ImgContainer onMouseOver={(e) => pause(e)} onMouseOut={(e) => play(e)}>
      <img src={img} alt="Combo" />
      <Details>
        <div>
          <span>{description}</span> <br />
          <h1>#{number}</h1>
        </div>
        <div>
          <span></span> <br />
          <Price>
            <img src={ETH} alt="ETH" />
            <h1>{Number(price).toFixed(1)} đ</h1>
          </Price>
        </div>
      </Details>
    </ImgContainer>
  );
};

const Showcase = () => {
  const Row1Ref = useRef(null);
  const Row2Ref = useRef(null);

  const combos = [
    {
      img: "https://media.lottecinemavn.com/Media/WebAdmin/3853e60199f74b76b07a1f5bf76e59b0.png",
      number: 852,
      price: 157.091,
      description: "Crunchy Couple Combo",
    },
    {
      img: "https://media.lottecinemavn.com/Media/WebAdmin/35e46d352dfd44ba87393319ed00822d.png",
      number: 123,
      price: 128.618,
      description: "Crunchy Combo",
    },
    {
      img: "https://media.lottecinemavn.com/Media/WebAdmin/1c9177408e474385994e97e6c241d61c.png",
      number: 456,
      price: 132.545,
      description: "Harmony Plus",
    },
    {
      img: "https://media.lottecinemavn.com/Media/WebAdmin/f28cf0aa274447a3aa5919e9c1de7d31.png",
      number: 666,
      price: 134.509,
      description: "Harmony Couple",
    },
    {
      img: "https://media.lottecinemavn.com/Media/WebAdmin/1dfcae887e8240abad2d8e5bb6ba72ea.png",
      number: 452,
      price: 240.545,
      description: "Party Combo",
    },
    {
      img: "https://media.lottecinemavn.com/Media/WebAdmin/9bb2eb2ef5944a2fb3825cc17ee915ce.png",
      number: 888,
      price: 199.0,
      description: "Ly Mega Minion Gus",
    },
    {
      img: "https://media.lottecinemavn.com/Media/WebAdmin/efcf1640aea845f9ba6851a3041e5624.png",
      number: 211,
      price: 224.0,
      description: "Mega Minion Gus",
    },
    {
      img: "https://media.lottecinemavn.com/Media/WebAdmin/3853e60199f74b76b07a1f5bf76e59b0.png",
      number: 852,
      price: 157.091,
      description: "Crunchy Couple Combo",
    },
    {
      img: "https://media.lottecinemavn.com/Media/WebAdmin/35e46d352dfd44ba87393319ed00822d.png",
      number: 123,
      price: 128.618,
      description: "Crunchy Combo",
    },
    {
      img: "https://media.lottecinemavn.com/Media/WebAdmin/1c9177408e474385994e97e6c241d61c.png",
      number: 456,
      price: 132.545,
      description: "Harmony Plus",
    },
  ];

  return (
    <Section id="showcase">
      <Row direction="none" ref={Row1Ref}>
        {combos.slice(0, 5).map((combo, index) => (
          <NftItem
            key={index}
            img={combo.img}
            number={combo.number}
            price={combo.price}
            description={combo.description}
            passRef={Row1Ref}
          />
        ))}
      </Row>
      <Row direction="reverse" ref={Row2Ref}>
        {combos.slice(5).map((combo, index) => (
          <NftItem
            key={index}
            img={combo.img}
            number={combo.number}
            price={combo.price}
            description={combo.description}
            passRef={Row2Ref}
          />
        ))}
      </Row>
    </Section>
  );
};

export default Showcase;
