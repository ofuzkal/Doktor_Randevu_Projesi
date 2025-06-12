import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Stack,
  Button,
  Alert,
  Chip,
  Tooltip,
  Paper
} from '@mui/material';
import { 
  LocalHospital, 
  PersonAdd, 
  CalendarToday,
  PersonOutline,
  MedicalServices,
  AdminPanelSettings,
  ArrowForward,
  Security,
  Schedule,
  Assignment
} from '@mui/icons-material';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/store';
import { selectUser, setDemoUser, UserType } from '../store/userSlice';
import SampleButton from '../components/SampleButton';
import LoginModal from '../components/LoginModal';

const AnaSayfa: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<UserType>('hasta');

  const handleUserLogin = (userType: UserType) => {
    setSelectedUserType(userType);
    setLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
  };

  const getUserSpecificContent = () => {
    if (!user.isAuthenticated) {
      return null; // Modern giriş ekranı gösterilecek
    }

    switch (user.userType) {
      case 'hasta':
        return (
          <Alert severity="success" sx={{ mb: 3 }}>
            🏥 Hasta paneline hoş geldiniz, {user.name}! Randevu alabilir ve sağlık durumunuzu takip edebilirsiniz.
          </Alert>
        );
      case 'doktor':
        return (
          <Alert severity="info" sx={{ mb: 3 }}>
            👨‍⚕️ Doktor paneline hoş geldiniz, {user.name}! Hasta kayıtlarını görüntüleyebilir ve randevu yönetimi yapabilirsiniz.
          </Alert>
        );
      case 'yonetici':
        return (
          <Alert severity="warning" sx={{ mb: 3 }}>
            ⚙️ Yönetici paneline hoş geldiniz, {user.name}! Sistem yönetimi ve raporlama araçlarına erişiminiz bulunmaktadır.
          </Alert>
        );
      default:
        return null;
    }
  };

  const getRecommendedActions = () => {
    switch (user.userType) {
      case 'hasta':
        return [
          { title: 'Randevu Al', description: 'Yeni bir randevu planla', route: '/doktorlar', color: 'primary' as const },
          { title: 'Geçmiş Randevular', description: 'Önceki randevularını görüntüle', route: '/hastalar', color: 'secondary' as const }
        ];
      case 'doktor':
        return [
          { title: 'Hasta Listesi', description: 'Bugünkü hastalarınızı görün', route: '/hastalar', color: 'success' as const },
          { title: 'Randevu Takviminiz', description: 'Randevu programınızı yönetin', route: '/doktorlar', color: 'info' as const }
        ];
      case 'yonetici':
        return [
          { title: 'Sistem Durumu', description: 'Genel sistem istatistikleri', route: '/yonetici', color: 'warning' as const },
          { title: 'Kullanıcı Yönetimi', description: 'Personel ve hasta hesapları', route: '/yonetici', color: 'error' as const }
        ];
      default:
        return [];
    }
  };

  // Modern Giriş Kartları
  const loginOptions = [
    {
      type: 'hasta' as UserType,
      title: 'Hasta Girişi',
      description: 'Randevu alın ve sağlık durumunuzu takip edin',
      icon: <PersonOutline sx={{ fontSize: 48 }} />,
      color: 'primary',
      features: ['Randevu Alma', 'Sağlık Geçmişi', 'Online Takip'],
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      type: 'doktor' as UserType,
      title: 'Doktor Girişi',
      description: 'Hastalarınızı yönetin ve randevuları kontrol edin',
      icon: <MedicalServices sx={{ fontSize: 48 }} />,
      color: 'success',
      features: ['Hasta Yönetimi', 'Randevu Takvimi', 'Tıbbi Kayıtlar'],
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      type: 'yonetici' as UserType,
      title: 'Yönetici Girişi',
      description: 'Sistem yönetimi ve raporlama araçları',
      icon: <AdminPanelSettings sx={{ fontSize: 48 }} />,
      color: 'warning',
      features: ['Sistem Yönetimi', 'Raporlama', 'Kullanıcı Kontrolü'],
      bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }
  ];

  if (user.isAuthenticated) {
    return <Navigate to="/panel" />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 4, sm: 6 }, mb: 4, px: { xs: 2, sm: 3 } }}>
      {/* Modern Giriş Kartları */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          align="center"
          sx={{ 
            fontSize: { xs: '2rem', sm: '2.5rem' },
            mb: { xs: 4, sm: 5 },
            fontWeight: 700,
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Sisteme Giriş Yapın
        </Typography>
        
                   <Stack 
           direction={{ xs: 'column', sm: 'row' }} 
           spacing={{ xs: 2, sm: 3, md: 4 }} 
           justifyContent="center"
           flexWrap="wrap"
         >
           {loginOptions.map((option, index) => (
             <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }, maxWidth: { xs: '100%', sm: '400px' } }}>
              <Tooltip title={`${option.title} için tıklayın`} arrow>
                <Paper
                  elevation={0}
                  sx={{
                    position: 'relative',
                    height: '100%',
                    minHeight: { xs: 240, sm: 280 },
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: option.bgGradient,
                    borderRadius: 4,
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                      '& .login-icon': {
                        transform: 'rotate(360deg) scale(1.1)'
                      },
                      '& .login-arrow': {
                        transform: 'translateX(10px)'
                      }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      zIndex: 1
                    }
                  }}
                  onClick={() => handleUserLogin(option.type)}
                >
                  <CardContent sx={{ 
                    position: 'relative', 
                    zIndex: 2, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: { xs: 3, sm: 4 },
                    color: 'white'
                  }}>
                    {/* Üst Kısım - İkon ve Başlık */}
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Box 
                        className="login-icon"
                        sx={{ 
                          mb: 2,
                          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        {option.icon}
                      </Box>
                      <Typography 
                        variant="h5" 
                        gutterBottom
                        sx={{ 
                          fontSize: { xs: '1.4rem', sm: '1.5rem' },
                          fontWeight: 700,
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      >
                        {option.title}
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          opacity: 0.9,
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}
                      >
                        {option.description}
                      </Typography>
                    </Box>

                    {/* Özellikler Listesi */}
                    <Box sx={{ mb: 3 }}>
                      {option.features.map((feature, idx) => (
                        <Box 
                          key={idx} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 1,
                            fontSize: { xs: '0.85rem', sm: '0.9rem' }
                          }}
                        >
                          <Box sx={{ 
                            width: 6, 
                            height: 6, 
                            borderRadius: '50%', 
                            bgcolor: 'rgba(255,255,255,0.8)', 
                            mr: 1.5 
                          }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Alt Kısım - Giriş Butonu */}
                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        endIcon={
                          <ArrowForward 
                            className="login-arrow"
                            sx={{ 
                              transition: 'transform 0.3s ease'
                            }} 
                          />
                        }
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: 3,
                          px: 3,
                          py: 1.5,
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontWeight: 600,
                          textTransform: 'none',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.3)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
                          }
                        }}
                      >
                        Giriş Yap
                      </Button>
                    </Box>
                  </CardContent>
                </Paper>
              </Tooltip>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Sistem Özellikleri - Kompakt Tasarım */}
      <Box sx={{ textAlign: 'center', mt: { xs: 4, sm: 5 } }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="center"
          sx={{ 
            flexWrap: 'wrap',
            '& > *': {
              flex: { xs: '1 1 100%', sm: '1 1 30%' },
              textAlign: 'center',
              p: 1.5
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Security sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
            <Typography variant="body1" fontWeight="bold" gutterBottom>Güvenli Altyapı</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
              Modern şifreleme ile korunan veriler
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Schedule sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
            <Typography variant="body1" fontWeight="bold" gutterBottom>7/24 Erişim</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
              Her zaman, her yerden erişim
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Assignment sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
            <Typography variant="body1" fontWeight="bold" gutterBottom>Kolay Yönetim</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
              Kullanıcı dostu arayüz
            </Typography>
          </Box>
        </Stack>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 3, fontSize: '0.8rem' }}>
          React + TypeScript + Material-UI + Redux Toolkit ile geliştirilmiştir.
        </Typography>
      </Box>

      {/* Login Modal */}
      <LoginModal 
        open={loginModalOpen}
        onClose={handleCloseLoginModal}
        userType={selectedUserType}
      />
    </Container>
  );
};

export default AnaSayfa; 