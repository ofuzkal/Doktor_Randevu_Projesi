import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { 
  PersonAdd, 
  Assessment, 
  CalendarToday,
  Visibility,
  Edit,
  Delete,
  Phone,
  Email,
  LocationOn,
  Person,
  Bloodtype,
  Cake,
  MedicalServices,
  Login,
  AppRegistration,
  Logout
} from '@mui/icons-material';
import { useGetHastalarQuery, useGetHastaQuery, Hasta } from '../store/apiSlice';
import { useAppSelector, useAppDispatch } from '../store/store';
import ApiStatus from '../components/ApiStatus';
import HastaAuthForms from '../components/HastaAuthForms';
import DoktorListesi from '../components/DoktorListesi';
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
      id={`hastalar-tabpanel-${index}`}
      aria-labelledby={`hastalar-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Hastalar: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: hastalar, error, isLoading } = useGetHastalarQuery();
  const [selectedHastaId, setSelectedHastaId] = useState<number | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [hastaTabValue, setHastaTabValue] = useState(0);

  // Seçili hasta detayları için ayrı query
  const { data: selectedHasta, isLoading: isLoadingDetail } = useGetHastaQuery(
    selectedHastaId!,
    { skip: !selectedHastaId }
  );

  const handleViewDetails = (hastaId: number) => {
    setSelectedHastaId(hastaId);
    setDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
    setSelectedHastaId(null);
  };

  const handleHastaTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setHastaTabValue(newValue);
  };

  const handleRandevuAl = (doktorId: number, tarih: string, saat: string) => {
    console.log('Randevu alındı:', { doktorId, tarih, saat, hastaId: user.id });
    // TODO: Implement randevu creation logic
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCinsiyetIcon = (cinsiyet?: string) => {
    return cinsiyet === 'Erkek' ? '👨' : '👩';
  };

  const formatPhone = (phone: string) => {
    // Telefon numarasını Türkiye formatına dönüştür
    return `+90 ${phone.replace(/[^\d]/g, '').slice(0, 10)}`;
  };

  // Hasta kullanıcı görünümü - Giriş yapmış
  if (user.userType === 'hasta' && user.isAuthenticated) {
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
            🏥 Hasta Portalı
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Hoş geldiniz, {user.name}! Sağlık hizmetleriniz için doğru adres.
          </Typography>
        </Box>

        {/* Hasta için özel hoş geldin mesajı */}
        <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            👨‍⚕️ Hasta paneline hoş geldiniz!
          </Typography>
          <Typography>
            Doktorlarımızdan randevu alabilir, sağlık durumunuzu takip edebilir ve dijital sağlık hizmetlerimizden yararlanabilirsiniz.
          </Typography>
        </Alert>

        {/* Doktor Listesi */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
              🩺 Doktorlarımız
            </Typography>
            <DoktorListesi onRandevuAl={handleRandevuAl} />
          </CardContent>
        </Card>

        {/* Hizmetlerimiz */}
        <Box>
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
            🎯 Hizmetlerimiz
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Card sx={{ textAlign: 'center', p: 2, flex: 1 }}>
              <CalendarToday sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Online Randevu</Typography>
              <Typography variant="body2" color="textSecondary">
                7/24 online randevu alma imkanı
              </Typography>
            </Card>
            <Card sx={{ textAlign: 'center', p: 2, flex: 1 }}>
              <MedicalServices sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Uzman Doktorlar</Typography>
              <Typography variant="body2" color="textSecondary">
                Alanında uzman doktor kadromuz
              </Typography>
            </Card>
            <Card sx={{ textAlign: 'center', p: 2, flex: 1 }}>
              <Assessment sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Dijital Takip</Typography>
              <Typography variant="body2" color="textSecondary">
                Sağlık geçmişinizi dijital ortamda takip edin
              </Typography>
            </Card>
          </Stack>
        </Box>
      </Container>
    );
  }

  // Giriş yapmamış hasta - Ana sayfaya yönlendir
  if (user.userType === 'hasta' && !user.isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            🔐 Hasta Girişi Gerekli
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Bu sayfayı görüntülemek için önce giriş yapmanız gerekiyor.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => window.location.href = '/'}
            sx={{ py: 1.5, px: 4 }}
          >
            Ana Sayfaya Dön ve Giriş Yap
          </Button>
        </Box>
      </Container>
    );
  }

  // Giriş yapmamış genel kullanıcı görünümü
  if (!user.isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            🏥 Hasta Portalı
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Sağlık hizmetleriniz için doğru adres
          </Typography>
        </Box>

        {/* Giriş gerekli uyarısı */}
        <Alert severity="warning" sx={{ mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            🔐 Giriş Yapmanız Gerekiyor
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Hasta portalına erişmek için önce ana sayfadan hasta girişi yapmanız gerekiyor.
          </Typography>
          <Button 
            variant="contained" 
            size="small"
            onClick={() => window.location.href = '/'}
          >
            Ana Sayfaya Git
          </Button>
        </Alert>

        {/* Hizmetlerimiz */}
        <Box>
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
            🎯 Hizmetlerimiz
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Card sx={{ textAlign: 'center', p: 2, flex: 1 }}>
              <CalendarToday sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Online Randevu</Typography>
              <Typography variant="body2" color="textSecondary">
                7/24 online randevu alma imkanı
              </Typography>
            </Card>
            <Card sx={{ textAlign: 'center', p: 2, flex: 1 }}>
              <MedicalServices sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Uzman Doktorlar</Typography>
              <Typography variant="body2" color="textSecondary">
                Alanında uzman doktor kadromuz
              </Typography>
            </Card>
            <Card sx={{ textAlign: 'center', p: 2, flex: 1 }}>
              <Assessment sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Dijital Takip</Typography>
              <Typography variant="body2" color="textSecondary">
                Sağlık geçmişinizi dijital ortamda takip edin
              </Typography>
            </Card>
          </Stack>
        </Box>
      </Container>
    );
  }



  // Admin/Doktor görünümü (mevcut kod)
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Hasta bilgileri yükleniyor...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Hasta bilgileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* API Status */}
      <ApiStatus />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          👨‍⚕️ Hasta Yönetimi
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Sisteme kayıtlı hasta bilgileri ve randevu geçmişi
        </Typography>
        <Chip 
          label={`Toplam ${hastalar?.length || 0} hasta`} 
          color="primary" 
          sx={{ mt: 1 }} 
        />
      </Box>

      {/* Hasta İstatistikleri */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <PersonAdd sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Kayıtlı Hastalar
            </Typography>
            <Typography variant="h4" color="primary.main">
              {hastalar?.length || 0}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <CalendarToday sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Bu Ay Randevular
            </Typography>
            <Typography variant="h4" color="success.main">
              {hastalar?.length ? hastalar.length * 2 : 0}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Assessment sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Aktif Tedaviler
            </Typography>
            <Typography variant="h4" color="warning.main">
              {hastalar?.length ? Math.floor(hastalar.length / 2) : 0}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Hasta Listesi Tablosu */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Hasta Listesi
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hasta</TableCell>
                  <TableCell>İletişim</TableCell>
                  <TableCell>Bilgiler</TableCell>
                  <TableCell>Şehir</TableCell>
                  <TableCell align="center">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hastalar?.map((hasta) => (
                  <TableRow key={hasta.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {getInitials(hasta.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {hasta.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            TC: {hasta.tcKimlik}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Email sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            {hasta.email}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Phone sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            {formatPhone(hasta.phone)}
                          </Typography>
                        </Stack>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Chip 
                          label={`${getCinsiyetIcon(hasta.cinsiyet)} ${hasta.cinsiyet || 'Belirtilmemiş'}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip 
                          label={`🩸 ${hasta.kanGrubu || 'Bilinmiyor'}`}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                        <Typography variant="caption" color="textSecondary">
                          🎂 {hasta.dogumTarihi || 'Belirtilmemiş'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationOn sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          {hasta.adres || 'Bilinmiyor'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Detayları Görüntüle">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewDetails(hasta.id)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Düzenle">
                          <IconButton size="small" color="warning">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Hasta Detay Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Hasta Detay Bilgileri
          </Typography>
        </DialogTitle>
        <DialogContent>
          {isLoadingDetail ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : selectedHasta ? (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <Person sx={{ mr: 1 }} />
                      Kişisel Bilgiler
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2">Ad Soyad:</Typography>
                        <Typography variant="body1">{selectedHasta.name}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">TC Kimlik:</Typography>
                        <Typography variant="body1">{selectedHasta.tcKimlik}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">E-posta:</Typography>
                        <Typography variant="body1">{selectedHasta.email}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">Cinsiyet:</Typography>
                        <Chip 
                          label={`${getCinsiyetIcon(selectedHasta.cinsiyet)} ${selectedHasta.cinsiyet || 'Belirtilmemiş'}`}
                          size="small"
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">Doğum Tarihi:</Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Cake sx={{ fontSize: 16 }} />
                          <Typography variant="body1">{selectedHasta.dogumTarihi || 'Belirtilmemiş'}</Typography>
                        </Stack>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">Kan Grubu:</Typography>
                        <Chip 
                          label={`🩸 ${selectedHasta.kanGrubu || 'Bilinmiyor'}`}
                          size="small"
                          color="error"
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
                              </Box>

                <Box sx={{ flex: 1 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <Phone sx={{ mr: 1 }} />
                      İletişim Bilgileri
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2">E-posta:</Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Email sx={{ fontSize: 16 }} />
                          <Typography variant="body1">{selectedHasta.email}</Typography>
                        </Stack>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">Telefon:</Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Phone sx={{ fontSize: 16 }} />
                          <Typography variant="body1">{formatPhone(selectedHasta.phone)}</Typography>
                        </Stack>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">Kayıt Tarihi:</Typography>
                        <Typography variant="body1">{new Date(selectedHasta.createdAt).toLocaleDateString('tr-TR')}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">Hasta Notları:</Typography>
                        <Typography variant="body1">{selectedHasta.hastaNotlari || 'Not bulunmamaktadır'}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <LocationOn sx={{ mr: 1 }} />
                      Adres Bilgileri
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={1}>
                      <Typography variant="body1">
                        {selectedHasta.adres || 'Adres belirtilmemiş'}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
                              </Box>
              </Stack>
          ) : (
            <Alert severity="error">
              Hasta bilgileri yüklenemedi.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Hastalar; 