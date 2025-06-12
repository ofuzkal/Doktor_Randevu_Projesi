import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Stack,
  Chip,
  Rating,
  Box,
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
  Divider,
  IconButton
} from '@mui/material';
import {
  MedicalServices,
  CalendarToday,
  LocationOn,
  AccessTime,
  Phone,
  Email,
  School,
  Close
} from '@mui/icons-material';

// Dummy doktor verisi
const doktorlar = [
  {
    id: 1,
    ad: 'Dr. Fatma Şahin',
    uzmanlik: 'Kardiyoloji',
    hastane: 'Acıbadem Hastanesi',
    deneyim: 15,
    rating: 4.8,
    reviewCount: 142,
    avatar: 'FS',
    musaitlik: ['09:00', '11:00', '14:00', '16:00'],
    telefon: '+90 212 555 0101',
    email: 'dr.fatma.sahin@hastane.com',
    egitim: 'İstanbul Üniversitesi Tıp Fakültesi',
    lokasyon: 'Beşiktaş, İstanbul',
    randevuUcreti: 250,
    hakkinda: 'Kardiyoloji alanında 15 yıllık deneyime sahip uzman doktor. Kalp hastalıkları, hipertansiyon ve ritim bozuklukları konularında uzman.'
  },
  {
    id: 2,
    ad: 'Dr. Mehmet Kaya',
    uzmanlik: 'Nöroloji',
    hastane: 'Memorial Hastanesi',
    deneyim: 12,
    rating: 4.6,
    reviewCount: 98,
    avatar: 'MK',
    musaitlik: ['10:00', '13:00', '15:00'],
    telefon: '+90 212 555 0102',
    email: 'dr.mehmet.kaya@hastane.com',
    egitim: 'Hacettepe Üniversitesi Tıp Fakültesi',
    lokasyon: 'Şişli, İstanbul',
    randevuUcreti: 300,
    hakkinda: 'Nöroloji uzmanı. Migran, epilepsi, Parkinson ve Alzheimer hastalıkları konularında deneyimli.'
  },
  {
    id: 3,
    ad: 'Dr. Ayşe Yılmaz',
    uzmanlik: 'Ortopedi',
    hastane: 'Florence Nightingale Hastanesi',
    deneyim: 10,
    rating: 4.9,
    reviewCount: 156,
    avatar: 'AY',
    musaitlik: ['08:00', '10:00', '14:00', '17:00'],
    telefon: '+90 212 555 0103',
    email: 'dr.ayse.yilmaz@hastane.com',
    egitim: 'Marmara Üniversitesi Tıp Fakültesi',
    lokasyon: 'Gayrettepe, İstanbul',
    randevuUcreti: 280,
    hakkinda: 'Ortopedi ve travmatoloji uzmanı. Eklem hastalıkları, spor yaralanmaları ve kemik kırıkları konularında uzman.'
  },
  {
    id: 4,
    ad: 'Dr. Can Özkan',
    uzmanlik: 'Göz Hastalıkları',
    hastane: 'Anadolu Medical Center',
    deneyim: 8,
    rating: 4.7,
    reviewCount: 89,
    avatar: 'CO',
    musaitlik: ['09:30', '11:30', '15:30'],
    telefon: '+90 216 555 0104',
    email: 'dr.can.ozkan@hastane.com',
    egitim: 'Gazi Üniversitesi Tıp Fakültesi',
    lokasyon: 'Kozyatağı, İstanbul',
    randevuUcreti: 200,
    hakkinda: 'Göz hastalıkları uzmanı. Katarakt, glokom, retina hastalıkları ve refraktif cerrahi konularında deneyimli.'
  }
];

interface DoktorListesiProps {
  onRandevuAl?: (doktorId: number, tarih: string, saat: string) => void;
}

const DoktorListesi: React.FC<DoktorListesiProps> = ({ onRandevuAl }) => {
  const [selectedDoktor, setSelectedDoktor] = useState<typeof doktorlar[0] | null>(null);
  const [randevuDialog, setRandevuDialog] = useState(false);
  const [detayDialog, setDetayDialog] = useState(false);
  const [randevuData, setRandevuData] = useState({
    tarih: '',
    saat: '',
    notlar: ''
  });

  const handleDetayAc = (doktor: typeof doktorlar[0]) => {
    setSelectedDoktor(doktor);
    setDetayDialog(true);
  };

  const handleRandevuAc = (doktor: typeof doktorlar[0]) => {
    setSelectedDoktor(doktor);
    setRandevuDialog(true);
    setRandevuData({ tarih: '', saat: '', notlar: '' });
  };

  const handleRandevuOnayla = () => {
    if (selectedDoktor && randevuData.tarih && randevuData.saat) {
      onRandevuAl?.(selectedDoktor.id, randevuData.tarih, randevuData.saat);
      setRandevuDialog(false);
      alert(`${selectedDoktor.ad} ile ${randevuData.tarih} tarihinde ${randevuData.saat} saatinde randevunuz oluşturuldu!`);
    }
  };

  const getUzmanlikRenk = (uzmanlik: string) => {
    const renkler: { [key: string]: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' } = {
      'Kardiyoloji': 'error',
      'Nöroloji': 'primary',
      'Ortopedi': 'success',
      'Göz Hastalıkları': 'info'
    };
    return renkler[uzmanlik] || 'default';
  };

  return (
    <>
      <Stack 
        spacing={{ xs: 2, sm: 3 }} 
        direction={{ xs: 'column', lg: 'row' }} 
        flexWrap="wrap" 
        useFlexGap
      >
        {doktorlar.map((doktor) => (
          <Box key={doktor.id} sx={{ flex: { xs: '1 1 100%', lg: '1 1 48%' } }}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}>
              <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                {/* Doktor Başlık Bilgileri */}
                <Stack 
                  direction="row" 
                  spacing={{ xs: 1.5, sm: 2 }} 
                  alignItems="center" 
                  sx={{ mb: { xs: 1.5, sm: 2 } }}
                >
                  <Avatar 
                    sx={{ 
                      width: { xs: 50, sm: 60 }, 
                      height: { xs: 50, sm: 60 }, 
                      bgcolor: getUzmanlikRenk(doktor.uzmanlik) + '.main',
                      fontSize: { xs: '1rem', sm: '1.2rem' },
                      fontWeight: 'bold'
                    }}
                  >
                    {doktor.avatar}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold"
                      sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                    >
                      {doktor.ad}
                    </Typography>
                    <Chip 
                      label={doktor.uzmanlik}
                      color={getUzmanlikRenk(doktor.uzmanlik)}
                      size="small"
                      icon={<MedicalServices />}
                      sx={{ 
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        height: { xs: 24, sm: 32 }
                      }}
                    />
                  </Box>
                </Stack>

                {/* Hastane ve Lokasyon */}
                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {doktor.hastane} - {doktor.lokasyon}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <School sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {doktor.deneyim} yıl deneyim
                    </Typography>
                  </Stack>
                </Stack>

                {/* Rating ve Ücret */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Rating value={doktor.rating} readOnly precision={0.1} size="small" />
                      <Typography variant="body2" color="text.secondary">
                        {doktor.rating} ({doktor.reviewCount} değerlendirme)
                      </Typography>
                    </Stack>
                  </Box>
                  <Chip 
                    label={`${doktor.randevuUcreti} ₺`} 
                    color="warning" 
                    variant="outlined"
                    size="small"
                  />
                </Stack>

                {/* Müsaitlik */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                    Müsait Saatler:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {doktor.musaitlik.map((saat) => (
                      <Chip 
                        key={saat}
                        label={saat} 
                        size="small" 
                        variant="outlined"
                        color="success"
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Hakkında */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {doktor.hakkinda.slice(0, 100)}...
                </Typography>

                {/* Aksiyonlar */}
                <Stack direction="row" spacing={1} justifyContent="space-between">
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => handleDetayAc(doktor)}
                  >
                    Detayları Gör
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small"
                    startIcon={<CalendarToday />}
                    onClick={() => handleRandevuAc(doktor)}
                    color={getUzmanlikRenk(doktor.uzmanlik)}
                  >
                    Randevu Al
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Stack>

      {/* Doktor Detay Dialog */}
      <Dialog 
        open={detayDialog} 
        onClose={() => setDetayDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Doktor Detayları</Typography>
            <IconButton onClick={() => setDetayDialog(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedDoktor && (
            <Stack spacing={3}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: getUzmanlikRenk(selectedDoktor.uzmanlik) + '.main',
                    fontSize: '1.5rem'
                  }}
                >
                  {selectedDoktor.avatar}
                </Avatar>
                <Box>
                  <Typography variant="h5">{selectedDoktor.ad}</Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {selectedDoktor.uzmanlik}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Rating value={selectedDoktor.rating} readOnly precision={0.1} />
                    <Typography variant="body2">
                      {selectedDoktor.rating} ({selectedDoktor.reviewCount} değerlendirme)
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <Divider />

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>İletişim</Typography>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Phone sx={{ fontSize: 16 }} />
                      <Typography>{selectedDoktor.telefon}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Email sx={{ fontSize: 16 }} />
                      <Typography>{selectedDoktor.email}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocationOn sx={{ fontSize: 16 }} />
                      <Typography>{selectedDoktor.hastane}</Typography>
                    </Stack>
                  </Stack>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>Profesyonel Bilgiler</Typography>
                  <Stack spacing={1}>
                    <Typography><strong>Eğitim:</strong> {selectedDoktor.egitim}</Typography>
                    <Typography><strong>Deneyim:</strong> {selectedDoktor.deneyim} yıl</Typography>
                    <Typography><strong>Randevu Ücreti:</strong> {selectedDoktor.randevuUcreti} ₺</Typography>
                  </Stack>
                </Box>
              </Stack>

              <Box>
                <Typography variant="h6" gutterBottom>Hakkında</Typography>
                <Typography>{selectedDoktor.hakkinda}</Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* Randevu Al Dialog */}
      <Dialog 
        open={randevuDialog} 
        onClose={() => setRandevuDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Randevu Al</Typography>
            <IconButton onClick={() => setRandevuDialog(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedDoktor && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Alert severity="info">
                <Typography variant="subtitle2">{selectedDoktor.ad}</Typography>
                <Typography variant="body2">{selectedDoktor.uzmanlik} - {selectedDoktor.hastane}</Typography>
              </Alert>

              <TextField
                fullWidth
                label="Randevu Tarihi"
                type="date"
                value={randevuData.tarih}
                onChange={(e) => setRandevuData({ ...randevuData, tarih: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                required
              />

              <FormControl fullWidth required>
                <InputLabel>Randevu Saati</InputLabel>
                <Select
                  value={randevuData.saat}
                  label="Randevu Saati"
                  onChange={(e) => setRandevuData({ ...randevuData, saat: e.target.value })}
                >
                  {selectedDoktor.musaitlik.map((saat) => (
                    <MenuItem key={saat} value={saat}>
                      {saat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Ek Notlar (Opsiyonel)"
                multiline
                rows={3}
                value={randevuData.notlar}
                onChange={(e) => setRandevuData({ ...randevuData, notlar: e.target.value })}
                placeholder="Şikayetleriniz veya özel durumlar..."
              />

              <Alert severity="warning">
                <Typography variant="body2">
                  <strong>Randevu Ücreti:</strong> {selectedDoktor.randevuUcreti} ₺
                </Typography>
                <Typography variant="caption">
                  Ödeme hastanede randevu sırasında yapılacaktır.
                </Typography>
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRandevuDialog(false)}>
            İptal
          </Button>
          <Button 
            variant="contained" 
            onClick={handleRandevuOnayla}
            disabled={!randevuData.tarih || !randevuData.saat}
          >
            Randevuyu Onayla
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DoktorListesi; 