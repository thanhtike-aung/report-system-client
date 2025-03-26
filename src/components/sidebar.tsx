import type React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  styled,
} from "@mui/material";
import {
  Person,
  Group,
  Description,
  Work,
  Add,
  PersonAdd,
} from "@mui/icons-material";
import { ProfileSection } from "./profile";
import { useLocation, useNavigate } from "react-router-dom";

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
  flexDirection: "column",
  height: "100%",
});

const MenuContainer = styled(Box)({
  flex: 1,
  overflowY: "auto",
});

interface SidebarProps {
  width?: number;
}

export const MySidebar: React.FC<SidebarProps> = ({ width = 240 }) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
          border: "none",
        },
      }}
    >
      <SidebarContainer>
        <Logo>
          <LogoIcon>D</LogoIcon>
          <Typography variant="h6" component="div" fontWeight="bold">
            Dev-2
          </Typography>
        </Logo>

        <MenuContainer>
          <SectionTitle>REPORTING</SectionTitle>
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === "/report/self"}
                onClick={() => navigate("/report/self")}
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="For myself" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === "/report/other"}
                onClick={() => navigate("/report/other")}
              >
                <ListItemIcon>
                  <Group />
                </ListItemIcon>
                <ListItemText primary="For my members" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === "/report"}
                onClick={() => navigate("/report")}
              >
                <ListItemIcon>
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
                selected={location.pathname === "/project"}
                onClick={() => navigate("/project")}
              >
                <ListItemIcon>
                  <Work />
                </ListItemIcon>
                <ListItemText primary="Projects List" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === "/project/add"}
                onClick={() => navigate("/project/add")}
              >
                <ListItemIcon>
                  <Add />
                </ListItemIcon>
                <ListItemText primary="Add Project" />
              </ListItemButton>
            </ListItem>
          </List>

          <SectionTitle sx={{ mt: 2 }}>MEMBER</SectionTitle>
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === "/members"}
                onClick={() => navigate("/members")}
              >
                <ListItemIcon>
                  <Group />
                </ListItemIcon>
                <ListItemText primary="Members List" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === "/members/add"}
                onClick={() => navigate("/members/add")}
              >
                <ListItemIcon>
                  <PersonAdd />
                </ListItemIcon>
                <ListItemText primary="Add Member" />
              </ListItemButton>
            </ListItem>
          </List>
        </MenuContainer>

        {/* Profile section at the bottom */}
        <ProfileSection userName="Alex Johnson" userRole="Admin" />
      </SidebarContainer>
    </Drawer>
  );
};
