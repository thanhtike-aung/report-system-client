import type React from "react";
import { useEffect, useState } from "react";
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
} from "@mui/icons-material";
import { ProfileSection } from "@/components/profile";
import { useLocation, useNavigate } from "react-router-dom";
import { CurrentUser } from "@/types/user";
import { decodeJWT } from "@/utils/jwt";
import useLocalStorage from "@/hooks/useLocalStorage";
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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface SidebarProps {
  width?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ width = 240 }) => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const currentUser = decodeJWT(
    useSelector((state: RootState) => state.auth.authToken)
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <SidebarContainer>
      {isMobile && (
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>
      )}

      <Logo sx={{ minHeight: 64 }}>
        <LogoIcon>D</LogoIcon>
        <Typography variant="h6" component="div" fontWeight="bold" noWrap>
          MTM-Dev02
        </Typography>
      </Logo>

      <MenuContainer>
        <SectionTitle>REPORTING</SectionTitle>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === "/report/self"}
              sx={{
                minHeight: 48,
                px: 2.5,
              }}
              onClick={() => {
                navigate("/report/self");
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
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
              selected={location.pathname === "/report/other"}
              onClick={() => {
                navigate("/report/other");
              }}
              sx={{
                minHeight: 48,
                px: 2.5,
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
              <ListItemText primary="For other" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === "/report"}
              onClick={() => navigate("/report")}
              sx={{
                minHeight: 48,
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: "center",
                }}
              >
                <Description />
              </ListItemIcon>
              <ListItemText primary="Reports List" />
            </ListItemButton>
          </ListItem>
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
      {/* Mobile menu button */}
      {isMobile && (
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
      )}

      {/* Mobile drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: width,
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: width,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: width,
              boxSizing: "border-box",
              border: "none",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};
