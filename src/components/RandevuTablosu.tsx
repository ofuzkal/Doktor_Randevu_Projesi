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
  Badge,
  Divider
} from '@mui/material';
import {
  Visibility,
  FilterList,
  CalendarToday,
  AccessTime,
  Person,
  MedicalServices,
  Phone,
  Email,
  Close
} from '@mui/icons-material';

// Tip tanımlamaları
interface Randevu {
  id: number;
  hastaAdi: string;
  doktorAdi: string;
  uzmanlik: string;
  tarih: string;
  saat: string;
  durum: string;
  hastaTelefon: string;
  hastaEmail: string;
  sikayet: string;
  randevuTipi: string;
  olusturmaTarihi: string;
}

// Dummy randevu verisi
const initialRandevular: Randevu[] = [
  {
    id: 1,
    hastaAdi: 'Ahmet Yılmaz',
    doktorAdi: 'Dr. Fatma Şahin',
    uzmanlik: 'Kardiyoloji',
    tarih: '2024-06-15',
    saat: '09:00',
    durum: 'Onaylandı',
    hastaTelefon: '+90 532 111 2233',
    hastaEmail: 'ahmet.yilmaz@email.com',
    sikayet: 'Göğüs ağrısı ve nefes darlığı',
    randevuTipi: 'Kontrol',
    olusturmaTarihi: '2024-06-12 14:30'
  },
  {
    id: 2,
    hastaAdi: 'Zeynep Kaya',
    doktorAdi: 'Dr. Mehmet Kaya',
    uzmanlik: 'Nöroloji',
    tarih: '2024-06-15',
    saat: '10:30',
    durum: 'Bekliyor',
    hastaTelefon: '+90 555 444 6677',
    hastaEmail: 'zeynep.kaya@email.com',
    sikayet: 'Migren ataklarında artış',
    randevuTipi: 'İlk Muayene',
    olusturmaTarihi: '2024-06-12 16:45'
  },
  {
    id: 3,
    hastaAdi: 'Mehmet Demir',
    doktorAdi: 'Dr. Fatma Şahin',
    uzmanlik: 'Kardiyoloji',
    tarih: '2024-06-16',
    saat: '14:00',
    durum: 'Tamamlandı',
    hastaTelefon: '+90 543 222 8899',
    hastaEmail: 'mehmet.demir@email.com',
    sikayet: 'Kontrol muayenesi',
    randevuTipi: 'Kontrol',
    olusturmaTarihi: '2024-06-11 09:15'
  },
  {
    id: 4,
    hastaAdi: 'Fatma Özkan',
    doktorAdi: 'Dr. Ayşe Yılmaz',
    uzmanlik: 'Ortopedi',
    tarih: '2024-06-17',
    saat: '11:00',
    durum: 'İptal Edildi',
    hastaTelefon: '+90 507 333 4455',
    hastaEmail: 'fatma.ozkan@email.com',
    sikayet: 'Diz ağrısı ve hareket kısıtlılığı',
    randevuTipi: 'Fizik Tedavi',
    olusturmaTarihi: '2024-06-10 11:20'
  },
  {
    id: 5,
    hastaAdi: 'Can Yıldız',
    doktorAdi: 'Dr. Can Özkan',
    uzmanlik: 'Göz Hastalıkları',
    tarih: '2024-06-18',
    saat: '16:30',
    durum: 'Onaylandı',
    hastaTelefon: '+90 546 777 8899',
    hastaEmail: 'can.yildiz@email.com',
    sikayet: 'Göz muayenesi',
    randevuTipi: 'Kontrol',
    olusturmaTarihi: '2024-06-13 08:30'
  },
  {
    id: 6,
    hastaAdi: 'Elif Arslan',
    doktorAdi: 'Dr. Mehmet Kaya',
    uzmanlik: 'Nöroloji',
    tarih: '2024-06-19',
    saat: '13:30',
    durum: 'Bekliyor',
    hastaTelefon: '+90 533 666 7788',
    hastaEmail: 'elif.arslan@email.com',
    sikayet: 'Baş dönmesi şikayeti',
    randevuTipi: 'İlk Muayene',
    olusturmaTarihi: '2024-06-14 10:20'
  }
];

const RandevuTablosu: React.FC = () => {
  const [randevular] = useState<Randevu[]>(initialRandevular);
  const [detayDialog, setDetayDialog] = useState(false);
  const [filterDialog, setFilterDialog] = useState(false);
  const [selectedRandevu, setSelectedRandevu] = useState<Randevu | null>(null);
  const [filters, setFilters] = useState({
    durum: '',
    uzmanlik: '',
    tarih: ''
  });

  const handleDetayGor = (randevu: Randevu) => {
    setSelectedRandevu(randevu);
    setDetayDialog(true);
  };

  const getDurumColor = (durum: string): 'success' | 'warning' | 'info' | 'error' | 'default' => {
    switch (durum) {
      case 'Onaylandı': return 'success';
      case 'Bekliyor': return 'warning';
      case 'Tamamlandı': return 'info';
      case 'İptal Edildi': return 'error';
      default: return 'default';
    }
  };

  const getRandevuTipiColor = (tip: string): 'primary' | 'secondary' | 'success' | 'default' => {
    switch (tip) {
      case 'İlk Muayene': return 'primary';
      case 'Kontrol': return 'secondary';
      case 'Fizik Tedavi': return 'success';
      default: return 'default';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Filtreleme
  const filteredRandevular = randevular.filter(randevu => {
    if (filters.durum && randevu.durum !== filters.durum) return false;
    if (filters.uzmanlik && randevu.uzmanlik !== filters.uzmanlik) return false;
    if (filters.tarih && randevu.tarih !== filters.tarih) return false;
    return true;
  });

  // İstatistikler
  const onaylananSayisi = randevular.filter(r => r.durum === 'Onaylandı').length;
  const bekleyenSayisi = randevular.filter(r => r.durum === 'Bekliyor').length;
  const tamamlananSayisi = randevular.filter(r => r.durum === 'Tamamlandı').length;
  const iptalSayisi = randevular.filter(r => r.durum === 'İptal Edildi').length;

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              📅 Randevu Yönetimi
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Tüm randevuları görüntüleyin ve yönetin
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFilterDialog(true)}
          >
            Filtrele
          </Button>
        </Stack>

        {/* İstatistikler */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
          <Chip 
            label={`${randevular.length} Toplam`} 
            color="primary" 
          />
          <Badge badgeContent={bekleyenSayisi} color="warning">
            <Chip 
              label="Bekleyen" 
              color="warning" 
              variant="outlined"
            />
          </Badge>
          <Chip 
            label={`${onaylananSayisi} Onaylandı`} 
            color="success" 
            variant="outlined"
          />
          <Chip 
            label={`${tamamlananSayisi} Tamamlandı`} 
            color="info" 
            variant="outlined"
          />
          <Chip 
            label={`${iptalSayisi} İptal`} 
            color="error" 
            variant="outlined"
          />
        </Stack>

        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Hasta</strong></TableCell>
                <TableCell><strong>Doktor</strong></TableCell>
                <TableCell><strong>Tarih & Saat</strong></TableCell>
                <TableCell><strong>Randevu Tipi</strong></TableCell>
                <TableCell><strong>Durum</strong></TableCell>
                <TableCell align="center"><strong>İşlemler</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRandevular.map((randevu) => (
                <TableRow key={randevu.id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'info.main' }}>
                        {getInitials(randevu.hastaAdi)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {randevu.hastaAdi}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {randevu.id}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {randevu.doktorAdi}
                      </Typography>
                      <Chip
                        label={randevu.uzmanlik}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarToday sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          {new Date(randevu.tarih).toLocaleDateString('tr-TR')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AccessTime sx={{ fontSize: 16 }} />
                        <Typography variant="body2" color="textSecondary">
                          {randevu.saat}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={randevu.randevuTipi}
                      color={getRandevuTipiColor(randevu.randevuTipi)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={randevu.durum}
                      color={getDurumColor(randevu.durum)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Detayları Gör">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleDetayGor(randevu)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredRandevular.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Seçilen filtrelere uygun randevu bulunamadı.
          </Alert>
        )}
      </CardContent>

      {/* Detay Dialog */}
      <Dialog open={detayDialog} onClose={() => setDetayDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Randevu Detayları</Typography>
            <IconButton onClick={() => setDetayDialog(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedRandevu && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              {/* Genel Bilgiler */}
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  📋 Genel Bilgiler
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Box sx={{ flex: 1 }}>
                    <Stack spacing={1}>
                      <Typography><strong>Randevu ID:</strong> {selectedRandevu.id}</Typography>
                      <Typography><strong>Tarih:</strong> {new Date(selectedRandevu.tarih).toLocaleDateString('tr-TR')}</Typography>
                      <Typography><strong>Saat:</strong> {selectedRandevu.saat}</Typography>
                      <Typography><strong>Oluşturma Tarihi:</strong> {selectedRandevu.olusturmaTarihi}</Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography><strong>Durum:</strong></Typography>
                        <Chip 
                          label={selectedRandevu.durum} 
                          color={getDurumColor(selectedRandevu.durum)}
                          size="small"
                        />
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography><strong>Tip:</strong></Typography>
                        <Chip 
                          label={selectedRandevu.randevuTipi} 
                          color={getRandevuTipiColor(selectedRandevu.randevuTipi)}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              {/* Hasta Bilgileri */}
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  <Person sx={{ mr: 1 }} />
                  Hasta Bilgileri
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Typography><strong>Ad Soyad:</strong> {selectedRandevu.hastaAdi}</Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Phone sx={{ fontSize: 16 }} />
                    <Typography>{selectedRandevu.hastaTelefon}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Email sx={{ fontSize: 16 }} />
                    <Typography>{selectedRandevu.hastaEmail}</Typography>
                  </Stack>
                </Stack>
              </Box>

              {/* Doktor Bilgileri */}
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  <MedicalServices sx={{ mr: 1 }} />
                  Doktor Bilgileri
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Typography><strong>Doktor:</strong> {selectedRandevu.doktorAdi}</Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography><strong>Uzmanlık:</strong></Typography>
                    <Chip 
                      label={selectedRandevu.uzmanlik} 
                      color="secondary"
                      size="small"
                    />
                  </Stack>
                </Stack>
              </Box>

              {/* Şikayet */}
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  🩺 Hasta Şikayeti
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ 
                  bgcolor: '#f8fafc', 
                  p: 2, 
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  color: '#475569'
                }}>
                  {selectedRandevu.sikayet}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* Filtre Dialog */}
      <Dialog open={filterDialog} onClose={() => setFilterDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>🔍 Randevu Filtreleme</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select
                value={filters.durum}
                label="Durum"
                onChange={(e) => setFilters({ ...filters, durum: e.target.value })}
              >
                <MenuItem value="">Tümü</MenuItem>
                <MenuItem value="Bekliyor">Bekliyor</MenuItem>
                <MenuItem value="Onaylandı">Onaylandı</MenuItem>
                <MenuItem value="Tamamlandı">Tamamlandı</MenuItem>
                <MenuItem value="İptal Edildi">İptal Edildi</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Uzmanlık</InputLabel>
              <Select
                value={filters.uzmanlik}
                label="Uzmanlık"
                onChange={(e) => setFilters({ ...filters, uzmanlik: e.target.value })}
              >
                <MenuItem value="">Tümü</MenuItem>
                <MenuItem value="Kardiyoloji">Kardiyoloji</MenuItem>
                <MenuItem value="Nöroloji">Nöroloji</MenuItem>
                <MenuItem value="Ortopedi">Ortopedi</MenuItem>
                <MenuItem value="Göz Hastalıkları">Göz Hastalıkları</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Tarih"
              type="date"
              value={filters.tarih}
              onChange={(e) => setFilters({ ...filters, tarih: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilters({ durum: '', uzmanlik: '', tarih: '' })}>
            Temizle
          </Button>
          <Button variant="contained" onClick={() => setFilterDialog(false)}>
            Uygula
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default RandevuTablosu; 