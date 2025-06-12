import React, { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar,
  Typography,
  Button,
  Stack,
  Container,
  Paper,
  Divider,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Tooltip,
  Chip
} from '@mui/material';
import { 
  LocalHospital, 
  Person, 
  MedicalServices, 
  Settings, 
  Home,
  Phone,
  Email,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  Menu as MenuIcon,
  Close as CloseIcon,
  Login as LoginIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import LoginModal from './LoginModal';
import { useAppSelector, useAppDispatch } from '../store/store';
import { selectUser, UserType, logoutUser } from '../store/userSlice';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<UserType>('hasta');
  const user = useAppSelector(selectUser);

  const isActive = (path: string) => location.pathname === path;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLoginModalOpen = (userType: UserType) => {
    setSelectedUserType(userType);
    setLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  // Kullanıcı tipine göre panel başlığı
  const getPanelTitle = () => {
    if (!user.isAuthenticated) return 'Doktor Randevu Sistemi';
    
    switch (user.userType) {
      case 'hasta':
        return 'Hasta Paneli';
      case 'doktor':
        return 'Doktor Paneli';
      case 'yonetici':
        return 'Yönetici Paneli';
      default:
        return 'Doktor Randevu Sistemi';
    }
  };

  // Kullanıcı tipine göre ikon
  const getUserIcon = () => {
    switch (user.userType) {
      case 'hasta':
        return <Person />;
      case 'doktor':
        return <MedicalServices />;
      case 'yonetici':
        return <Settings />;
      default:
        return <Person />;
    }
  };

  // Menü öğelerini kullanıcı durumuna göre dinamik oluştur (sadece giriş yapmayanlar için)
  const getMenuItems = () => {
    const baseItems = [
      { label: 'Ana Sayfa', path: '/', icon: <Home />, tooltip: 'Ana sayfaya git' }
    ];

    // Sadece giriş yapmamış kullanıcılara tüm seçenekleri göster (keşif için)
    if (!user.isAuthenticated) {
      return [
        ...baseItems,
        { label: 'Hastalar', path: '/hastalar', icon: <Person />, tooltip: 'Hasta portalı' },
        { label: 'Doktorlar', path: '/doktorlar', icon: <MedicalServices />, tooltip: 'Doktor bilgileri' },
        { label: 'Yönetici', path: '/yonetici', icon: <Settings />, tooltip: 'Yönetim paneli' }
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          {/* Ana Sayfa için özel header */}
          {location.pathname === '/' ? (
            <>
              <Tooltip title="Ana sayfaya git" arrow>
                <Box
                  component={Link}
                  to="/"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    mr: 2,
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                >
                  <LocalHospital sx={{ mr: 1 }} />
                </Box>
              </Tooltip>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  flexGrow: 1,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                {isMobile ? 'Doktor Randevu' : 'Doktor Randevu Sistemi'}
              </Typography>
              {/* Desktop Menu */}
              {!isMobile && (
                <Stack direction="row" spacing={1} alignItems="center">
                  {menuItems.map((item) => (
                    <Tooltip key={item.path} title={item.tooltip} arrow>
                      <Button
                        color="inherit"
                        component={Link}
                        to={item.path}
                        startIcon={item.icon}
                        sx={{ 
                          bgcolor: isActive(item.path) ? 'primary.dark' : 'transparent',
                          '&:hover': { bgcolor: 'primary.dark' },
                          borderRadius: 2,
                          minWidth: 'auto'
                        }}
                      >
                        {item.label}
                      </Button>
                    </Tooltip>
                  ))}
                  {/* User Status / Login Buttons */}
                  {user.isAuthenticated ? (
                    <Tooltip title={`${user.userType} olarak giriş yapıldı`} arrow>
                      <Chip
                        icon={getUserIcon()}
                        label={user.name}
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
                  ) : (
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Hasta girişi" arrow>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Person />}
                          onClick={() => handleLoginModalOpen('hasta')}
                          sx={{
                            color: 'white',
                            borderColor: 'white',
                            '&:hover': {
                              borderColor: 'white',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          Hasta
                        </Button>
                      </Tooltip>
                      <Tooltip title="Doktor girişi" arrow>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<MedicalServices />}
                          onClick={() => handleLoginModalOpen('doktor')}
                          sx={{
                            color: 'white',
                            borderColor: 'white',
                            '&:hover': {
                              borderColor: 'white',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          Doktor
                        </Button>
                      </Tooltip>
                    </Stack>
                  )}
                  <ThemeSwitcher />
                </Stack>
              )}
            </>
          ) : (
            /* Panel Sayfaları için Özel Header */
            <>
              {/* Panel ikonu ve başlığı */}
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                {user.isAuthenticated && getUserIcon()}
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    flexGrow: 1,
                    ml: user.isAuthenticated ? 1 : 0,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  {getPanelTitle()}
                </Typography>
              </Box>

              {/* Sağdaki kontroller */}
              <Box sx={{ flexGrow: 1 }} />
              <Stack direction="row" spacing={1} alignItems="center">
                {/* Giriş yapmış kullanıcı için çıkış butonu */}
                {user.isAuthenticated && (
                  <Tooltip title="Çıkış Yap" arrow>
                    <IconButton
                      color="inherit"
                      onClick={handleLogout}
                      sx={{
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      <LogoutIcon />
                    </IconButton>
                  </Tooltip>
                )}
                
                {/* Tema değiştirici */}
                <ThemeSwitcher />
              </Stack>
            </>
          )}

          {/* Mobile Menu Button - Sadece ana sayfa için */}
          {isMobile && location.pathname === '/' && (
            <Stack direction="row" spacing={1} alignItems="center">
              <ThemeSwitcher />
              <Tooltip title="Menüyü aç" arrow>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          )}

          {/* Mobile için panel sayfalarında sadece tema ve çıkış */}
          {isMobile && location.pathname !== '/' && (
            <Stack direction="row" spacing={1} alignItems="center">
              {user.isAuthenticated && (
                <Tooltip title="Çıkış Yap" arrow>
                  <IconButton
                    color="inherit"
                    onClick={handleLogout}
                    sx={{ color: 'white' }}
                  >
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              )}
              <ThemeSwitcher />
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer - Sadece ana sayfa için */}
      {location.pathname === '/' && (
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              bgcolor: 'primary.main',
              color: 'primary.contrastText'
            },
          }}
        >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalHospital sx={{ mr: 1 }} />
              Doktor Randevu
            </Typography>
            <Tooltip title="Menüyü kapat" arrow>
              <IconButton onClick={handleDrawerToggle} sx={{ color: 'inherit' }}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Divider sx={{ bgcolor: 'primary.light', mb: 2 }} />
          <List>
            {menuItems.map((item) => (
              <Tooltip key={item.path} title={item.tooltip} arrow placement="left">
                <ListItem
                  component={Link}
                  to={item.path}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: isActive(item.path) ? 'primary.dark' : 'transparent',
                    '&:hover': { bgcolor: 'primary.dark' },
                    color: 'inherit',
                    textDecoration: 'none'
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              </Tooltip>
            ))}
            
            {/* Login Options in Mobile */}
            {!user.isAuthenticated && (
              <>
                <Divider sx={{ my: 2, bgcolor: 'primary.light' }} />
                <Typography variant="subtitle2" sx={{ px: 2, mb: 1, opacity: 0.8 }}>
                  Giriş Yap
                </Typography>
                <Tooltip title="Hasta girişi" arrow placement="left">
                  <ListItem
                    onClick={() => {
                      handleLoginModalOpen('hasta');
                      handleDrawerToggle();
                    }}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': { bgcolor: 'primary.dark' },
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      <Person />
                    </ListItemIcon>
                    <ListItemText primary="Hasta Girişi" />
                  </ListItem>
                </Tooltip>
                <Tooltip title="Doktor girişi" arrow placement="left">
                  <ListItem
                    onClick={() => {
                      handleLoginModalOpen('doktor');
                      handleDrawerToggle();
                    }}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': { bgcolor: 'primary.dark' },
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      <MedicalServices />
                    </ListItemIcon>
                    <ListItemText primary="Doktor Girişi" />
                  </ListItem>
                </Tooltip>
              </>
            )}
            
            {/* User Info in Mobile */}
            {user.isAuthenticated && (
              <>
                <Divider sx={{ my: 2, bgcolor: 'primary.light' }} />
                <Typography variant="subtitle2" sx={{ px: 2, mb: 1, opacity: 0.8 }}>
                  Kullanıcı Bilgileri
                </Typography>
                <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {getUserIcon()}
                  </ListItemIcon>
                  <ListItemText 
                    primary={user.name}
                    secondary={user.userType?.toUpperCase()}
                    secondaryTypographyProps={{ sx: { color: 'primary.light' } }}
                  />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
      )}

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      <Paper 
        component="footer" 
        elevation={3}
        sx={{ 
          mt: 'auto',
          py: 3,
          px: 2,
          bgcolor: 'primary.dark',
          color: 'primary.contrastText'
        }}
      >
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={4}
            justifyContent="space-between"
            alignItems={{ xs: 'center', md: 'flex-start' }}
          >
            {/* Logo ve Açıklama */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Stack direction="row" alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} sx={{ mb: 1 }}>
                <LocalHospital sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" component="div">
                  Medilife Hastanesi
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ maxWidth: 300 }}>
                1995'ten beri güvenilir sağlık hizmetleri sunuyoruz. 
                50+ uzman doktor kadrosu ile 7/24 hastalarımızın hizmetindeyiz.
              </Typography>
            </Box>

            {/* İletişim Bilgileri */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" gutterBottom>
                İletişim Bilgileri
              </Typography>
              <Stack spacing={1}>
                <Tooltip title="Hastane numarasını ara" arrow>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }}>
                    <Phone sx={{ fontSize: 18 }} />
                    <Typography variant="body2">+90 (212) 444 0 999</Typography>
                  </Stack>
                </Tooltip>
                <Tooltip title="E-posta gönder" arrow>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }}>
                    <Email sx={{ fontSize: 18 }} />
                    <Typography variant="body2">bilgi@medilife.com.tr</Typography>
                  </Stack>
                </Tooltip>
                <Tooltip title="Haritada göster" arrow>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }}>
                    <LocationOn sx={{ fontSize: 18 }} />
                    <Typography variant="body2">Levent Mahallesi, Büyükdere Cad. No:123, Beşiktaş/İstanbul</Typography>
                  </Stack>
                </Tooltip>
              </Stack>
            </Box>

            {/* Hizmet Saatleri */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" gutterBottom>
                Hizmet Saatleri
              </Typography>
              <Stack spacing={1}>
                <Tooltip title="7 gün 24 saat acil servis hizmeti" arrow>
                  <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                    <strong>Acil Servis:</strong> 7/24
                  </Typography>
                </Tooltip>
                <Tooltip title="Hafta içi ve hafta sonu poliklinik saatleri" arrow>
                  <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                    <strong>Poliklinik:</strong> 08:00 - 20:00
                  </Typography>
                </Tooltip>
                <Tooltip title="Kan tahlili ve diğer laboratuvar testleri" arrow>
                  <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                    <strong>Laborant:</strong> 07:00 - 22:00
                  </Typography>
                </Tooltip>
                <Tooltip title="Röntgen, MR, CT ve diğer görüntüleme hizmetleri" arrow>
                  <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                    <strong>Radyoloji:</strong> 08:00 - 18:00
                  </Typography>
                </Tooltip>
              </Stack>
            </Box>
          </Stack>

          <Divider sx={{ my: 2, bgcolor: 'primary.light' }} />
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Typography variant="body2" align="center">
              © 2024 Medilife Hastanesi. Tüm hakları saklıdır. | Sağlık Bakanlığı Lisans No: TR-34-001234
            </Typography>
            <Typography variant="body2" align="center">
              React + TypeScript + Material-UI ile geliştirilmiştir.
            </Typography>
          </Stack>
        </Container>
      </Paper>

      {/* Login Modal */}
      <LoginModal
        open={loginModalOpen}
        onClose={handleLoginModalClose}
        userType={selectedUserType}
      />
    </Box>
  );
};

export default Layout; 