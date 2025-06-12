import React from 'react';
import { 
  Box, 
  Chip, 
  Menu, 
  MenuItem, 
  IconButton, 
  Avatar, 
  Typography,
  Stack,
  Divider,
  Tooltip
} from '@mui/material';
import { 
  AccountCircle, 
  ArrowDropDown,
  PersonOutline,
  MedicalServices,
  AdminPanelSettings,
  ExitToApp
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/store';
import { selectUser, setDemoUser, logoutUser, UserType } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';

const UserStatus: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserTypeChange = (userType: UserType) => {
    dispatch(setDemoUser(userType));
    handleMenuClose();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    handleMenuClose();
    navigate('/'); // Ana sayfaya yönlendir
  };

  const getUserTypeIcon = (userType: UserType) => {
    switch (userType) {
      case 'hasta':
        return <PersonOutline />;
      case 'doktor':
        return <MedicalServices />;
      case 'yonetici':
        return <AdminPanelSettings />;
      default:
        return <AccountCircle />;
    }
  };

  const getUserTypeColor = (userType: UserType): "primary" | "success" | "warning" | "default" => {
    switch (userType) {
      case 'hasta':
        return 'primary';
      case 'doktor':
        return 'success';
      case 'yonetici':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getUserTypeLabel = (userType: UserType) => {
    switch (userType) {
      case 'hasta':
        return 'Hasta';
      case 'doktor':
        return 'Doktor';
      case 'yonetici':
        return 'Yönetici';
      default:
        return 'Misafir';
    }
  };

  return (
    <Box>
      {user.isAuthenticated ? (
        <>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title={`${getUserTypeLabel(user.userType)} olarak giriş yapıldı`} arrow>
              <Chip
                icon={getUserTypeIcon(user.userType)}
                label={getUserTypeLabel(user.userType)}
                variant="outlined"
                size="small"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
            </Tooltip>
            <Tooltip title="Kullanıcı menüsünü aç" arrow>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                size="small"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
                <ArrowDropDown />
              </IconButton>
            </Tooltip>
          </Stack>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { mt: 1, minWidth: 200 }
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {user.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user.email}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                {getUserTypeLabel(user.userType)} olarak giriş yapıldı
              </Typography>
            </Box>
            <Divider />
            <Tooltip title="Ana sayfaya git" arrow placement="left">
              <MenuItem onClick={() => { navigate('/'); handleMenuClose(); }}>
                <AccountCircle sx={{ mr: 1 }} />
                Ana Sayfa
              </MenuItem>
            </Tooltip>
            <Tooltip title="Sistemden çıkış yapın" arrow placement="left">
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                Çıkış Yap
              </MenuItem>
            </Tooltip>
          </Menu>
        </>
      ) : (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Ana sayfaya gidip giriş yapın" arrow>
            <Chip
              icon={<AccountCircle />}
              label="Giriş Yap"
              variant="outlined"
              clickable
              onClick={() => navigate('/')}
              size="small"
              sx={{
                color: 'white',
                borderColor: 'white',
                '& .MuiChip-icon': {
                  color: 'white'
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            />
          </Tooltip>
        </Stack>
      )}
    </Box>
  );
};

export default UserStatus; 