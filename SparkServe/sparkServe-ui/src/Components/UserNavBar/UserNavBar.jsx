import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import logo2 from "../../assets/logo2.png";
import UserAccountPopover from "../UserAccountPopover/UserAccountPopover";
import UserSignIn from "../UserSignIn/UserSignIn";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL;


const logoStyle = {
  width: "140px",
  height: "auto",
  cursor: "pointer",
};

const navButtonStyle = {
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "2px",
    backgroundColor: "primary.main",
    transform: "scaleX(0)",
    transformOrigin: "bottom right",
    transition: "transform 0.3s ease-out",
  },
  "&:hover::after": {
    transform: "scaleX(1)",
    transformOrigin: "bottom left",
  },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
};

function UserNavBar() {
  const [open, setOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem("isUserAuthenticated");
    const id = localStorage.getItem('userId');
    const getUser = async () => {


      try {
          const response = await axios.get(`${baseUrl}/users/${id}`);

          setProfilePicture(response.data.profilePicture || '');
      } catch (err) {
          console.error(`Error getting User:`, err);
      }
  };
    getUser();

    setIsUserAuthenticated(authStatus === "true");
  }, []);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSignInClick = () => {
    setSignInModalOpen(true);
  };

  const handleSignInClose = () => {
    setSignInModalOpen(false);
  };

  const renderButtons = () => {
    if (!isUserAuthenticated) {
      return (
        <>
          <Button
            color="primary"
            variant="text"
            size="small"
            onClick={handleSignInClick}
          >
            Sign in
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="small"
            component={Link}
            to="/UserSignUpPage"
          >
            Sign up
          </Button>
        </>
      );
    } else {
      return (
        <>
          <UserAccountPopover profileType="User Profile" profilePicture={profilePicture} />        
        </>
      );
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "white",
          backgroundImage: "none",
          zIndex: 1100,
        }}
      >
        <Container>
          <Toolbar
            variant="regular"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={logo2}
                style={logoStyle}
                alt="Logo"
                onClick={() => navigate("/")}
              />
            </Box>
            <Button
              color="primary"
              variant="text"
              size="large"
              component={Link}
              to="/"
              sx={navButtonStyle}
            >
              Home
            </Button>
            <Button
              color="primary"
              variant="text"
              size="large"
              component={Link}
              to="/UserLandingPage"
              sx={navButtonStyle}
            >
              Opportunities
            </Button>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 2,
                alignItems: "center",
              }}
            >
              {isUserAuthenticated && (
                <Button
                  color="primary"
                  variant="text"
                  size="large"
                  component={Link}
                  to="/Map"
                  sx={navButtonStyle}
                >
                  Map
                </Button>
              )}
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
                alignItems: "center",
              }}
            >
              {renderButtons()}
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton color="primary" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250, p: 2 }}>
                  {location.pathname === "/" ||
                  location.pathname === "/signup" ? (
                    <>
                      <MenuItem>
                        <Button
                          color="primary"
                          variant="contained"
                          component={Link}
                          to="/UserSignUpPage"
                          sx={{ width: "100%" }}
                        >
                          Sign up
                        </Button>
                      </MenuItem>
                      <MenuItem>
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={handleSignInClick}
                          sx={{ width: "100%" }}
                        >
                          Sign in
                        </Button>
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem>
                        <Button
                          color="primary"
                          variant="text"
                          size="small"
                          component={Link}
                          to="/"
                          sx={{ width: "100%", ...navButtonStyle }}
                        >
                          Home
                        </Button>
                      </MenuItem>
                      <MenuItem>
                        <Button
                          color="primary"
                          variant="text"
                          size="small"
                          component={Link}
                          to="/UserLandingPage"
                          sx={{ width: "100%", ...navButtonStyle }}
                        >
                          Opportunities
                        </Button>
                      </MenuItem>
                      {isUserAuthenticated && (
                        <MenuItem>
                          <Button
                            color="primary"
                            variant="text"
                            size="small"
                            component={Link}
                            to="/Map"
                            sx={{ width: "100%", ...navButtonStyle }}
                          >
                            Map
                          </Button>
                        </MenuItem>
                      )}
                      {isUserAuthenticated && (
                        <MenuItem>
                          <UserAccountPopover profileType="User Profile" />
                        </MenuItem>
                      )}
                    </>
                  )}
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <UserSignIn open={signInModalOpen} handleClose={handleSignInClose} />
    </>
  );
}

export default UserNavBar;
