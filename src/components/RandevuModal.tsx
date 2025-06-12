import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Box,
  Alert,
  Avatar,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Stack
} from '@mui/material';
import {
  Close,
  Person,
  LocalHospital,
  CheckCircle
} from '@mui/icons-material';

import { 
  useGetDoktorlarQuery, 
  useGetRandevuTurleriQuery,
  useAddRandevuMutation,
  useGetRandevularQuery,
  Doktor,
  RandevuTuru 
} from '../store/apiSlice';
import { useAppSelector } from '../store/store';
import { selectUser } from '../store/userSlice';
import { validateAppointmentForm } from '../utils/validation';
import { formatErrorMessage, checkDoctorAvailability, checkAppointmentConflict } from '../utils/errorHandler';

interface RandevuModalProps {
  open: boolean;
  onClose: () => void;
  selectedDoktor?: Doktor | null;
}

const RandevuModal: React.FC<RandevuModalProps> = ({ open, onClose, selectedDoktor }) => {
  const user = useAppSelector(selectUser);
  const [addRandevu, { isLoading }] = useAddRandevuMutation();
  
  const { data: doktorlar = [], isLoading: doktorlarLoading } = useGetDoktorlarQuery();
  const { data: randevuTurleri = [] } = useGetRandevuTurleriQuery();
  const { data: mevcutRandevular = [] } = useGetRandevularQuery();
  
  // Form state
  const [selectedDoktorId, setSelectedDoktorId] = useState<number | ''>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [randevuTuru, setRandevuTuru] = useState<string>('');
  const [notlar, setNotlar] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // Selected doctor info
  const [selectedDoctorInfo, setSelectedDoctorInfo] = useState<Doktor | null>(null);

  // Initialize selected doctor
  useEffect(() => {
    if (selectedDoktor) {
      setSelectedDoktorId(selectedDoktor.id);
      setSelectedDoctorInfo(selectedDoktor);
    }
  }, [selectedDoktor]);

  // Update selected doctor info when selection changes
  useEffect(() => {
    if (selectedDoktorId && doktorlar.length > 0) {
      const doctor = doktorlar.find(d => d.id === selectedDoktorId);
      setSelectedDoctorInfo(doctor || null);
    } else {
      setSelectedDoctorInfo(null);
    }
  }, [selectedDoktorId, doktorlar]);

  // Get available time slots for selected doctor and date
  const getAvailableTimeSlots = (): string[] => {
    if (!selectedDoctorInfo || !selectedDate) return [];

    const date = new Date(selectedDate);
    const dayNames = ['pazar', 'pazartesi', 'sali', 'carsamba', 'persembe', 'cuma', 'cumartesi'];
    const dayName = dayNames[date.getDay()];
    const availableTimes = selectedDoctorInfo.musaitlik[dayName as keyof typeof selectedDoctorInfo.musaitlik] || [];

    // Filter out already booked appointments
    const bookedTimes = mevcutRandevular
      .filter(r => 
        r.doktorId === selectedDoktorId && 
        r.tarih === selectedDate && 
        r.durum !== 'İptal'
      )
      .map(r => r.saat);

    return availableTimes.filter(time => !bookedTimes.includes(time));
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!user.isAuthenticated) {
      setError('Randevu almak için giriş yapmalısınız');
      return;
    }

    // Form validation
    const formData = {
      doktorId: Number(selectedDoktorId),
      tarih: selectedDate,
      saat: selectedTime,
      notlar
    };

    const validation = validateAppointmentForm(formData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    // Check doctor availability
    if (selectedDoctorInfo && !checkDoctorAvailability(
      selectedDoctorInfo.musaitlik,
      formData.tarih,
      formData.saat
    )) {
      setError('Doktor seçilen tarih ve saatte müsait değil');
      return;
    }

    // Check appointment conflicts
    if (checkAppointmentConflict(
      { tarih: formData.tarih, saat: formData.saat, doktorId: formData.doktorId },
      mevcutRandevular
    )) {
      setError('Bu randevu saati dolu, başka bir saat seçin');
      return;
    }

    try {
      await addRandevu({
        hastaId: Number(user.id),
        doktorId: formData.doktorId,
        tarih: formData.tarih,
        saat: formData.saat,
        randevuTuru: randevuTuru || 'Muayene',
        ucret: selectedDoctorInfo?.randevuUcreti || 0,
        notlar: formData.notlar || `${selectedDoctorInfo?.uzmanlik} randevusu`
      }).unwrap();

      setSuccess('Randevu başarıyla oluşturuldu! Doktor onayını bekliyor.');
      
      // Clear form after successful submission
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);

    } catch (error) {
      setError(formatErrorMessage(error));
    }
  };

  const resetForm = () => {
    if (!selectedDoktor) {
      setSelectedDoktorId('');
    }
    setSelectedDate('');
    setSelectedTime('');
    setRandevuTuru('');
    setNotlar('');
    setError('');
    setSuccess('');
    setSelectedDoctorInfo(selectedDoktor || null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  const availableTimeSlots = getAvailableTimeSlots();

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        color: 'white',
        position: 'relative',
        textAlign: 'center'
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
          <Close />
        </IconButton>
        
        <Typography variant="h5" fontWeight="bold">
          Randevu Al
        </Typography>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        {isLoading && <LinearProgress sx={{ mb: 2 }} />}
        
        {/* Error/Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Doctor Selection */}
          <TextField
            select
            fullWidth
            label="Doktor Seçin"
            value={selectedDoktorId}
            onChange={(e) => setSelectedDoktorId(Number(e.target.value))}
            disabled={!!selectedDoktor}
            variant="outlined"
          >
            {doktorlar.map((doktor) => (
              <MenuItem key={doktor.id} value={doktor.id}>
                <Box display="flex" alignItems="center" width="100%">
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">
                      {doktor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doktor.uzmanlik} - ₺{doktor.randevuUcreti}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {/* Date Selection */}
            <TextField
              fullWidth
              type="date"
              label="Randevu Tarihi"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime(''); // Reset time when date changes
              }}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: getMinDate(),
                max: getMaxDate()
              }}
              variant="outlined"
            />

            {/* Time Selection */}
            <TextField
              select
              fullWidth
              label="Randevu Saati"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={!selectedDate || availableTimeSlots.length === 0}
              variant="outlined"
            >
              {availableTimeSlots.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Appointment Type */}
          <TextField
            select
            fullWidth
            label="Randevu Türü"
            value={randevuTuru}
            onChange={(e) => setRandevuTuru(e.target.value)}
            variant="outlined"
          >
            {randevuTurleri.map((tur) => (
              <MenuItem key={tur.id} value={tur.name}>
                {tur.name} - {tur.aciklama}
              </MenuItem>
            ))}
          </TextField>

          {/* Notes */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notlar (Opsiyonel)"
            value={notlar}
            onChange={(e) => setNotlar(e.target.value)}
            variant="outlined"
            placeholder="Randevu ile ilgili özel notlarınızı yazabilirsiniz..."
          />

          {/* Selected Doctor Info */}
          {selectedDoctorInfo && (
            <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    <LocalHospital />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="primary.main">
                      {selectedDoctorInfo.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedDoctorInfo.uzmanlik}
                    </Typography>
                    <Typography variant="body2" color="primary.main" fontWeight="bold">
                      Ücret: ₺{selectedDoctorInfo.randevuUcreti}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} variant="outlined">
          İptal
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!selectedDoktorId || !selectedDate || !selectedTime || isLoading}
          startIcon={<CheckCircle />}
        >
          Randevu Al
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RandevuModal; 