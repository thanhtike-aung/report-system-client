import type React from "react";
import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useMediaQuery,
  styled,
  useTheme,
  Divider,
} from "@mui/material";
import {
  Person,
  Group,
  Description,
  Work,
  Add,
  PersonAdd,
  Menu as MenuIcon,
  ChevronLeft,
  ExpandLess,
  ExpandMore,
  WbSunny,
  Brightness4,
  Forum,
} from "@mui/icons-material";
import { ProfileSection } from "@/components/profile";
import { useLocation, useNavigate } from "react-router-dom";
import { decodeJWT } from "@/utils/jwt";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { USER_ROLES } from "@/constants";

// Logo component
const Logo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  color: theme.palette.primary.main,
  fontWeight: "bold",
  fontSize: "1.5rem",
}));

const LogoIcon = styled("div")(({ theme }) => ({
  width: 32,
  height: 32,
  backgroundColor: theme.palette.primary.main,
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(1),
  color: "white",
  fontWeight: "bold",
  fontSize: "1.2rem",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  fontSize: "0.75rem",
  fontWeight: "bold",
  color: theme.palette.text.secondary,
}));

const SidebarContainer = styled(Box)({
  display: "flex",
  borderRight: "1px solid #c5c7c7",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
});

const MenuContainer = styled(Box)({
  flex: 1,
  overflowY: "auto",
});

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
// }));

interface SidebarProps {
  width?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ width = 250 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // Set initial state: open on desktop, closed on mobile
  const [mobileOpen, setMobileOpen] = useState<boolean>(() => !isMobile);
  const [openMorning, setOpenMorning] = useState<boolean>(false);
  const [openEvening, setOpenEvening] = useState<boolean>(false);

  const currentUser = decodeJWT(
    useSelector((state: RootState) => state.auth.authToken)
  );
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Show close button on all screen sizes
  const drawer = (
    <SidebarContainer>
      {/* Absolutely positioned close button */}
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          position: "absolute",
          top: 300,
          right: 8,
          zIndex: 1301,
          background: "white",
          boxShadow: 1,
          "&:hover": { background: "#f0f0f0" },
        }}
        size="small"
      >
        <ChevronLeft />
      </IconButton>

      {/* Remove DrawerHeader if not needed */}
      {/* <DrawerHeader /> */}

      <Logo sx={{ minHeight: 64 }}>
        <LogoIcon>M</LogoIcon>
        <Typography
          variant="h6"
          component="div"
          fontWeight="bold"
          noWrap
          sx={{
            fontSize: "1.7rem",
            background: "url('/pattern-bg.jpg') center",
            backgroundSize: "cover",
            backgroundClip: "text",
            color: "transparent",
            animation: "bg-animate 10s linear infinite",
          }}
        >
          MTM-Dev02
        </Typography>
      </Logo>

      <MenuContainer>
        <SectionTitle>REPORTING</SectionTitle>
        <List disablePadding>
          {/* Morning Attendance Reporting */}
          <ListItemButton onClick={() => setOpenMorning(!openMorning)}>
            <ListItemIcon sx={{ minWidth: 0, mr: 1, justifyContent: "center" }}>
              <WbSunny />
            </ListItemIcon>
            <ListItemText primary="Morning Attendance" />
            {openMorning ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          {openMorning && (
            <List component="div" disablePadding>
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === "/attendances/self"}
                  onClick={() => navigate("/attendances/self")}
                  sx={{
                    paddingLeft: "10px",
                    minHeight: 48,
                    px: 2.5,
                    "&.Mui-selected": {
                      backgroundColor: "#d9e6ff",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "#cad5eb !important",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
                      justifyContent: "center",
                    }}
                  >
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="For myself" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === "/attendances/other"}
                  onClick={() => navigate("/attendances/other")}
                  sx={{
                    pl: 4,
                    minHeight: 48,
                    px: 2.5,
                    "&.Mui-selected": {
                      backgroundColor: "#d9e6ff",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "#cad5eb !important",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
                      justifyContent: "center",
                    }}
                  >
                    <Group />
                  </ListItemIcon>
                  <ListItemText primary="For other" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === "/attendances"}
                  onClick={() => navigate("/attendances")}
                  sx={{
                    pl: 4,
                    minHeight: 48,
                    px: 2.5,
                    "&.Mui-selected": {
                      backgroundColor: "#d9e6ff",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "#cad5eb !important",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
                      justifyContent: "center",
                    }}
                  >
                    <Description />
                  </ListItemIcon>
                  <ListItemText primary="Attendances List" />
                </ListItemButton>
              </ListItem>
              <Divider />
            </List>
          )}

          {/* Evening Reporting */}
          <ListItemButton onClick={() => setOpenEvening(!openEvening)}>
            <ListItemIcon sx={{ minWidth: 0, mr: 1, justifyContent: "center" }}>
              <Brightness4 />
            </ListItemIcon>
            <ListItemText primary="Evening Reporting" />
            {openEvening ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          {openEvening && (
            <List component="div" disablePadding>
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === "/reports/add"}
                  onClick={() => navigate("/reports/add")}
                  sx={{
                    pl: 4,
                    minHeight: 48,
                    px: 2.5,
                    "&.Mui-selected": {
                      backgroundColor: "#d9e6ff",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "#cad5eb !important",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
                      justifyContent: "center",
                    }}
                  >
                    <Work />
                  </ListItemIcon>
                  <ListItemText primary="Report Work" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === "/reports"}
                  onClick={() => navigate("/reports")}
                  sx={{
                    pl: 4,
                    minHeight: 48,
                    px: 2.5,
                    "&.Mui-selected": {
                      backgroundColor: "#d9e6ff",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "#cad5eb !important",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
                      justifyContent: "center",
                    }}
                  >
                    <Description />
                  </ListItemIcon>
                  <ListItemText primary="Report List" />
                </ListItemButton>
              </ListItem>
              <Divider />
            </List>
          )}
        </List>

        <SectionTitle sx={{ mt: 2 }}>PROJECT</SectionTitle>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === "/projects"}
              onClick={() => navigate("/projects")}
              sx={{
                minHeight: 48,
                px: 2.5,
                "&.Mui-selected": {
                  backgroundColor: "#d9e6ff",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#cad5eb !important",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: "center",
                }}
              >
                <Work />
              </ListItemIcon>
              <ListItemText primary="Projects List" />
            </ListItemButton>
          </ListItem>
          {currentUser.role !== USER_ROLES.MEMBER && (
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === "/projects/add"}
                onClick={() => navigate("/projects/add")}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  "&.Mui-selected": {
                    backgroundColor: "#d9e6ff",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#cad5eb !important",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: "center",
                  }}
                >
                  <Add />
                </ListItemIcon>
                <ListItemText primary="Add Project" />
              </ListItemButton>
            </ListItem>
          )}
        </List>

        <SectionTitle sx={{ mt: 2 }}>MEMBER</SectionTitle>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === "/members"}
              onClick={() => navigate("/members")}
              sx={{
                minHeight: 48,
                px: 2.5,
                "&.Mui-selected": {
                  backgroundColor: "#d9e6ff",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#cad5eb !important",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: "center",
                }}
              >
                <Group />
              </ListItemIcon>
              <ListItemText primary="Members List" />
            </ListItemButton>
          </ListItem>
          {currentUser.role !== USER_ROLES.MEMBER && (
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === "/members/add"}
                onClick={() => navigate("/members/add")}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  "&.Mui-selected": {
                    backgroundColor: "#d9e6ff",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#cad5eb !important",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: "center",
                  }}
                >
                  <PersonAdd />
                </ListItemIcon>
                <ListItemText primary="Add Member" />
              </ListItemButton>
            </ListItem>
          )}
        </List>

        {/* Event */}
        <SectionTitle sx={{ mt: 2 }}>EVENT</SectionTitle>

        {/* Knowledge Sharing */}
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === "/event/knowledgesharings"}
              onClick={() => navigate("/event/knowledgesharings")}
              sx={{
                minHeight: 48,
                px: 2.5,
                "&.Mui-selected": {
                  backgroundColor: "#d9e6ff",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#cad5eb !important",
                },
              }}
            >
              <ListItemIcon
                sx={{ minWidth: 0, mr: 3, justifyContent: "center" }}
              >
                <Forum />
              </ListItemIcon>
              <ListItemText primary="Knowledge Sharing" />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Game & Various Events */}
        {/* <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
            selected={location.pathname === "/event/game_various"}
            onClick={() => navigate("/event/game_various")}
            sx={{
              minHeight: 48,
              px: 2.5,
              "&.Mui-selected": {
                backgroundColor: "#d9e6ff",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#cad5eb !important"
              },
            }}>
              <ListItemIcon sx={{minWidth: 0, mr: 3, justifyContent: "center"}}>
                <SportsEsports/>
              </ListItemIcon>
              <ListItemText primary="Game" />
            </ListItemButton>
          </ListItem>
        </List> */}
      </MenuContainer>

      {/* Profile section */}
      <ProfileSection
        userName={currentUser?.name}
        userRole={currentUser?.role}
      />
    </SidebarContainer>
  );

  return (
    <>
      {/* Always show hamburger menu */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          position: "fixed",
          top: 8,
          left: 15,
          zIndex: 1199,
          backgroundColor: theme.palette.background.paper,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer for both mobile and desktop */}
      <Drawer
        variant="persistent"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: width,
            border: "none",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};
