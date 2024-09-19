import React, { useState } from "react";
import styled from "styled-components";
import Logo from "./Logo";
import Button from "./Button";

const Section = styled.section`
  width: 100vw;
  background-color: ${(props) => props.theme.body};
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 85%;
  height: ${(props) => props.theme.navHeight};
  margin: 0 auto;

  .mobile {
    display: none;
  }

  @media (max-width: 64em) {
    .desktop {
      display: none;
    }
    .mobile {
      display: inline-block;
    }
  }
`;

const MenuItem = styled.li`
  margin: 0 1rem;
  color: ${(props) => props.theme.text};
  cursor: pointer;

  &::after {
    content: "";
    display: block;
    width: 0%;
    height: 2px;
    background: ${(props) => props.theme.text};
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: 64em) {
    margin: 1rem 0;

    &::after {
      display: none;
    }
  }
`;

const Menu = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;

  @media (max-width: 64em) {
    position: fixed;
    top: ${(props) => props.theme.navHeight};
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
    z-index: 50;
    background-color: ${(props) => `rgba(${props.theme.bodyRgba}, 0.85)`};
    backdrop-filter: blur(2px);
    transform: ${(props) =>
      props.clicked ? "translateY(0)" : "translateY(1000%)"};
    transition: all 0.3s ease;
    flex-direction: column;
    justify-content: center;

    touch-action: none;
  }
`;

const HamburgerMenu = styled.span`
  width: ${(props) => (props.clicked ? "2rem" : "1.5rem")};
  height: 2px;
  background: ${(props) => props.theme.text};
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: ${(props) =>
    props.clicked
      ? "translateX(-50%) rotate(90deg)"
      : "translateX(-50%) rotate(0)"};
  display: none;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 64em) {
    display: flex;
  }

  &::after,
  &::before {
    content: "";
    width: ${(props) => (props.clicked ? "1rem" : "1.5rem")};
    height: 2px;
    right: ${(props) => (props.clicked ? "-2px" : "0")};
    background: ${(props) => props.theme.text};
    position: absolute;
    transition: all 0.3s ease;
  }

  &::after {
    top: ${(props) => (props.clicked ? "0.3rem" : "0.5rem")};
    transform: ${(props) => (props.clicked ? "rotate(-40deg)" : "rotate(0)")};
  }

  &::before {
    bottom: 0.5rem;
    transform: ${(props) => (props.clicked ? "rotate(40deg)" : "rotate(0)")};
  }
`;

const Navigation = () => {
  const [click, setClick] = useState(false);

  const scrollTo = (id) => {
    let element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      setClick(!click);
    }
  };

  return (
    <Section id="navigation">
      <NavBar>
        <Logo />
        <HamburgerMenu clicked={click} onClick={() => setClick(!click)}>
          &nbsp;
        </HamburgerMenu>
        <Menu clicked={click}>
          <MenuItem onClick={() => scrollTo("home")}>Home</MenuItem>
          <MenuItem onClick={() => scrollTo("about")}>Movies</MenuItem>
          <MenuItem onClick={() => scrollTo("movie-list")}>Now showing</MenuItem>
          <MenuItem onClick={() => scrollTo("showcase")}>Special offer</MenuItem>
          <MenuItem onClick={() => scrollTo("upcoming-movies")}>Upcoming</MenuItem>
          <MenuItem onClick={() => scrollTo("faq")}>Faq</MenuItem>
          <MenuItem>
            <div className="mobile">
              <Button text="My Account" link="https://google.com" />
            </div>
          </MenuItem>
        </Menu>
        <div className="desktop">
          <Button text="My Account" link="https://google.com" />
        </div>
      </NavBar>
    </Section>
  );
};

export default Navigation;
