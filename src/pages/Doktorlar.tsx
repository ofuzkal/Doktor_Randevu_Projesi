import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Stack,
  Chip,
  Tabs,
  Tab,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  MedicalServices, 
  Schedule, 
  LocalPharmacy,
  CalendarToday,
  Assignment,
  Settings,
  Logout
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/store';
import DoktorProgram from '../components/DoktorProgram';
import RandevuIstekleri from '../components/RandevuIstekleri';
import MusaitlikForm from '../components/MusaitlikForm';
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
      id={`doktor-tabpanel-${index}`}
      aria-labelledby={`doktor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Doktorlar: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [doktorTabValue, setDoktorTabValue] = useState(0);

  const handleDoktorTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setDoktorTabValue(newValue);
  };

  // Doktor kullanıcı görünümü
  if (user.userType === 'doktor') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            👨‍⚕️ Doktor Paneli
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Hoş geldiniz Dr. {user.name} - Randevu ve program yönetimi
          </Typography>
        </Box>

        {/* Doktor Sekmeleri */}
        <Card sx={{ mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={doktorTabValue} 
              onChange={handleDoktorTabChange} 
              variant="fullWidth"
              aria-label="doktor panel tabs"
            >
              <Tab 
                icon={<Schedule />} 
                label="Çalışma Programım" 
                iconPosition="start"
              />
              <Tab 
                icon={<Assignment />} 
                label="Randevu İstekleri" 
                iconPosition="start"
              />
              <Tab 
                icon={<CalendarToday />} 
                label="Müsaitlik Yönetimi" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={doktorTabValue} index={0}>
            <Stack spacing={4}>
              {/* Hoş Geldin Mesajı */}
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  👋 Merhaba Dr. {user.name}!
                </Typography>
                <Typography>
                  Haftalık çalışma programınızı görüntüleyebilir ve düzenleyebilirsiniz. 
                  Her günün çalışma saatleri, mola süreleri ve maksimum randevu sayılarını ayarlayabilirsiniz.
                </Typography>
              </Alert>

              {/* Doktor Programı */}
              <DoktorProgram />
            </Stack>
          </TabPanel>

          <TabPanel value={doktorTabValue} index={1}>
            <Stack spacing={4}>
              {/* Randevu İstekleri Bilgilendirme */}
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  📋 Randevu İstekleri Yönetimi
                </Typography>
                <Typography>
                  Hastalardan gelen randevu isteklerini inceleyebilir, onaylayabilir veya reddedebilirsiniz.
                  Her istek için hasta bilgileri, şikayet detayları ve aciliyet durumunu görebilirsiniz.
                </Typography>
              </Alert>

              {/* Randevu İstekleri */}
              <RandevuIstekleri />
            </Stack>
          </TabPanel>

          <TabPanel value={doktorTabValue} index={2}>
            <Stack spacing={4}>
              {/* Müsaitlik Yönetimi Bilgilendirme */}
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  📅 Özel Müsaitlik Yönetimi
                </Typography>
                <Typography>
                  Normal çalışma programınızın dışında özel günler ekleyebilirsiniz. 
                  Ekstra mesai günleri veya izin günleri belirleyerek randevu sisteminizi özelleştirebilirsiniz.
                </Typography>
              </Alert>

              {/* Müsaitlik Formu */}
              <MusaitlikForm />
            </Stack>
          </TabPanel>
        </Card>

        {/* Hızlı Özet */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Schedule sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                5 Çalışma Günü
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Bu hafta aktif
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Assignment sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                3 Bekleyen İstek
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Onay bekliyor
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <CalendarToday sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                37 Randevu
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Bu hafta toplam
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    );
  }

  // Admin/Yönetici görünümü (mevcut kod)
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🩺 Doktor Yönetimi
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Doktor bilgileri, uzmanlık alanları ve çalışma programları
        </Typography>
      </Box>

      <Stack spacing={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <MedicalServices sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Doktor Listesi
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Sistemdeki tüm doktorları görüntüleyin ve düzenleyin
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              <Chip label="Kardiyolog: 5" color="primary" variant="outlined" />
              <Chip label="Nöroloji: 3" color="secondary" variant="outlined" />
              <Chip label="Ortopedi: 4" color="success" variant="outlined" />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Schedule sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Çalışma Programları
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Doktor mesai saatleri ve müsaitlik durumları
            </Typography>
            <Chip 
              label="Aktif Doktorlar: 12" 
              color="success" 
              variant="outlined" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <LocalPharmacy sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Uzmanlık Alanları
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Doktor uzmanlık dalları ve sertifikaları
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
              <Chip label="Kardiyoloji" color="error" variant="outlined" />
              <Chip label="Nöroloji" color="primary" variant="outlined" />
              <Chip label="Ortopedi" color="success" variant="outlined" />
              <Chip label="Göz Hastalıkları" color="info" variant="outlined" />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default Doktorlar; 