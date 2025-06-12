import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  InputAdornment,
  Divider,
  Tooltip,
  Stack,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Close,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  PersonOutline,
  MedicalServices,
  AdminPanelSettings,
  Login as LoginIcon
} from '@mui/icons-material';
import { useAppDispatch } from '../store/store';
import { setUser, UserType } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../store/apiSlice';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  userType: UserType;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, userType }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const getUserTypeIcon = () => {
    switch (userType) {
      case 'hasta':
        return <PersonOutline sx={{ fontSize: 40, color: 'primary.main' }} />;
      case 'doktor':
        return <MedicalServices sx={{ fontSize: 40, color: 'success.main' }} />;
      case 'yonetici':
        return <AdminPanelSettings sx={{ fontSize: 40, color: 'warning.main' }} />;
      default:
        return <PersonOutline sx={{ fontSize: 40 }} />;
    }
  };

  const getUserTypeTitle = () => {
    const baseTitle = () => {
      switch (userType) {
        case 'hasta':
          return 'Hasta';
        case 'doktor':
          return 'Doktor';
        case 'yonetici':
          return 'Yönetici';
        default:
          return '';
      }
    };
    return `${baseTitle()} ${isRegisterMode ? 'Kayıt' : 'Giriş'}`;
  };

  const getUserTypeColor = () => {
    switch (userType) {
      case 'hasta':
        return 'primary';
      case 'doktor':
        return 'success';
      case 'yonetici':
        return 'warning';
      default:
        return 'primary';
    }
  };

  // Demo veriler
  const getDemoCredentials = () => {
    switch (userType) {
      case 'hasta':
        return { email: 'hasta@demo.com', password: 'hasta123' };
      case 'doktor':
        return { email: 'doktor@demo.com', password: 'doktor123' };
      case 'yonetici':
        return { email: 'admin@demo.com', password: 'admin123' };
      default:
        return { email: '', password: '' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Kayıt modunda şifre kontrolü
    if (isRegisterMode) {
      if (password !== confirmPassword) {
        setError('Şifreler eşleşmiyor!');
        return;
      }
      if (!fullName.trim()) {
        setError('Ad Soyad alanı zorunludur!');
        return;
      }
      
      // Kayıt işlemi (demo için sadece mesaj)
      setError('Kayıt sistemi henüz aktif değil. Demo hesapları kullanın.');
      return;
    }

    // Demo giriş kontrolü - API çağrısı yapmadan direkt demo hesapları kontrol et
    const demoCredentials = getDemoCredentials();
    if (email === demoCredentials.email && password === demoCredentials.password) {
      // Demo giriş başarılı
      const demoUser = {
        id: userType === 'hasta' ? '1' : userType === 'doktor' ? '2' : '3',
        name: userType === 'hasta' ? 'Demo Hasta' : userType === 'doktor' ? 'Dr. Demo Doktor' : 'Demo Yönetici',
        email: email,
        userType: userType
      };

      dispatch(setUser({
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        userType: demoUser.userType,
        isAuthenticated: true,
      }));

      onClose();
      resetForm();
      
      // Kullanıcı tipine göre yönlendirme
      switch (userType) {
        case 'hasta':
          navigate('/hastalar');
          break;
        case 'doktor':
          navigate('/doktorlar');
          break;
        case 'yonetici':
          navigate('/yonetici');
          break;
        default:
          navigate('/');
      }
      return;
    }

    // Demo bilgileri değilse API çağrısı yap
    try {
      const result = await login({ email, password }).unwrap();
      
      // Kullanıcı bilgilerini store'a kaydet
      dispatch(setUser({
        id: result.user.id.toString(),
        name: result.user.name,
        email: result.user.email,
        userType: result.userType,
        isAuthenticated: true,
      }));

      onClose();
      resetForm();
      
      // Kullanıcı tipine göre yönlendirme
      switch (result.userType) {
        case 'hasta':
          navigate('/hastalar');
          break;
        case 'doktor':
          navigate('/doktorlar');
          break;
        case 'yonetici':
          navigate('/yonetici');
          break;
        default:
          navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Geçersiz email veya şifre! Demo bilgilerini kullanın: ' + demoCredentials.email + ' / ' + demoCredentials.password);
    }
  };

  const handleDemoLogin = () => {
    const demoCredentials = getDemoCredentials();
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setError('');
    setShowPassword(false);
    setIsRegisterMode(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        textAlign: 'center', 
        pb: 2,
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        color: 'white',
        position: 'relative'
      }}>
        <IconButton
          onClick={handleClose}
          sx={{ 
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white'
          }}
        >
          <Tooltip title="Kapat">
            <Close />
          </Tooltip>
        </IconButton>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            width: 64, 
            height: 64,
            backdropFilter: 'blur(10px)'
          }}>
            {getUserTypeIcon()}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            {getUserTypeTitle()}
          </Typography>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 4, py: 3 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2, borderRadius: 2 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {/* Full Name Field (Register Mode) */}
          {isRegisterMode && (
            <TextField
              fullWidth
              label="Ad Soyad"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          )}

          {/* Email Field */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            label="Şifre"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <Tooltip title={showPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </Tooltip>
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Confirm Password Field (Register Mode) */}
          {isRegisterMode && (
            <TextField
              fullWidth
              label="Şifre Tekrar"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          )}
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 4, pb: 3, flexDirection: 'column', gap: 2 }}>
        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
          sx={{
            py: 1.5,
            borderRadius: 2,
            background: `linear-gradient(45deg, ${getUserTypeColor() === 'primary' ? '#2196F3' : getUserTypeColor() === 'success' ? '#4CAF50' : '#FF9800'} 30%, ${getUserTypeColor() === 'primary' ? '#21CBF3' : getUserTypeColor() === 'success' ? '#66BB6A' : '#FFB74D'} 90%)`,
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 10px 4px rgba(255, 105, 135, .3)',
            },
            transition: 'all 0.3s ease-in-out',
          }}
        >
          {isLoading ? 'Giriş yapılıyor...' : (isRegisterMode ? 'Kayıt Ol' : 'Giriş Yap')}
        </Button>

        {/* Demo Login Button */}
        {!isRegisterMode && (
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={handleDemoLogin}
            sx={{ 
              py: 1.5,
              borderRadius: 2,
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(33, 150, 243, 0.04)',
              }
            }}
          >
            Demo Bilgileri Doldur
          </Button>
        )}

        <Divider sx={{ width: '100%', my: 1 }} />

        {/* Toggle Register/Login */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {isRegisterMode ? 'Zaten hesabınız var mı?' : 'Hesabınız yok mu?'}
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError('');
            }}
            sx={{ 
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.main',
              }
            }}
          >
            {isRegisterMode ? 'Giriş Yap' : 'Kayıt Ol'}
          </Button>
        </Stack>

        {/* Demo Info */}
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          borderRadius: 2,
          border: '1px solid rgba(33, 150, 243, 0.2)'
        }}>
          <Typography variant="body2" color="primary.main" fontWeight="bold" gutterBottom>
            Demo Hesap Bilgileri:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Email:</strong> {getDemoCredentials().email}<br />
            <strong>Şifre:</strong> {getDemoCredentials().password}
          </Typography>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal; 