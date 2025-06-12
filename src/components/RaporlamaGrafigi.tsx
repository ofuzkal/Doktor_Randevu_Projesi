import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  CalendarToday,
  Assessment,
  ShowChart
} from '@mui/icons-material';

// Dummy veri - haftalık randevu istatistikleri
const haftalikVeriler = [
  { gun: 'Pazartesi', randevuSayisi: 28, tamamlanan: 25, iptal: 3 },
  { gun: 'Salı', randevuSayisi: 32, tamamlanan: 30, iptal: 2 },
  { gun: 'Çarşamba', randevuSayisi: 35, tamamlanan: 33, iptal: 2 },
  { gun: 'Perşembe', randevuSayisi: 29, tamamlanan: 27, iptal: 2 },
  { gun: 'Cuma', randevuSayisi: 31, tamamlanan: 28, iptal: 3 },
  { gun: 'Cumartesi', randevuSayisi: 18, tamamlanan: 16, iptal: 2 },
  { gun: 'Pazar', randevuSayisi: 12, tamamlanan: 11, iptal: 1 }
];

const aylıkVeriler = [
  { ay: 'Ocak', randevuSayisi: 520, gelir: 78000 },
  { ay: 'Şubat', randevuSayisi: 485, gelir: 72750 },
  { ay: 'Mart', randevuSayisi: 612, gelir: 91800 },
  { ay: 'Nisan', randevuSayisi: 568, gelir: 85200 },
  { ay: 'Mayıs', randevuSayisi: 634, gelir: 95100 },
  { ay: 'Haziran', randevuSayisi: 598, gelir: 89700 }
];

const uzmanlikVerileri = [
  { uzmanlik: 'Kardiyoloji', randevuSayisi: 148, oran: 25 },
  { uzmanlik: 'Nöroloji', randevuSayisi: 126, oran: 21 },
  { uzmanlik: 'Ortopedi', randevuSayisi: 135, oran: 23 },
  { uzmanlik: 'Göz Hastalıkları', randevuSayisi: 89, oran: 15 },
  { uzmanlik: 'Diğer', randevuSayisi: 95, oran: 16 }
];

const RaporlamaGrafigi: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('haftalik');

  const getMaxValue = (data: any[], key: string) => {
    return Math.max(...data.map(item => item[key]));
  };

  const renderHaftalikGrafik = () => {
    const maxValue = getMaxValue(haftalikVeriler, 'randevuSayisi');
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          📊 Haftalık Randevu Dağılımı
        </Typography>
        <Stack spacing={2}>
          {haftalikVeriler.map((gün, index) => (
            <Box key={index}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 80 }}>
                  {gün.gun}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip 
                    label={`${gün.randevuSayisi} toplam`} 
                    size="small" 
                    color="primary" 
                  />
                  <Chip 
                    label={`${gün.tamamlanan} tamamlandı`} 
                    size="small" 
                    color="success" 
                    variant="outlined"
                  />
                  <Chip 
                    label={`${gün.iptal} iptal`} 
                    size="small" 
                    color="error" 
                    variant="outlined"
                  />
                </Stack>
              </Stack>
              
              {/* Bar Grafiği */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ flex: 1, position: 'relative' }}>
                  {/* Arka Plan Bar */}
                  <Box sx={{ 
                    width: '100%', 
                    height: 20, 
                    bgcolor: 'grey.200', 
                    borderRadius: 1 
                  }} />
                  
                  {/* Tamamlanan Bar */}
                  <Box sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${(gün.tamamlanan / maxValue) * 100}%`,
                    height: 20,
                    bgcolor: 'success.main',
                    borderRadius: 1,
                    transition: 'width 0.5s ease'
                  }} />
                  
                  {/* İptal Bar */}
                  <Box sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: `${(gün.tamamlanan / maxValue) * 100}%`,
                    width: `${(gün.iptal / maxValue) * 100}%`,
                    height: 20,
                    bgcolor: 'error.main',
                    borderRadius: 1,
                    transition: 'width 0.5s ease'
                  }} />
                </Box>
                
                <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'right' }}>
                  {gün.randevuSayisi}
                </Typography>
              </Box>
            </Box>
          ))}
          
          {/* Özet */}
          <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', mt: 2 }}>
            <Stack direction="row" justifyContent="space-around" alignItems="center">
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold">
                  {haftalikVeriler.reduce((acc, gün) => acc + gün.randevuSayisi, 0)}
                </Typography>
                <Typography variant="body2">Toplam Randevu</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold">
                  {haftalikVeriler.reduce((acc, gün) => acc + gün.tamamlanan, 0)}
                </Typography>
                <Typography variant="body2">Tamamlanan</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold">
                  {haftalikVeriler.reduce((acc, gün) => acc + gün.iptal, 0)}
                </Typography>
                <Typography variant="body2">İptal</Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    );
  };

  const renderAylikGrafik = () => {
    const maxRandevu = getMaxValue(aylıkVeriler, 'randevuSayisi');
    const maxGelir = getMaxValue(aylıkVeriler, 'gelir');
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          📈 Aylık Performans Analizi
        </Typography>
        <Stack spacing={2}>
          {aylıkVeriler.map((ay, index) => (
            <Box key={index}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 80 }}>
                  {ay.ay}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip 
                    label={`${ay.randevuSayisi} randevu`} 
                    size="small" 
                    color="info" 
                  />
                  <Chip 
                    label={`${ay.gelir.toLocaleString('tr-TR')} ₺`} 
                    size="small" 
                    color="success" 
                  />
                </Stack>
              </Stack>
              
              {/* Randevu Bar */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="textSecondary">Randevu Sayısı</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ 
                      width: '100%', 
                      height: 12, 
                      bgcolor: 'grey.200', 
                      borderRadius: 1 
                    }} />
                    <Box sx={{ 
                      position: 'relative',
                      top: -12,
                      width: `${(ay.randevuSayisi / maxRandevu) * 100}%`,
                      height: 12,
                      bgcolor: 'info.main',
                      borderRadius: 1,
                      transition: 'width 0.5s ease'
                    }} />
                  </Box>
                  <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
                    {ay.randevuSayisi}
                  </Typography>
                </Box>
              </Box>
              
              {/* Gelir Bar */}
              <Box>
                <Typography variant="caption" color="textSecondary">Gelir (₺)</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ 
                      width: '100%', 
                      height: 12, 
                      bgcolor: 'grey.200', 
                      borderRadius: 1 
                    }} />
                    <Box sx={{ 
                      position: 'relative',
                      top: -12,
                      width: `${(ay.gelir / maxGelir) * 100}%`,
                      height: 12,
                      bgcolor: 'success.main',
                      borderRadius: 1,
                      transition: 'width 0.5s ease'
                    }} />
                  </Box>
                  <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'right' }}>
                    {ay.gelir.toLocaleString('tr-TR')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    );
  };

  const renderUzmanlikGrafik = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          🏥 Uzmanlık Dağılımı
        </Typography>
        <Stack spacing={2}>
          {uzmanlikVerileri.map((uzmanlik, index) => (
            <Box key={index}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {uzmanlik.uzmanlik}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="textSecondary">
                    %{uzmanlik.oran}
                  </Typography>
                  <Chip 
                    label={`${uzmanlik.randevuSayisi} randevu`} 
                    size="small" 
                    color="secondary" 
                    variant="outlined"
                  />
                </Stack>
              </Stack>
              
              {/* Daire Grafiği Benzeri Bar */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ 
                    width: '100%', 
                    height: 16, 
                    bgcolor: 'grey.200', 
                    borderRadius: 2 
                  }} />
                  <Box sx={{ 
                    position: 'relative',
                    top: -16,
                    width: `${uzmanlik.oran}%`,
                    height: 16,
                    bgcolor: `hsl(${index * 60}, 70%, 50%)`,
                    borderRadius: 2,
                    transition: 'width 0.5s ease'
                  }} />
                </Box>
                <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 40, textAlign: 'right' }}>
                  %{uzmanlik.oran}
                </Typography>
              </Box>
            </Box>
          ))}
          
          {/* Toplam */}
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color="primary">
              Toplam
            </Typography>
            <Chip 
              label={`${uzmanlikVerileri.reduce((acc, u) => acc + u.randevuSayisi, 0)} randevu`} 
              color="primary"
            />
          </Stack>
        </Stack>
      </Box>
    );
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              📊 Raporlama ve Analitik
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Randevu istatistikleri ve performans analizleri
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Rapor Tipi</InputLabel>
            <Select
              value={selectedReport}
              label="Rapor Tipi"
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              <MenuItem value="haftalik">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarToday sx={{ fontSize: 16 }} />
                  <span>Haftalık</span>
                </Stack>
              </MenuItem>
              <MenuItem value="aylik">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TrendingUp sx={{ fontSize: 16 }} />
                  <span>Aylık</span>
                </Stack>
              </MenuItem>
              <MenuItem value="uzmanlik">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Assessment sx={{ fontSize: 16 }} />
                  <span>Uzmanlık</span>
                </Stack>
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Rapor İçeriği */}
        <Box sx={{ mt: 2 }}>
          {selectedReport === 'haftalik' && renderHaftalikGrafik()}
          {selectedReport === 'aylik' && renderAylikGrafik()}
          {selectedReport === 'uzmanlik' && renderUzmanlikGrafik()}
        </Box>

        {/* Genel İstatistikler */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            🎯 Genel İstatistikler
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                185
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Bu Hafta Randevu
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                92%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Tamamlanma Oranı
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                27.5K ₺
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Haftalık Gelir
              </Typography>
            </Paper>
          </Stack>
        </Box>

        {/* Bilgilendirme */}
        <Alert severity="info" sx={{ mt: 3 }} icon={<ShowChart />}>
          <Typography variant="subtitle2" gutterBottom>
            💡 Rapor Bilgileri
          </Typography>
          <Typography variant="body2">
            Tüm veriler gerçek zamanlı olarak güncellenmektedir. 
            Grafiklerdeki renkli barlar randevu yoğunluğunu ve performansı göstermektedir.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default RaporlamaGrafigi; 