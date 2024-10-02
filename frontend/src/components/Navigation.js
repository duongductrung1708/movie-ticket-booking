import React, { useState } from "react";
import "@fontsource/sora";
import styled from "styled-components";
import Logo from "./Logo";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import "../styles/navStyles.css";
import { useNavigate, useLocation } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import KeyIcon from "@mui/icons-material/Key";
import LogoutIcon from "@mui/icons-material/Logout";
import { logoutUser } from "../services/api";

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

const MenuItemStyled = styled.li`
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

const Item = styled.div`
  font-family: "Sora", sans-serif !important;
  margin-left: 0.5rem;
`;

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [click, setClick] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleAccountClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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

  const handleUserProfile = () => {
    navigate("/user-profile");
  };

  const handleBookingHistory = () => {
    navigate("/booking-history");
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Section id="navigation">
      <NavBar>
        <Logo />
        {location.pathname === "/home" && (
          <>
            <HamburgerMenu clicked={click} onClick={() => setClick(!click)}>
              &nbsp;
            </HamburgerMenu>
            <Menu clicked={click}>
              <MenuItemStyled onClick={() => scrollTo("home")}>
                Home
              </MenuItemStyled>
              <MenuItemStyled onClick={() => scrollTo("about")}>
                Movies
              </MenuItemStyled>
              <MenuItemStyled onClick={() => scrollTo("movie-list")}>
                Now showing
              </MenuItemStyled>
              <MenuItemStyled onClick={() => scrollTo("showcase")}>
                Special offer
              </MenuItemStyled>
              <MenuItemStyled onClick={() => scrollTo("upcoming-movies")}>
                Upcoming
              </MenuItemStyled>
              <MenuItemStyled onClick={() => scrollTo("faq")}>
                Faq
              </MenuItemStyled>
            </Menu>
          </>
        )}
        <div className="desktop">
          <Button
            className="accountBtn"
            variant="contained"
            aria-describedby={id}
            onClick={handleAccountClick}
          >
            My Account
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <MenuItem onClick={handleUserProfile}>
              <PersonIcon />
              <Item>User Profile</Item>
            </MenuItem>
            <MenuItem onClick={handleBookingHistory}>
              <HistoryIcon />
              <Item>Booking History</Item>
            </MenuItem>
            <MenuItem onClick={handleChangePassword}>
              <KeyIcon />
              <Item>Change Password</Item>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon />
              <Item>Sign Out</Item>
            </MenuItem>
          </Popover>
        </div>
      </NavBar>
    </Section>
  );
};

export default Navigation;
