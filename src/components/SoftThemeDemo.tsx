import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Alert,
  Badge,
  IconButton,
  Avatar,
  Paper
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Info,
  Notifications,
  Person
} from '@mui/icons-material';

const SoftThemeDemo: React.FC = () => {
  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          🎨 Modern Soft Renk Paleti
        </Typography>

        {/* Status Badges */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Durum Rozetleri (Soft Colors)
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            <Chip label="Başarılı" color="success" />
            <Chip label="Uyarı" color="warning" />
            <Chip label="Hata" color="error" />
            <Chip label="Bilgi" color="info" />
            <Chip label="Ana Renk" color="primary" />
            <Chip label="İkinci Renk" color="secondary" />
          </Stack>
        </Box>

        {/* Outlined Badges */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Çerçeveli Rozetler
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            <Chip label="Başarılı" color="success" variant="outlined" />
            <Chip label="Uyarı" color="warning" variant="outlined" />
            <Chip label="Hata" color="error" variant="outlined" />
            <Chip label="Bilgi" color="info" variant="outlined" />
            <Chip label="Ana Renk" color="primary" variant="outlined" />
            <Chip label="İkinci Renk" color="secondary" variant="outlined" />
          </Stack>
        </Box>

        {/* Modern Alerts */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Modern Alert Bileşenleri
          </Typography>
          <Stack spacing={2}>
            <Alert severity="success" icon={<CheckCircle />}>
              Bu bir başarı mesajıdır. Soft yeşil renkler kullanılmıştır.
            </Alert>
            <Alert severity="warning" icon={<Warning />}>
              Bu bir uyarı mesajıdır. Yumuşak amber tonlar kullanılmıştır.
            </Alert>
            <Alert severity="error" icon={<Error />}>
              Bu bir hata mesajıdır. Pastel kırmızı tonlar kullanılmıştır.
            </Alert>
            <Alert severity="info" icon={<Info />}>
              Bu bir bilgi mesajıdır. Soft mavi renkler kullanılmıştır.
            </Alert>
          </Stack>
        </Box>

        {/* Buttons with Hover Effects */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Hover Efektli Butonlar
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
            <Button variant="contained" color="primary">
              Ana Buton
            </Button>
            <Button variant="contained" color="success">
              Başarı Butonu
            </Button>
            <Button variant="contained" color="warning">
              Uyarı Butonu
            </Button>
            <Button variant="contained" color="error">
              Hata Butonu
            </Button>
            <Button variant="outlined" color="primary">
              Çerçeveli Buton
            </Button>
            <Button variant="outlined" color="info">
              Bilgi Butonu
            </Button>
          </Stack>
        </Box>

        {/* Badges and Avatars */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Badge ve Avatar Bileşenleri
          </Typography>
          <Stack direction="row" spacing={3} alignItems="center">
            <Badge badgeContent={4} color="error">
              <IconButton>
                <Notifications />
              </IconButton>
            </Badge>
            <Badge badgeContent={12} color="warning">
              <IconButton>
                <Notifications />
              </IconButton>
            </Badge>
            <Badge badgeContent={99} color="success">
              <IconButton>
                <Notifications />
              </IconButton>
            </Badge>
            <Badge badgeContent={5} color="info">
              <IconButton>
                <Notifications />
              </IconButton>
            </Badge>
          </Stack>
        </Box>

        {/* Avatars */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Avatar Bileşenleri
          </Typography>
          <Stack direction="row" spacing={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Person />
            </Avatar>
            <Avatar sx={{ bgcolor: 'success.main' }}>
              AY
            </Avatar>
            <Avatar sx={{ bgcolor: 'warning.main' }}>
              MK
            </Avatar>
            <Avatar sx={{ bgcolor: 'error.main' }}>
              FS
            </Avatar>
            <Avatar sx={{ bgcolor: 'info.main' }}>
              <Person />
            </Avatar>
          </Stack>
        </Box>

        {/* Cards with Soft Shadows */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Yumuşak Gölgeli Kartlar
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 2
              }}
            >
              <Typography variant="body2" color="success.main">
                Başarı temalı kart
              </Typography>
            </Paper>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 2
              }}
            >
              <Typography variant="body2" color="warning.main">
                Uyarı temalı kart
              </Typography>
            </Paper>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 2
              }}
            >
              <Typography variant="body2" color="info.main">
                Bilgi temalı kart
              </Typography>
            </Paper>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SoftThemeDemo; 