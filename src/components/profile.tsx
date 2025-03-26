import type React from "react";
import { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { logout as logoutAction } from "@/redux/slices/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, SlidersHorizontal, UserRoundCog } from "lucide-react";

const ProfileContainer = styled(Box)(({ theme }) => ({
  position: "sticky",
  bottom: 0,
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: "auto",
}));

const ProfileButton = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: theme.palette.primary.main,
}));

const UserInfo = styled(Box)({
  marginLeft: 12,
  flex: 1,
  overflow: "hidden",
});

const UserName = styled(Typography)({
  fontWeight: 600,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const UserRole = styled(Typography)({
  fontSize: "0.75rem",
  color: "text.secondary",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

interface ProfileSectionProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  userName = "John Doe",
  userRole = "Administrator",
  userAvatar,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ProfileContainer>
      <Divider />
      <ProfileButton onClick={handleClick}>
        {userAvatar ? (
          <UserAvatar src={userAvatar} alt={userName} />
        ) : (
          <UserAvatar>{userName.charAt(0)}</UserAvatar>
        )}
        <UserInfo>
          <UserName variant="body1">{userName}</UserName>
          <UserRole variant="body2">{userRole}</UserRole>
        </UserInfo>
        <IconButton size="small" edge="end">
          {open ? (
            <KeyboardArrowUp fontSize="small" />
          ) : (
            <KeyboardArrowDown fontSize="small" />
          )}
        </IconButton>
      </ProfileButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={() => navigate("/profile/edit")}>
          <ListItemIcon>
            <UserRoundCog size="20px" />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigate("/password/edit")}>
          <ListItemIcon>
            <SlidersHorizontal size="20px" />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => dispatch(logoutAction())}>
          <ListItemIcon>
            <LogOut size="20px" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </ProfileContainer>
  );
};
