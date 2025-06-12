import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add,
  Delete,
  Save,
  CalendarMonth,
  AccessTime,
  CheckCircle,
  Warning,
  Event
} from '@mui/icons-material';

// Dummy veri - özel müsaitlik günleri
const initialOzelGunler = [
  {
    id: 1,
    tarih: '2024-06-20',
    baslangic: '08:00',
    bitis: '12:00',
    maxRandevu: 6,
    aciklama: 'Yarım gün çalışma',
    durum: 'Aktif'
  },
  {
    id: 2,
    tarih: '2024-06-22',
    baslangic: '09:00',
    bitis: '18:00',
    maxRandevu: 15,
    aciklama: 'Ekstra mesai günü',
    durum: 'Aktif'
  },
  {
    id: 3,
    tarih: '2024-06-25',
    baslangic: '',
    bitis: '',
    maxRandevu: 0,
    aciklama: 'İzin günü',
    durum: 'İzinli'
  }
];

const MusaitlikForm: React.FC = () => {
  const [ozelGunler, setOzelGunler] = useState(initialOzelGunler);
  const [yeniGunDialog, setYeniGunDialog] = useState(false);
  const [formData, setFormData] = useState({
    tarih: '',
    baslangic: '',
    bitis: '',
    maxRandevu: 10,
    aciklama: '',
    izinGunu: false
  });

  const handleFormSubmit = () => {
    const yeniGun = {
      id: Date.now(),
      tarih: formData.tarih,
      baslangic: formData.izinGunu ? '' : formData.baslangic,
      bitis: formData.izinGunu ? '' : formData.bitis,
      maxRandevu: formData.izinGunu ? 0 : formData.maxRandevu,
      aciklama: formData.aciklama,
      durum: formData.izinGunu ? 'İzinli' : 'Aktif'
    };

    setOzelGunler([...ozelGunler, yeniGun]);
    setFormData({
      tarih: '',
      baslangic: '',
      bitis: '',
      maxRandevu: 10,
      aciklama: '',
      izinGunu: false
    });
    setYeniGunDialog(false);
  };

  const handleSil = (id: number) => {
    setOzelGunler(ozelGunler.filter(gun => gun.id !== id));
  };

  const getDurumColor = (durum: string) => {
    return durum === 'Aktif' ? 'success' : 'error';
  };

  const bugununTarihi = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              📅 Özel Müsaitlik Günleri
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Normal programınızın dışında özel çalışma günleri veya izin günleri ekleyin
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setYeniGunDialog(true)}
          >
            Yeni Gün Ekle
          </Button>
        </Stack>

        {/* Mevcut Özel Günler */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            🗓️ Kayıtlı Özel Günler
          </Typography>
          {ozelGunler.length === 0 ? (
            <Alert severity="info">
              Henüz özel gün kaydı bulunmuyor. "Yeni Gün Ekle" butonunu kullanarak ekleyebilirsiniz.
            </Alert>
          ) : (
            <Stack spacing={2}>
              {ozelGunler
                .sort((a, b) => new Date(a.tarih).getTime() - new Date(b.tarih).getTime())
                .map((gun) => (
                  <Paper key={gun.id} variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={3} alignItems="center" sx={{ flex: 1 }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {new Date(gun.tarih).toLocaleDateString('tr-TR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {gun.tarih}
                          </Typography>
                        </Box>
                        
                        <Chip
                          label={gun.durum}
                          color={getDurumColor(gun.durum) as any}
                          size="small"
                        />

                        {gun.durum === 'Aktif' ? (
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <AccessTime sx={{ fontSize: 16 }} />
                              <Typography variant="body2">
                                {gun.baslangic} - {gun.bitis}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="textSecondary">
                              Max: {gun.maxRandevu} randevu
                            </Typography>
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="error.main">
                            İzin Günü
                          </Typography>
                        )}

                        {gun.aciklama && (
                          <Typography variant="body2" color="textSecondary" sx={{ 
                            fontStyle: 'italic',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            "{gun.aciklama}"
                          </Typography>
                        )}
                      </Stack>

                      <Tooltip title="Sil">
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleSil(gun.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Paper>
                ))}
            </Stack>
          )}
        </Box>

        {/* Bilgilendirme */}
        <Alert severity="info" icon={<Event />}>
          <Typography variant="subtitle2" gutterBottom>
            💡 Özel Gün Tipleri
          </Typography>
          <Typography variant="body2">
            <strong>Çalışma Günü:</strong> Normal programınızın dışında ek çalışma günleri<br/>
            <strong>İzin Günü:</strong> Normal çalışma gününüzde randevu alınmasını engellemek için
          </Typography>
        </Alert>
      </CardContent>

      {/* Yeni Gün Ekleme Dialog */}
      <Dialog open={yeniGunDialog} onClose={() => setYeniGunDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          📅 Yeni Özel Gün Ekle
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Tarih"
              type="date"
              value={formData.tarih}
              onChange={(e) => setFormData({ ...formData, tarih: e.target.value })}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: bugununTarihi }}
              required
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.izinGunu}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    izinGunu: e.target.checked,
                    baslangic: e.target.checked ? '' : formData.baslangic,
                    bitis: e.target.checked ? '' : formData.bitis,
                    maxRandevu: e.target.checked ? 0 : formData.maxRandevu
                  })}
                />
              }
              label="Bu gün izin günü olarak işaretle"
            />

            {!formData.izinGunu && (
              <>
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    label="Başlangıç Saati"
                    type="time"
                    value={formData.baslangic}
                    onChange={(e) => setFormData({ ...formData, baslangic: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Bitiş Saati"
                    type="time"
                    value={formData.bitis}
                    onChange={(e) => setFormData({ ...formData, bitis: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Stack>

                <TextField
                  fullWidth
                  label="Maksimum Randevu Sayısı"
                  type="number"
                  value={formData.maxRandevu}
                  onChange={(e) => setFormData({ ...formData, maxRandevu: parseInt(e.target.value) || 0 })}
                  inputProps={{ min: 1, max: 30 }}
                  helperText="Bu gün için alınabilecek maksimum randevu sayısı"
                  required
                />
              </>
            )}

            <TextField
              fullWidth
              label="Açıklama"
              value={formData.aciklama}
              onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
              placeholder="Örn: Ekstra mesai, yarım gün çalışma, izin günü vb."
              helperText="Bu günle ilgili ek bilgiler (opsiyonel)"
            />

            {/* Önizleme */}
            {formData.tarih && (
              <Alert severity={formData.izinGunu ? 'warning' : 'success'}>
                <Typography variant="subtitle2" gutterBottom>
                  📋 Önizleme
                </Typography>
                <Typography variant="body2">
                  <strong>Tarih:</strong> {new Date(formData.tarih).toLocaleDateString('tr-TR', {
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long',
                    day: 'numeric'
                  })}<br/>
                  {formData.izinGunu ? (
                    <strong>İzin günü olarak işaretlenecek</strong>
                  ) : (
                    <>
                      <strong>Çalışma Saatleri:</strong> {formData.baslangic} - {formData.bitis}<br/>
                      <strong>Max Randevu:</strong> {formData.maxRandevu}
                    </>
                  )}
                  {formData.aciklama && (
                    <>
                      <br/><strong>Açıklama:</strong> {formData.aciklama}
                    </>
                  )}
                </Typography>
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setYeniGunDialog(false)}>
            İptal
          </Button>
          <Button 
            variant="contained" 
            onClick={handleFormSubmit}
            startIcon={<Save />}
            disabled={
              !formData.tarih || 
              (!formData.izinGunu && (!formData.baslangic || !formData.bitis || formData.maxRandevu <= 0))
            }
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default MusaitlikForm; 