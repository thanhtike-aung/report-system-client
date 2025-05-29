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
  ChevronRight,
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

const SidebarContainer = styled(Box)<{ isExpanded: boolean }>(
  ({ isExpanded, theme }) => ({
    display: "flex",
    borderRight: "1px solid #c5c7c7",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  })
);

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
  miniWidth?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  width = 270,
  miniWidth = 65,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isExpanded, setIsExpanded] = useState<boolean>(() => !isMobile);
  const [openMorning, setOpenMorning] = useState<boolean>(false);
  const [openEvening, setOpenEvening] = useState<boolean>(false);

  const currentUser = decodeJWT(
    useSelector((state: RootState) => state.auth.authToken)
  );
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const drawer = (
    <SidebarContainer isExpanded={isExpanded}>
      <Logo
        sx={{
          minHeight: 64,
          justifyContent: isExpanded ? "flex-start" : "center",
          px: isExpanded ? 2 : 1,
        }}
      >
        <LogoIcon>M</LogoIcon>
        {isExpanded && (
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
        )}
      </Logo>

      <MenuContainer>
        {isExpanded && <SectionTitle>REPORTING</SectionTitle>}
        <List disablePadding>
          {/* Morning Attendance Reporting */}
          <ListItemButton
            onClick={() => setOpenMorning(!openMorning)}
            sx={{
              minHeight: 48,
              justifyContent: isExpanded ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isExpanded ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <WbSunny />
            </ListItemIcon>
            {isExpanded && (
              <>
                <ListItemText primary="Morning Attendance" />
                {openMorning ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItemButton>

          {isExpanded && openMorning && (
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
          <ListItemButton
            onClick={() => setOpenEvening(!openEvening)}
            sx={{
              minHeight: 48,
              justifyContent: isExpanded ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isExpanded ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <Brightness4 />
            </ListItemIcon>
            {isExpanded && (
              <>
                <ListItemText primary="Evening Reporting" />
                {openEvening ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItemButton>

          {isExpanded && openEvening && (
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

        {isExpanded && <SectionTitle sx={{ mt: 2 }}>PROJECT</SectionTitle>}
        <List disablePadding>
          <ListItemButton
            selected={location.pathname === "/projects"}
            onClick={() => navigate("/projects")}
            sx={{
              minHeight: 48,
              justifyContent: isExpanded ? "initial" : "center",
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
                mr: isExpanded ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <Work />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Projects List" />}
          </ListItemButton>

          {currentUser.role !== USER_ROLES.MEMBER && (
            <ListItemButton
              selected={location.pathname === "/projects/add"}
              onClick={() => navigate("/projects/add")}
              sx={{
                minHeight: 48,
                justifyContent: isExpanded ? "initial" : "center",
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
                  mr: isExpanded ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <Add />
              </ListItemIcon>
              {isExpanded && <ListItemText primary="Add Project" />}
            </ListItemButton>
          )}
        </List>

        {isExpanded && <SectionTitle sx={{ mt: 2 }}>MEMBER</SectionTitle>}
        <List disablePadding>
          <ListItemButton
            selected={location.pathname === "/members"}
            onClick={() => navigate("/members")}
            sx={{
              minHeight: 48,
              justifyContent: isExpanded ? "initial" : "center",
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
                mr: isExpanded ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <Group />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Members List" />}
          </ListItemButton>

          {currentUser.role !== USER_ROLES.MEMBER && (
            <ListItemButton
              selected={location.pathname === "/members/add"}
              onClick={() => navigate("/members/add")}
              sx={{
                minHeight: 48,
                justifyContent: isExpanded ? "initial" : "center",
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
                  mr: isExpanded ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <PersonAdd />
              </ListItemIcon>
              {isExpanded && <ListItemText primary="Add Member" />}
            </ListItemButton>
          )}
        </List>

        {/* Event */}
        {isExpanded && <SectionTitle sx={{ mt: 2 }}>EVENT</SectionTitle>}

        {/* Knowledge Sharing */}
        <List disablePadding>
          <ListItemButton
            selected={location.pathname === "/event/knowledgesharings"}
            onClick={() => navigate("/event/knowledgesharings")}
            sx={{
              minHeight: 48,
              justifyContent: isExpanded ? "initial" : "center",
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
                mr: isExpanded ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <Forum />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Knowledge Sharing" />}
          </ListItemButton>
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

      {/* Profile section when expanded */}
      {isExpanded && (
        <ProfileSection
          userName={currentUser?.name}
          userRole={currentUser?.role}
        />
      )}

      {/* Toggle button */}
      <Box
        sx={{
          ...(isExpanded
            ? {
                position: "absolute",
                right: 1,
                top: "50%",
                transform: "translateY(-50%)",
                // borderLeft: '1px solid #c5c7c7',
                // borderRadius: '4px 0 0 4px',
                borderRadius: "50%",
              }
            : {
                borderTop: "1px solid #c5c7c7",
                display: "flex",
                justifyContent: "center",
                p: 1,
              }),
        }}
      >
        <IconButton
          onClick={handleDrawerToggle}
          size="small"
          sx={{
            backgroundColor: theme.palette.background.paper,
            "&:hover": { backgroundColor: theme.palette.action.hover },
            ...(isExpanded && {
              borderRadius: "4px 0 0 4px",
            }),
          }}
        >
          {isExpanded ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>
    </SidebarContainer>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isExpanded ? width : miniWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isExpanded ? width : miniWidth,
          boxSizing: "border-box",
          border: "none",
          overflowX: "hidden",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};
