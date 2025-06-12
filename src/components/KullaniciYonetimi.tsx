import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Tooltip,
  Avatar,
  Tabs,
  Tab
} from '@mui/material';
import {
  Delete,
  Edit,
  PersonAdd,
  MedicalServices,
  LocalHospital,
  Phone,
  Email
} from '@mui/icons-material';

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
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

// Tip tanımlamaları
interface Doktor {
  id: number;
  ad: string;
  email: string;
  telefon: string;
  uzmanlik: string;
  hastane: string;
  durum: string;
  kayitTarihi: string;
}

interface Hasta {
  id: number;
  ad: string;
  email: string;
  telefon: string;
  tcKimlik: string;
  dogumTarihi: string;
  durum: string;
  kayitTarihi: string;
}

// Dummy veriler
const initialDoktorlar: Doktor[] = [
  {
    id: 1,
    ad: 'Dr. Fatma Şahin',
    email: 'fatma.sahin@hastane.com',
    telefon: '+90 212 555 0101',
    uzmanlik: 'Kardiyoloji',
    hastane: 'Acıbadem Hastanesi',
    durum: 'Aktif',
    kayitTarihi: '2023-01-15'
  },
  {
    id: 2,
    ad: 'Dr. Mehmet Kaya',
    email: 'mehmet.kaya@hastane.com',
    telefon: '+90 212 555 0102',
    uzmanlik: 'Nöroloji',
    hastane: 'Memorial Hastanesi',
    durum: 'Aktif',
    kayitTarihi: '2023-03-20'
  },
  {
    id: 3,
    ad: 'Dr. Ayşe Yılmaz',
    email: 'ayse.yilmaz@hastane.com',
    telefon: '+90 212 555 0103',
    uzmanlik: 'Ortopedi',
    hastane: 'Florence Nightingale',
    durum: 'İzinli',
    kayitTarihi: '2023-02-10'
  }
];

const initialHastalar: Hasta[] = [
  {
    id: 1,
    ad: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@email.com',
    telefon: '+90 532 111 2233',
    tcKimlik: '12345678901',
    dogumTarihi: '1978-05-15',
    durum: 'Aktif',
    kayitTarihi: '2024-01-10'
  },
  {
    id: 2,
    ad: 'Zeynep Kaya',
    email: 'zeynep.kaya@email.com',
    telefon: '+90 555 444 6677',
    tcKimlik: '98765432101',
    dogumTarihi: '1991-08-22',
    durum: 'Aktif',
    kayitTarihi: '2024-02-05'
  },
  {
    id: 3,
    ad: 'Mehmet Demir',
    email: 'mehmet.demir@email.com',
    telefon: '+90 543 222 8899',
    tcKimlik: '55566677788',
    dogumTarihi: '1965-12-03',
    durum: 'Pasif',
    kayitTarihi: '2023-11-20'
  }
];

const KullaniciYonetimi: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [doktorlar, setDoktorlar] = useState<Doktor[]>(initialDoktorlar);
  const [hastalar, setHastalar] = useState<Hasta[]>(initialHastalar);
  const [eklemeDialog, setEklemeDialog] = useState(false);
  const [silmeDialog, setSilmeDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<(Doktor | Hasta) & { tip: string } | null>(null);
  const [formData, setFormData] = useState({
    tip: 'hasta',
    ad: '',
    email: '',
    telefon: '',
    uzmanlik: '',
    hastane: '',
    tcKimlik: '',
    dogumTarihi: ''
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleKullaniciEkle = () => {
    setFormData({
      tip: tabValue === 0 ? 'hasta' : 'doktor',
      ad: '',
      email: '',
      telefon: '',
      uzmanlik: '',
      hastane: '',
      tcKimlik: '',
      dogumTarihi: ''
    });
    setEklemeDialog(true);
  };

  const handleKullaniciSil = (user: Doktor | Hasta, tip: string) => {
    setSelectedUser({ ...user, tip });
    setSilmeDialog(true);
  };

  const handleEklemeOnayla = () => {
    if (formData.tip === 'doktor') {
      const yeniDoktor: Doktor = {
        id: Date.now(),
        ad: formData.ad,
        email: formData.email,
        telefon: formData.telefon,
        uzmanlik: formData.uzmanlik,
        hastane: formData.hastane,
        durum: 'Aktif',
        kayitTarihi: new Date().toISOString().split('T')[0]
      };
      setDoktorlar([...doktorlar, yeniDoktor]);
    } else {
      const yeniHasta: Hasta = {
        id: Date.now(),
        ad: formData.ad,
        email: formData.email,
        telefon: formData.telefon,
        tcKimlik: formData.tcKimlik,
        dogumTarihi: formData.dogumTarihi,
        durum: 'Aktif',
        kayitTarihi: new Date().toISOString().split('T')[0]
      };
      setHastalar([...hastalar, yeniHasta]);
    }

    setEklemeDialog(false);
  };

  const handleSilmeOnayla = () => {
    if (!selectedUser) return;
    
    if (selectedUser.tip === 'doktor') {
      setDoktorlar(doktorlar.filter(d => d.id !== selectedUser.id));
    } else {
      setHastalar(hastalar.filter(h => h.id !== selectedUser.id));
    }
    setSilmeDialog(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDurumColor = (durum: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (durum) {
      case 'Aktif': return 'success';
      case 'İzinli': return 'warning';
      case 'Pasif': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              👥 Kullanıcı Yönetimi
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Sistem kullanıcılarını görüntüleyin ve yönetin
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleKullaniciEkle}
          >
            Kullanıcı Ekle
          </Button>
        </Stack>

        {/* İstatistikler */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Chip 
            label={`${doktorlar.length} Doktor`} 
            color="primary" 
            icon={<MedicalServices />}
          />
          <Chip 
            label={`${hastalar.length} Hasta`} 
            color="info" 
            icon={<LocalHospital />}
          />
          <Chip 
            label={`${doktorlar.filter(d => d.durum === 'Aktif').length + hastalar.filter(h => h.durum === 'Aktif').length} Aktif`} 
            color="success" 
          />
        </Stack>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`Hastalar (${hastalar.length})`} />
            <Tab label={`Doktorlar (${doktorlar.length})`} />
          </Tabs>
        </Box>

        {/* Hasta Listesi */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Hasta</strong></TableCell>
                  <TableCell><strong>İletişim</strong></TableCell>
                  <TableCell><strong>TC Kimlik</strong></TableCell>
                  <TableCell><strong>Durum</strong></TableCell>
                  <TableCell><strong>Kayıt Tarihi</strong></TableCell>
                  <TableCell align="center"><strong>İşlemler</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hastalar.map((hasta) => (
                  <TableRow key={hasta.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: 'info.main' }}>
                          {getInitials(hasta.ad)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {hasta.ad}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ID: {hasta.id}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Email sx={{ fontSize: 16 }} />
                          <Typography variant="body2">{hasta.email}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Phone sx={{ fontSize: 16 }} />
                          <Typography variant="body2">{hasta.telefon}</Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{hasta.tcKimlik}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={hasta.durum}
                        color={getDurumColor(hasta.durum)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(hasta.kayitTarihi).toLocaleDateString('tr-TR')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Düzenle">
                          <IconButton size="small" color="primary">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleKullaniciSil(hasta, 'hasta')}
                          >
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
        </TabPanel>

        {/* Doktor Listesi */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Doktor</strong></TableCell>
                  <TableCell><strong>İletişim</strong></TableCell>
                  <TableCell><strong>Uzmanlık</strong></TableCell>
                  <TableCell><strong>Hastane</strong></TableCell>
                  <TableCell><strong>Durum</strong></TableCell>
                  <TableCell align="center"><strong>İşlemler</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doktorlar.map((doktor) => (
                  <TableRow key={doktor.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {getInitials(doktor.ad)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {doktor.ad}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ID: {doktor.id}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Email sx={{ fontSize: 16 }} />
                          <Typography variant="body2">{doktor.email}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Phone sx={{ fontSize: 16 }} />
                          <Typography variant="body2">{doktor.telefon}</Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={doktor.uzmanlik}
                        color="secondary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{doktor.hastane}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={doktor.durum}
                        color={getDurumColor(doktor.durum)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Düzenle">
                          <IconButton size="small" color="primary">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleKullaniciSil(doktor, 'doktor')}
                          >
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
        </TabPanel>
      </CardContent>

      {/* Kullanıcı Ekleme Dialog */}
      <Dialog open={eklemeDialog} onClose={() => setEklemeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          👤 Yeni {formData.tip === 'doktor' ? 'Doktor' : 'Hasta'} Ekle
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Kullanıcı Tipi</InputLabel>
              <Select
                value={formData.tip}
                label="Kullanıcı Tipi"
                onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
              >
                <MenuItem value="hasta">Hasta</MenuItem>
                <MenuItem value="doktor">Doktor</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Ad Soyad"
              value={formData.ad}
              onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
              required
            />

            <TextField
              fullWidth
              label="E-posta"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <TextField
              fullWidth
              label="Telefon"
              value={formData.telefon}
              onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
              required
            />

            {formData.tip === 'doktor' ? (
              <>
                <TextField
                  fullWidth
                  label="Uzmanlık Alanı"
                  value={formData.uzmanlik}
                  onChange={(e) => setFormData({ ...formData, uzmanlik: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="Hastane"
                  value={formData.hastane}
                  onChange={(e) => setFormData({ ...formData, hastane: e.target.value })}
                  required
                />
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="TC Kimlik No"
                  value={formData.tcKimlik}
                  onChange={(e) => setFormData({ ...formData, tcKimlik: e.target.value })}
                  inputProps={{ maxLength: 11 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Doğum Tarihi"
                  type="date"
                  value={formData.dogumTarihi}
                  onChange={(e) => setFormData({ ...formData, dogumTarihi: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEklemeDialog(false)}>İptal</Button>
          <Button 
            variant="contained" 
            onClick={handleEklemeOnayla}
            disabled={!formData.ad || !formData.email || !formData.telefon}
          >
            Ekle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Silme Onay Dialog */}
      <Dialog open={silmeDialog} onClose={() => setSilmeDialog(false)}>
        <DialogTitle>⚠️ Kullanıcı Silme Onayı</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Alert severity="warning">
              <Typography variant="subtitle2" gutterBottom>
                {selectedUser.ad} isimli {selectedUser.tip}ı silmek istediğinize emin misiniz?
              </Typography>
              <Typography variant="body2">
                Bu işlem geri alınamaz. Kullanıcının tüm randevu geçmişi de silinecektir.
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSilmeDialog(false)}>İptal</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleSilmeOnayla}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default KullaniciYonetimi; 