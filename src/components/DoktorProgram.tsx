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
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  AccessTime,
  CalendarToday,
  CheckCircle,
  Warning
} from '@mui/icons-material';

// Dummy veri - doktor haftalık programı
const initialProgram = [
  {
    gun: 'Pazartesi',
    aktif: true,
    baslangic: '09:00',
    bitis: '17:00',
    molaSaati: '12:00-13:00',
    maxRandevu: 12,
    mevcutRandevu: 8,
    durum: 'Normal'
  },
  {
    gun: 'Salı',
    aktif: true,
    baslangic: '08:30',
    bitis: '16:30',
    molaSaati: '12:30-13:30',
    maxRandevu: 10,
    mevcutRandevu: 10,
    durum: 'Dolu'
  },
  {
    gun: 'Çarşamba',
    aktif: true,
    baslangic: '10:00',
    bitis: '18:00',
    molaSaati: '13:00-14:00',
    maxRandevu: 14,
    mevcutRandevu: 6,
    durum: 'Müsait'
  },
  {
    gun: 'Perşembe',
    aktif: true,
    baslangic: '09:00',
    bitis: '17:00',
    molaSaati: '12:00-13:00',
    maxRandevu: 12,
    mevcutRandevu: 9,
    durum: 'Normal'
  },
  {
    gun: 'Cuma',
    aktif: true,
    baslangic: '08:00',
    bitis: '15:00',
    molaSaati: '11:30-12:30',
    maxRandevu: 8,
    mevcutRandevu: 4,
    durum: 'Müsait'
  },
  {
    gun: 'Cumartesi',
    aktif: false,
    baslangic: '',
    bitis: '',
    molaSaati: '',
    maxRandevu: 0,
    mevcutRandevu: 0,
    durum: 'İzinli'
  },
  {
    gun: 'Pazar',
    aktif: false,
    baslangic: '',
    bitis: '',
    molaSaati: '',
    maxRandevu: 0,
    mevcutRandevu: 0,
    durum: 'İzinli'
  }
];

const DoktorProgram: React.FC = () => {
  const [program, setProgram] = useState(initialProgram);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [editData, setEditData] = useState({
    aktif: false,
    baslangic: '',
    bitis: '',
    molaSaati: '',
    maxRandevu: 0
  });

  const handleEdit = (dayProgram: any) => {
    setSelectedDay(dayProgram);
    setEditData({
      aktif: dayProgram.aktif,
      baslangic: dayProgram.baslangic,
      bitis: dayProgram.bitis,
      molaSaati: dayProgram.molaSaati,
      maxRandevu: dayProgram.maxRandevu
    });
    setEditDialog(true);
  };

  const handleSave = () => {
    if (selectedDay) {
      const newProgram = program.map(p => 
        p.gun === selectedDay.gun 
          ? {
              ...p,
              ...editData,
              durum: editData.aktif ? (editData.maxRandevu > p.mevcutRandevu ? 'Müsait' : 'Dolu') : 'İzinli'
            }
          : p
      );
      setProgram(newProgram);
      setEditDialog(false);
    }
  };

  const getDurumColor = (durum: string) => {
    switch (durum) {
      case 'Müsait': return 'success';
      case 'Normal': return 'warning';
      case 'Dolu': return 'error';
      case 'İzinli': return 'default';
      default: return 'default';
    }
  };

  const getDurumIcon = (durum: string) => {
    switch (durum) {
      case 'Müsait': return <CheckCircle />;
      case 'Normal': return <Warning />;
      case 'Dolu': return <Warning />;
      case 'İzinli': return <Cancel />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              📅 Haftalık Çalışma Programım
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Çalışma saatlerinizi ve müsaitlik durumunuzu yönetin
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip 
              label={`${program.filter(p => p.aktif).length} Çalışma Günü`} 
              color="primary" 
              icon={<CalendarToday />}
            />
            <Chip 
              label={`${program.reduce((acc, p) => acc + p.mevcutRandevu, 0)} Toplam Randevu`} 
              color="info" 
              icon={<AccessTime />}
            />
          </Stack>
        </Stack>

        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Gün</strong></TableCell>
                <TableCell><strong>Durum</strong></TableCell>
                <TableCell><strong>Çalışma Saatleri</strong></TableCell>
                <TableCell><strong>Mola</strong></TableCell>
                <TableCell><strong>Randevu Durumu</strong></TableCell>
                <TableCell align="center"><strong>İşlemler</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {program.map((dayProgram) => (
                <TableRow key={dayProgram.gun} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {dayProgram.gun}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={dayProgram.durum}
                      color={getDurumColor(dayProgram.durum) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {dayProgram.aktif ? (
                      <Typography variant="body2">
                        {dayProgram.baslangic} - {dayProgram.bitis}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Çalışılmıyor
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {dayProgram.molaSaati || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {dayProgram.aktif ? (
                      <Box>
                        <Typography variant="body2">
                          {dayProgram.mevcutRandevu} / {dayProgram.maxRandevu}
                        </Typography>
                        <Box sx={{ 
                          width: '100%', 
                          bgcolor: '#f1f5f9', 
                          borderRadius: 2, 
                          height: 8, 
                          mt: 0.5 
                        }}>
                          <Box sx={{ 
                            width: `${(dayProgram.mevcutRandevu / dayProgram.maxRandevu) * 100}%`,
                            bgcolor: dayProgram.durum === 'Dolu' ? '#fecaca' : 
                                   dayProgram.durum === 'Normal' ? '#fde68a' : '#bbf7d0',
                            height: '100%',
                            borderRadius: 2,
                            transition: 'all 0.3s ease'
                          }} />
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Düzenle">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEdit(dayProgram)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Özet Bilgiler */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            📊 Haftalık Özet
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip 
              label={`Toplam Çalışma: ${program.filter(p => p.aktif).length} gün`}
              variant="outlined"
              color="primary"
            />
            <Chip 
              label={`Max Randevu: ${program.reduce((acc, p) => acc + p.maxRandevu, 0)}`}
              variant="outlined"
              color="info"
            />
            <Chip 
              label={`Mevcut Randevu: ${program.reduce((acc, p) => acc + p.mevcutRandevu, 0)}`}
              variant="outlined"
              color="warning"
            />
            <Chip 
              label={`Müsait Slot: ${program.reduce((acc, p) => acc + (p.maxRandevu - p.mevcutRandevu), 0)}`}
              variant="outlined"
              color="success"
            />
          </Stack>
        </Box>
      </CardContent>

      {/* Düzenleme Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          📝 {selectedDay?.gun} Programını Düzenle
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={editData.aktif}
                  onChange={(e) => setEditData({ ...editData, aktif: e.target.checked })}
                />
              }
              label="Bu gün çalışılsın"
            />

            {editData.aktif && (
              <>
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    label="Başlangıç Saati"
                    type="time"
                    value={editData.baslangic}
                    onChange={(e) => setEditData({ ...editData, baslangic: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="Bitiş Saati"
                    type="time"
                    value={editData.bitis}
                    onChange={(e) => setEditData({ ...editData, bitis: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>

                <TextField
                  fullWidth
                  label="Mola Saati"
                  value={editData.molaSaati}
                  onChange={(e) => setEditData({ ...editData, molaSaati: e.target.value })}
                  placeholder="Örn: 12:00-13:00"
                  helperText="Mola saatinizi belirtin"
                />

                <TextField
                  fullWidth
                  label="Maksimum Randevu Sayısı"
                  type="number"
                  value={editData.maxRandevu}
                  onChange={(e) => setEditData({ ...editData, maxRandevu: parseInt(e.target.value) || 0 })}
                  inputProps={{ min: 1, max: 20 }}
                  helperText="Bu gün için alınabilecek maksimum randevu sayısı"
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)} startIcon={<Cancel />}>
            İptal
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            startIcon={<Save />}
            disabled={editData.aktif && (!editData.baslangic || !editData.bitis || editData.maxRandevu <= 0)}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default DoktorProgram; 