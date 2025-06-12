import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Stack,
  Chip,
  Paper,
  Tabs,
  Tab,
  Alert,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Dashboard, 
  Analytics, 
  Settings,
  Security,
  People,
  CalendarToday,
  BarChart,
  SupervisorAccount,
  Logout
} from '@mui/icons-material';
import KullaniciYonetimi from '../components/KullaniciYonetimi';
import RandevuTablosu from '../components/RandevuTablosu';
import RaporlamaGrafigi from '../components/RaporlamaGrafigi';
import { logoutUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Yonetici: React.FC = () => {
  const userType = useSelector((state: RootState) => state.user.userType);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Eğer kullanıcı yönetici değilse, erişim reddi göster
  if (userType !== 'yonetici') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            🚫 Erişim Reddedildi
          </Typography>
          <Typography variant="body1">
            Bu sayfaya erişim için yönetici yetkisine sahip olmanız gerekmektedir.
          </Typography>
        </Alert>
        
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Security sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Yetkisiz Erişim
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Lütfen sistem yöneticisi ile iletişime geçiniz.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Tooltip title="Çıkış Yap" arrow>
          <IconButton
            size="small"
            color="error"
            onClick={() => { dispatch(logoutUser()); navigate('/'); }}
            sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: 1 }}
          >
            <Logout fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          ⚙️ Yönetici Paneli
        </Typography>
        <Typography 
          variant="h6" 
          color="textSecondary"
          sx={{ 
            fontSize: { xs: '1rem', sm: '1.25rem' },
            textAlign: { xs: 'center', sm: 'left' },
            px: { xs: 1, sm: 0 }
          }}
        >
          Sistem yönetimi, kullanıcı kontrolü ve analitik raporlar
        </Typography>
      </Box>

      {/* Ana İstatistik Kartları */}
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={{ xs: 2, md: 3 }} 
        sx={{ mb: { xs: 3, sm: 4 } }}
      >
        <Tooltip title="Sistemde aktif kullanıcı sayısını görüntüleyin" arrow>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <People sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Toplam Kullanıcılar
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Sistemdeki tüm kullanıcılar
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                <Chip label="1,247 Hasta" color="primary" size="small" />
                <Chip label="89 Doktor" color="success" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Tooltip>

        <Tooltip title="Bugünkü randevu aktivitelerini izleyin" arrow>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Analytics sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Bugünkü Randevular
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Günlük randevu aktivitesi
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                <Chip label="28 Randevu" color="info" size="small" />
                <Chip label="5 Bekliyor" color="warning" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Tooltip>
      </Stack>

      {/* Navigasyon Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ px: 2 }}
          >
            <Tooltip title="Kullanıcı hesaplarını yönetin" arrow>
              <Tab 
                label="Kullanıcı Yönetimi" 
                icon={<SupervisorAccount />}
                iconPosition="start"
              />
            </Tooltip>
            <Tooltip title="Randevu listesi ve durumlarını görüntüleyin" arrow>
              <Tab 
                label="Randevu Tablosu" 
                icon={<CalendarToday />}
                iconPosition="start"
              />
            </Tooltip>
            <Tooltip title="Sistem raporları ve istatistikleri" arrow>
              <Tab 
                label="Raporlama" 
                icon={<BarChart />}
                iconPosition="start"
              />
            </Tooltip>
          </Tabs>
        </Box>
      </Card>

      {/* Tab İçerikleri */}
      <TabPanel value={tabValue} index={0}>
        <KullaniciYonetimi />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <RandevuTablosu />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <RaporlamaGrafigi />
      </TabPanel>

      {/* Sistem Ayarları ve Güvenlik Kartları */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 4 }}>
        <Tooltip title="Sistem konfigürasyonlarını ve tercihlerini düzenleyin" arrow>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Settings sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Sistem Ayarları
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Genel sistem konfigürasyonları ve tercihler
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                <Chip label="Bakım Modu: Kapalı" color="success" variant="outlined" size="small" />
                <Chip label="Yedekleme: Aktif" color="info" variant="outlined" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Tooltip>

        <Tooltip title="Sistem güvenliği ve erişim kontrolü ayarları" arrow>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Security sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Güvenlik
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Sistem güvenliği ve erişim kontrolü
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                <Chip label="SSL: Aktif" color="success" variant="outlined" size="small" />
                <Chip label="2FA: Zorunlu" color="warning" variant="outlined" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Tooltip>
      </Stack>

      {/* Bilgilendirme */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h6" gutterBottom>
          🛡️ Yönetici Panel Bilgileri
        </Typography>
        <Typography variant="body2">
          Bu panel sadece yönetici yetkisine sahip kullanıcılar tarafından erişilebilir. 
          Tüm işlemler güvenlik protokolleri kapsamında kayıt altına alınmaktadır. 
          Sistem verileri gerçek zamanlı olarak güncellenmektedir.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Yonetici; 