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
  Alert,
  IconButton,
  Tooltip,
  Avatar,
  Badge,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  Person,
  CalendarToday,
  AccessTime,
  LocalHospital,
  Phone,
  Email,
  Note
} from '@mui/icons-material';

// Dummy veri - gelen randevu istekleri
const initialRandevuIstekleri = [
  {
    id: 1,
    hastaAdi: 'Ahmet Yılmaz',
    tcKimlik: '12345678901',
    telefon: '+90 532 111 2233',
    email: 'ahmet.yilmaz@email.com',
    tarih: '2024-06-15',
    saat: '09:00',
    sikayet: 'Göğüs ağrısı ve nefes darlığı şikayeti var. 2 gündür devam ediyor.',
    durum: 'Bekliyor',
    istekTarihi: '2024-06-12 14:30',
    yas: 45,
    kanGrubu: 'A+',
    aciliyet: 'Normal'
  },
  {
    id: 2,
    hastaAdi: 'Zeynep Kaya',
    tcKimlik: '98765432101',
    telefon: '+90 555 444 6677',
    email: 'zeynep.kaya@email.com',
    tarih: '2024-06-15',
    saat: '10:30',
    sikayet: 'Migren ataklarında artış. İlaç tedavisinde değişiklik gerekebilir.',
    durum: 'Bekliyor',
    istekTarihi: '2024-06-12 16:45',
    yas: 32,
    kanGrubu: 'B-',
    aciliyet: 'Yüksek'
  },
  {
    id: 3,
    hastaAdi: 'Mehmet Demir',
    tcKimlik: '55566677788',
    telefon: '+90 543 222 8899',
    email: 'mehmet.demir@email.com',
    tarih: '2024-06-16',
    saat: '14:00',
    sikayet: 'Kontrol muayenesi. Kan tahlili sonuçlarını değerlendirmek için.',
    durum: 'Onaylandı',
    istekTarihi: '2024-06-11 09:15',
    yas: 58,
    kanGrubu: 'O+',
    aciliyet: 'Düşük'
  },
  {
    id: 4,
    hastaAdi: 'Fatma Özkan',
    tcKimlik: '11122233344',
    telefon: '+90 507 333 4455',
    email: 'fatma.ozkan@email.com',
    tarih: '2024-06-17',
    saat: '11:00',
    sikayet: 'Diz ağrısı ve hareket kısıtlılığı. Fizik tedavi sonrası kontrol.',
    durum: 'Reddedildi',
    istekTarihi: '2024-06-10 11:20',
    yas: 67,
    kanGrubu: 'AB+',
    aciliyet: 'Normal',
    redNedeni: 'O tarihe acil hasta alındı, alternatif tarih önerildi.'
  },
  {
    id: 5,
    hastaAdi: 'Can Yıldız',
    tcKimlik: '99988877766',
    telefon: '+90 546 777 8899',
    email: 'can.yildiz@email.com',
    tarih: '2024-06-15',
    saat: '16:30',
    sikayet: 'Spor yaralanması sonrası kontrol. Ayak bileği ağrısı.',
    durum: 'Bekliyor',
    istekTarihi: '2024-06-13 08:30',
    yas: 28,
    kanGrubu: 'A-',
    aciliyet: 'Normal'
  }
];

const RandevuIstekleri: React.FC = () => {
  const [istekler, setIstekler] = useState(initialRandevuIstekleri);
  const [detayDialog, setDetayDialog] = useState(false);
  const [selectedIstek, setSelectedIstek] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'onayla' | 'reddet'>('onayla');
  const [notlar, setNotlar] = useState('');

  const handleDetayGor = (istek: any) => {
    setSelectedIstek(istek);
    setDetayDialog(true);
  };

  const handleAction = (istek: any, type: 'onayla' | 'reddet') => {
    setSelectedIstek(istek);
    setActionType(type);
    setNotlar('');
    setActionDialog(true);
  };

  const handleConfirmAction = () => {
    if (selectedIstek) {
      const newIstekler = istekler.map(istek =>
        istek.id === selectedIstek.id
          ? {
              ...istek,
              durum: actionType === 'onayla' ? 'Onaylandı' : 'Reddedildi',
              [actionType === 'onayla' ? 'onayNotu' : 'redNedeni']: notlar
            }
          : istek
      );
      setIstekler(newIstekler);
      setActionDialog(false);
    }
  };

  const getDurumColor = (durum: string) => {
    switch (durum) {
      case 'Bekliyor': return 'warning';
      case 'Onaylandı': return 'success';
      case 'Reddedildi': return 'error';
      default: return 'default';
    }
  };

  const getAciliyetColor = (aciliyet: string) => {
    switch (aciliyet) {
      case 'Yüksek': return 'error';
      case 'Normal': return 'warning';
      case 'Düşük': return 'success';
      default: return 'default';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const bekleyenSayisi = istekler.filter(i => i.durum === 'Bekliyor').length;
  const onaylananSayisi = istekler.filter(i => i.durum === 'Onaylandı').length;
  const reddedilenSayisi = istekler.filter(i => i.durum === 'Reddedildi').length;

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              📋 Randevu İstekleri
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Gelen randevu taleplerini inceleyin ve onaylayın
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Badge badgeContent={bekleyenSayisi} color="warning">
              <Chip 
                label="Bekleyen" 
                color="warning" 
                variant="outlined"
              />
            </Badge>
            <Chip 
              label={`Onaylanan: ${onaylananSayisi}`} 
              color="success" 
              variant="outlined"
            />
            <Chip 
              label={`Reddedilen: ${reddedilenSayisi}`} 
              color="error" 
              variant="outlined"
            />
          </Stack>
        </Stack>

        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Hasta</strong></TableCell>
                <TableCell><strong>Randevu Tarihi</strong></TableCell>
                <TableCell><strong>Şikayet</strong></TableCell>
                <TableCell><strong>Aciliyet</strong></TableCell>
                <TableCell><strong>Durum</strong></TableCell>
                <TableCell align="center"><strong>İşlemler</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {istekler.map((istek) => (
                <TableRow key={istek.id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {getInitials(istek.hastaAdi)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {istek.hastaAdi}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {istek.yas} yaş, {istek.kanGrubu}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarToday sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          {new Date(istek.tarih).toLocaleDateString('tr-TR')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AccessTime sx={{ fontSize: 16 }} />
                        <Typography variant="body2" color="textSecondary">
                          {istek.saat}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ 
                      maxWidth: 200, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {istek.sikayet}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={istek.aciliyet}
                      color={getAciliyetColor(istek.aciliyet) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={istek.durum}
                      color={getDurumColor(istek.durum) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Detayları Gör">
                        <IconButton 
                          size="small" 
                          color="info"
                          onClick={() => handleDetayGor(istek)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {istek.durum === 'Bekliyor' && (
                        <>
                          <Tooltip title="Onayla">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleAction(istek, 'onayla')}
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reddet">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleAction(istek, 'reddet')}
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {istekler.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Henüz randevu isteği bulunmuyor.
          </Alert>
        )}
      </CardContent>

      {/* Detay Dialog */}
      <Dialog open={detayDialog} onClose={() => setDetayDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Randevu İsteği Detayları</Typography>
            <IconButton onClick={() => setDetayDialog(false)}>
              <Cancel />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedIstek && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              {/* Hasta Bilgileri */}
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  <Person sx={{ mr: 1 }} />
                  Hasta Bilgileri
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Box sx={{ flex: 1 }}>
                    <Stack spacing={1}>
                      <Typography><strong>Ad Soyad:</strong> {selectedIstek.hastaAdi}</Typography>
                      <Typography><strong>TC Kimlik:</strong> {selectedIstek.tcKimlik}</Typography>
                      <Typography><strong>Yaş:</strong> {selectedIstek.yas}</Typography>
                      <Typography><strong>Kan Grubu:</strong> {selectedIstek.kanGrubu}</Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Phone sx={{ fontSize: 16 }} />
                        <Typography>{selectedIstek.telefon}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Email sx={{ fontSize: 16 }} />
                        <Typography>{selectedIstek.email}</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              {/* Randevu Bilgileri */}
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  <CalendarToday sx={{ mr: 1 }} />
                  Randevu Bilgileri
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Stack direction="row" spacing={4}>
                    <Typography><strong>Tarih:</strong> {new Date(selectedIstek.tarih).toLocaleDateString('tr-TR')}</Typography>
                    <Typography><strong>Saat:</strong> {selectedIstek.saat}</Typography>
                    <Chip 
                      label={selectedIstek.aciliyet} 
                      color={getAciliyetColor(selectedIstek.aciliyet) as any}
                      size="small"
                    />
                  </Stack>
                  <Typography><strong>İstek Tarihi:</strong> {selectedIstek.istekTarihi}</Typography>
                </Stack>
              </Box>

              {/* Şikayet */}
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  <LocalHospital sx={{ mr: 1 }} />
                  Hasta Şikayeti
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ 
                  bgcolor: 'grey.50', 
                  p: 2, 
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'grey.200'
                }}>
                  {selectedIstek.sikayet}
                </Typography>
              </Box>

              {/* Durum Bilgisi */}
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  📋 Durum Bilgisi
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Chip 
                    label={selectedIstek.durum} 
                    color={getDurumColor(selectedIstek.durum) as any}
                  />
                  {selectedIstek.redNedeni && (
                    <Alert severity="error" sx={{ flex: 1 }}>
                      <Typography variant="body2">
                        <strong>Red Nedeni:</strong> {selectedIstek.redNedeni}
                      </Typography>
                    </Alert>
                  )}
                  {selectedIstek.onayNotu && (
                    <Alert severity="success" sx={{ flex: 1 }}>
                      <Typography variant="body2">
                        <strong>Onay Notu:</strong> {selectedIstek.onayNotu}
                      </Typography>
                    </Alert>
                  )}
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* Onay/Red Dialog */}
      <Dialog open={actionDialog} onClose={() => setActionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'onayla' ? '✅ Randevuyu Onayla' : '❌ Randevuyu Reddet'}
        </DialogTitle>
        <DialogContent>
          {selectedIstek && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Alert severity={actionType === 'onayla' ? 'success' : 'warning'}>
                <Typography variant="subtitle2" gutterBottom>
                  {selectedIstek.hastaAdi} - {new Date(selectedIstek.tarih).toLocaleDateString('tr-TR')} {selectedIstek.saat}
                </Typography>
                <Typography variant="body2">
                  Bu randevu isteğini {actionType === 'onayla' ? 'onaylamak' : 'reddetmek'} istediğinize emin misiniz?
                </Typography>
              </Alert>

              <TextField
                fullWidth
                label={actionType === 'onayla' ? 'Onay Notu (Opsiyonel)' : 'Red Nedeni'}
                multiline
                rows={3}
                value={notlar}
                onChange={(e) => setNotlar(e.target.value)}
                placeholder={
                  actionType === 'onayla' 
                    ? 'Hastaya iletilecek ek bilgiler...'
                    : 'Randevunun reddedilme nedenini belirtin...'
                }
                required={actionType === 'reddet'}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog(false)}>
            İptal
          </Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmAction}
            color={actionType === 'onayla' ? 'success' : 'error'}
            disabled={actionType === 'reddet' && !notlar.trim()}
          >
            {actionType === 'onayla' ? 'Onayla' : 'Reddet'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default RandevuIstekleri; 