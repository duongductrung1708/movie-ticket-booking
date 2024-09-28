import "@fontsource/akaya-telivigala";
import "@fontsource/sora";
import React, { useEffect, useState } from "react";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Grid,
  Breadcrumbs,
  Typography,
  Link as MuiLink,
  Paper,
  Box,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "../components/Navigation";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { getUser, updateUser } from "../services/api";
import { useAuth } from "../hooks/AuthProvider";

const Section = styled.section`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  width: 100vw;
  position: relative;
  background-color: ${(props) => props.theme.body};
`;

const Container = styled.div`
  width: 75%;
  min-height: 80vh;
  margin: 0 auto;
  margin-bottom: 10rem;
  @media (max-width: 64em) {
    width: 85%;
  }
  @media (max-width: 48em) {
    width: 100%;
  }
`;

const Btn = styled.button`
  display: inline-block;
  background-color: ${(props) => props.theme.text};
  color: ${(props) => props.theme.body};
  outline: none;
  border: none;
  margin-top: 3rem;
  margin-right: 2rem;
  font-size: ${(props) => props.theme.fontsm};
  padding: 0.9rem 2.3rem;
  border-radius: 50px;
  cursor: pointer;
  float: right;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(0.9);
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    border: 2px solid ${(props) => props.theme.text};
    width: 100%;
    height: 100%;
    border-radius: 50px;
    transition: all 0.2s ease;
  }

  &:hover::after {
    transform: translate(-50%, -50%) scale(1);
    padding: 0.3rem;
  }
`;

const CancelBtn = styled.button`
  display: inline-block;
  background-color: transparent;
  color: red;
  outline: none;
  border: none;
  margin-top: 3rem;
  margin-right: 2rem;
  font-size: ${(props) => props.theme.fontsm};
  padding: 0.9rem 2.3rem;
  border-radius: 50px;
  cursor: pointer;
  float: right;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(0.9);
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    border: 2px solid red;
    width: 100%;
    height: 100%;
    border-radius: 50px;
    transition: all 0.2s ease;
  }

  &:hover::after {
    transform: translate(-50%, -50%) scale(1);
    padding: 0.3rem;
  }
`;

const BreadcrumbContainer = styled.div`
  margin-bottom: 1rem;
  margin-top: 5rem;
`;

const StyledBreadcrumbs = styled(Breadcrumbs)`
  background-color: ${(props) => props.theme.body};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const BreadcrumbLink = styled(MuiLink)`
  font-family: "Sora", sans-serif !important;
  color: orange !important;
  text-decoration: none !important;

  &:hover {
    text-decoration: underline;
  }
`;

const UserProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    fullName: "",
    email: "",
    gender: "male", // Default value
    dob: "",
    city: "HCMC", // Default value
    district: "",
    address: "",
  });

  const cities = ["HCMC", "Hanoi", "Da Nang"];
  const districts = ["District A", "District B", "District C"];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const userData = await getUser(user.id);
        setFormData(userData);
      } catch (error) {
        toast.error("Failed to fetch user data: " + error); 
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(formData.phoneNumber)) {
      toast.error("Invalid phone number. It should be between 10 and 15 digits.");
      return;
    }

    const currentDate = new Date();
    const selectedDOB = new Date(formData.dob);

    if (selectedDOB > currentDate) {
      toast.error("Date of Birth cannot be in the future.");
      return;
    }

    try {
      await updateUser(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error);
    }
    
    console.log("Form submitted:", formData);
  };

  const handleCancel = () => {
    setFormData({
      phoneNumber: "",
      fullName: "",
      email: "",
      gender: "male",
      dob: "",
      city: "HCMC",
      district: "",
      address: "",
    });
    toast.info("Form reset.");
  };

  return (
    <Section>
      <Navigation />
      <Container>
        <BreadcrumbContainer>
          <StyledBreadcrumbs aria-label="breadcrumb">
            <BreadcrumbLink component={Link} to="/home">
              Home
            </BreadcrumbLink>
            <Typography color="textPrimary">Profile</Typography>
          </StyledBreadcrumbs>
        </BreadcrumbContainer>
        <Paper elevation={3} style={{ padding: "2rem", borderRadius: "10px" }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Profile
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  inputProps={{ maxLength: 15 }}
                  variant="outlined"
                  margin="normal"
                  disabled
                />
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  inputProps={{ maxLength: 50 }}
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  inputProps={{ maxLength: 100 }}
                  variant="outlined"
                  margin="normal"
                  disabled
                />
                <Typography variant="subtitle1" gutterBottom>
                  Select Gender
                </Typography>
                <RadioGroup
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  row
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  margin="normal"
                  inputProps={{ max: new Date().toISOString().split("T")[0] }}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  margin="normal"
                >
                  {cities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  select
                  label="District/County"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  margin="normal"
                >
                  {districts.map((district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  inputProps={{ maxLength: 200 }}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  marginTop={2}
                >
                  <Btn type="submit">Save Changes</Btn>
                  <CancelBtn onClick={handleCancel}>Cancel</CancelBtn>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
      <Footer />
      <ToastContainer />
    </Section>
  );
};

export default UserProfile;
