import React, { useState } from 'react';
import { useAppSelector } from '../store/store';
import { Navigate } from 'react-router-dom';
import { Box, Tabs, Tab, Typography, Stack, Paper, Button, Alert, Card, CardContent } from '@mui/material';
import { CalendarToday, PersonAdd, MedicalServices } from '@mui/icons-material';
import RandevuModal from '../components/RandevuModal';
import RandevuTablosu from '../components/RandevuTablosu';
import RandevuIstekleri from '../components/RandevuIstekleri';
import DoktorProgram from '../components/DoktorProgram';
import KullaniciYonetimi from '../components/KullaniciYonetimi';
import RaporlamaGrafigi from '../components/RaporlamaGrafigi';
import DoktorListesi from '../components/DoktorListesi';

const Panel: React.FC = () => {
  const user = useAppSelector(state => state.user);
  const [tab, setTab] = useState(0);
  const [randevuModalOpen, setRandevuModalOpen] = useState(false);

  if (!user.isAuthenticated) return <Navigate to="/" />;

  // Randevu Al Tab İçeriği
  const RandevuAlContent = () => (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 2 }}>
      {/* Hoş Geldin Mesajı */}
      <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          👨‍⚕️ Hoş geldiniz, {user.name}!
        </Typography>
        <Typography>
          Doktorlarımızdan randevu alabilir, sağlık durumunuzu takip edebilir ve dijital sağlık hizmetlerimizden yararlanabilirsiniz.
        </Typography>
      </Alert>

      {/* Hızlı İşlemler */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
          🎯 Hızlı İşlemler
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Card sx={{ textAlign: 'center', p: 2, flex: 1, cursor: 'pointer' }} 
                onClick={() => setRandevuModalOpen(true)}>
            <CalendarToday sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Hızlı Randevu</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Hemen randevu almak için tıklayın
            </Typography>
            <Button variant="contained" size="small">
              Randevu Al
            </Button>
          </Card>
          <Card sx={{ textAlign: 'center', p: 2, flex: 1 }}>
            <MedicalServices sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Sağlık Geçmişi</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Geçmiş randevularınızı görüntüleyin
            </Typography>
            <Button variant="outlined" size="small" onClick={() => setTab(1)}>
              Görüntüle
            </Button>
          </Card>
          <Card sx={{ textAlign: 'center', p: 2, flex: 1 }}>
            <PersonAdd sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Profil Ayarları</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Profil bilgilerinizi güncelleyin
            </Typography>
            <Button variant="outlined" size="small" onClick={() => setTab(2)}>
              Düzenle
            </Button>
          </Card>
        </Stack>
      </Box>

      {/* Doktor Listesi */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
            🩺 Doktorlarımız
          </Typography>
          <DoktorListesi onRandevuAl={(doktorId, tarih, saat) => {
            console.log('Randevu alındı:', { doktorId, tarih, saat, hastaId: user.id });
            // TODO: Implement randevu creation logic
          }} />
        </CardContent>
      </Card>
    </Box>
  );

  let tabs: { label: string; content: React.ReactNode }[] = [];

  if (user.userType === 'hasta') {
    tabs = [
      { label: 'Randevu Al', content: <RandevuAlContent /> },
      { label: 'Geçmiş Randevular', content: <RandevuTablosu /> },
      { label: 'Profil', content: <Paper sx={{ p: 3 }}><Typography variant="h6">Ad Soyad: {user.name}</Typography><Typography>E-posta: {user.email}</Typography></Paper> }
    ];
  } else if (user.userType === 'doktor') {
    tabs = [
      { label: 'Randevu İstekleri', content: <RandevuIstekleri /> },
      { label: 'Çalışma Programı', content: <DoktorProgram /> },
      { label: 'Profil', content: <Paper sx={{ p: 3 }}><Typography variant="h6">Ad Soyad: {user.name}</Typography><Typography>E-posta: {user.email}</Typography></Paper> }
    ];
  } else if (user.userType === 'yonetici') {
    tabs = [
      { label: 'Kullanıcı Yönetimi', content: <KullaniciYonetimi /> },
      { label: 'Raporlama', content: <RaporlamaGrafigi /> },
      { label: 'Profil', content: <Paper sx={{ p: 3 }}><Typography variant="h6">Ad Soyad: {user.name}</Typography><Typography>E-posta: {user.email}</Typography></Paper> }
    ];
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {user.userType === 'hasta' && 'Hasta Paneli'}
        {user.userType === 'doktor' && 'Doktor Paneli'}
        {user.userType === 'yonetici' && 'Yönetici Paneli'}
      </Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
        {tabs.map((t, i) => <Tab key={i} label={t.label} />)}
      </Tabs>
      <Box>
        {tabs[tab]?.content}
      </Box>

      {/* Randevu Modal - Sadece istendiğinde açılır */}
      <RandevuModal 
        open={randevuModalOpen} 
        onClose={() => setRandevuModalOpen(false)} 
      />
    </Box>
  );
};

export default Panel; 