import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  Tabs,
  Tab,
  Alert,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Lock,
  DateRange,
  LocationOn
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
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const HastaAuthForms: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tcKimlik: '',
    dogumTarihi: '',
    cinsiyet: '',
    kanGrubu: '',
    adres: '',
    password: '',
    confirmPassword: ''
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', loginData);
    // TODO: Implement login logic
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Şifreler eşleşmiyor!');
      return;
    }
    console.log('Register attempt:', registerData);
    // TODO: Implement register logic
  };

  return (
    <Card sx={{ 
      maxWidth: { xs: '100%', sm: 600 }, 
      mx: 'auto',
      my: { xs: 1, sm: 2 }
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="auth tabs"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontSize: { xs: '0.9rem', sm: '1rem' },
                minHeight: { xs: 44, sm: 48 }
              }
            }}
          >
            <Tab label="Giriş Yap" />
            <Tab label="Kayıt Ol" />
          </Tabs>
        </Box>

        {/* Login Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleLoginSubmit}>
            <Typography 
              variant="h5" 
              gutterBottom 
              align="center"
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
              👨‍⚕️ Hasta Girişi
            </Typography>
            <Typography 
              variant="body2" 
              color="textSecondary" 
              align="center" 
              sx={{ 
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                px: { xs: 1, sm: 0 }
              }}
            >
              Randevu alabilmek için giriş yapın
            </Typography>

            <Stack spacing={{ xs: 2, sm: 3 }}>
              <TextField
                fullWidth
                label="E-posta"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                required
              />

              <TextField
                fullWidth
                label="Şifre"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ 
                  py: { xs: 1.2, sm: 1.5 },
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                Giriş Yap
              </Button>

              <Divider>veya</Divider>

              <Alert severity="info">
                Demo: Üstteki kullanıcı seçim butonlarını kullanarak hızlı giriş yapabilirsiniz.
              </Alert>
            </Stack>
          </Box>
        </TabPanel>

        {/* Register Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box component="form" onSubmit={handleRegisterSubmit}>
            <Typography variant="h5" gutterBottom align="center">
              📝 Hasta Kaydı
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
              Yeni hasta hesabı oluşturun
            </Typography>

            <Stack spacing={3}>
              {/* Kişisel Bilgiler */}
              <Typography variant="h6" color="primary">
                Kişisel Bilgiler
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Ad"
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  required
                />
                <TextField
                  fullWidth
                  label="Soyad"
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                  required
                />
              </Stack>

              <TextField
                fullWidth
                label="TC Kimlik No"
                value={registerData.tcKimlik}
                onChange={(e) => setRegisterData({ ...registerData, tcKimlik: e.target.value })}
                placeholder="11 haneli TC kimlik numaranız"
                inputProps={{ maxLength: 11 }}
                required
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Doğum Tarihi"
                  type="date"
                  value={registerData.dogumTarihi}
                  onChange={(e) => setRegisterData({ ...registerData, dogumTarihi: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRange />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                
                <FormControl fullWidth required>
                  <InputLabel>Cinsiyet</InputLabel>
                  <Select
                    value={registerData.cinsiyet}
                    label="Cinsiyet"
                    onChange={(e) => setRegisterData({ ...registerData, cinsiyet: e.target.value })}
                  >
                    <MenuItem value="Erkek">Erkek</MenuItem>
                    <MenuItem value="Kadın">Kadın</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <FormControl fullWidth>
                <InputLabel>Kan Grubu</InputLabel>
                <Select
                  value={registerData.kanGrubu}
                  label="Kan Grubu"
                  onChange={(e) => setRegisterData({ ...registerData, kanGrubu: e.target.value })}
                >
                  <MenuItem value="A+">A Rh+</MenuItem>
                  <MenuItem value="A-">A Rh-</MenuItem>
                  <MenuItem value="B+">B Rh+</MenuItem>
                  <MenuItem value="B-">B Rh-</MenuItem>
                  <MenuItem value="AB+">AB Rh+</MenuItem>
                  <MenuItem value="AB-">AB Rh-</MenuItem>
                  <MenuItem value="O+">O Rh+</MenuItem>
                  <MenuItem value="O-">O Rh-</MenuItem>
                </Select>
              </FormControl>

              {/* İletişim Bilgileri */}
              <Typography variant="h6" color="primary">
                İletişim Bilgileri
              </Typography>

              <TextField
                fullWidth
                label="E-posta"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                required
              />

              <TextField
                fullWidth
                label="Telefon"
                value={registerData.phone}
                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                placeholder="05XX XXX XX XX"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
                required
              />

              <TextField
                fullWidth
                label="Adres"
                multiline
                rows={2}
                value={registerData.adres}
                onChange={(e) => setRegisterData({ ...registerData, adres: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
                required
              />

              {/* Şifre */}
              <Typography variant="h6" color="primary">
                Güvenlik
              </Typography>

              <TextField
                fullWidth
                label="Şifre"
                type={showPassword ? 'text' : 'password'}
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />

              <TextField
                fullWidth
                label="Şifre Tekrar"
                type={showConfirmPassword ? 'text' : 'password'}
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Kayıt Ol
              </Button>
            </Stack>
          </Box>
        </TabPanel>
      </CardContent>
    </Card>
  );
};

export default HastaAuthForms; 