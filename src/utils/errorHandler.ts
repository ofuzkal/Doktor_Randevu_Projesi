// Error handling utilities

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Hata tipleri
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  APPOINTMENT_CONFLICT = 'APPOINTMENT_CONFLICT',
  DOCTOR_UNAVAILABLE = 'DOCTOR_UNAVAILABLE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Kullanıcı dostu hata mesajları
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.NETWORK_ERROR]: 'İnternet bağlantınızı kontrol edin',
  [ErrorCode.AUTHENTICATION_ERROR]: 'Giriş bilgilerinizi kontrol edin',
  [ErrorCode.AUTHORIZATION_ERROR]: 'Bu işlem için yetkiniz bulunmamaktadır',
  [ErrorCode.VALIDATION_ERROR]: 'Lütfen form bilgilerini kontrol edin',
  [ErrorCode.NOT_FOUND_ERROR]: 'Aranan kayıt bulunamadı',
  [ErrorCode.SERVER_ERROR]: 'Sunucu hatası oluştu, lütfen tekrar deneyin',
  [ErrorCode.APPOINTMENT_CONFLICT]: 'Bu randevu saati dolu, başka bir saat seçin',
  [ErrorCode.DOCTOR_UNAVAILABLE]: 'Doktor bu tarihte müsait değil',
  [ErrorCode.UNKNOWN_ERROR]: 'Beklenmeyen bir hata oluştu'
};

// API hatalarını çözümleme
export const parseApiError = (error: any): AppError => {
  const timestamp = new Date();
  
  // Network hatası
  if (!navigator.onLine) {
    return {
      code: ErrorCode.NETWORK_ERROR,
      message: ERROR_MESSAGES[ErrorCode.NETWORK_ERROR],
      timestamp
    };
  }
  
  // RTK Query hatası
  if (error?.status) {
    switch (error.status) {
      case 401:
        return {
          code: ErrorCode.AUTHENTICATION_ERROR,
          message: ERROR_MESSAGES[ErrorCode.AUTHENTICATION_ERROR],
          details: error.data,
          timestamp
        };
      case 403:
        return {
          code: ErrorCode.AUTHORIZATION_ERROR,
          message: ERROR_MESSAGES[ErrorCode.AUTHORIZATION_ERROR],
          details: error.data,
          timestamp
        };
      case 404:
        return {
          code: ErrorCode.NOT_FOUND_ERROR,
          message: ERROR_MESSAGES[ErrorCode.NOT_FOUND_ERROR],
          details: error.data,
          timestamp
        };
      case 422:
        return {
          code: ErrorCode.VALIDATION_ERROR,
          message: error.data?.message || ERROR_MESSAGES[ErrorCode.VALIDATION_ERROR],
          details: error.data,
          timestamp
        };
      case 409:
        return {
          code: ErrorCode.APPOINTMENT_CONFLICT,
          message: ERROR_MESSAGES[ErrorCode.APPOINTMENT_CONFLICT],
          details: error.data,
          timestamp
        };
      case 500:
      case 502:
      case 503:
        return {
          code: ErrorCode.SERVER_ERROR,
          message: ERROR_MESSAGES[ErrorCode.SERVER_ERROR],
          details: error.data,
          timestamp
        };
      default:
        return {
          code: ErrorCode.UNKNOWN_ERROR,
          message: error.data?.message || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
          details: error.data,
          timestamp
        };
    }
  }
  
  // JavaScript hatası
  if (error instanceof Error) {
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error.message || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
      details: { stack: error.stack },
      timestamp
    };
  }
  
  // Bilinmeyen hata
  return {
    code: ErrorCode.UNKNOWN_ERROR,
    message: ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
    details: error,
    timestamp
  };
};

// Hata bildirimi için utility
export const notifyError = (error: AppError): void => {
  console.error('Error occurred:', {
    code: error.code,
    message: error.message,
    details: error.details,
    timestamp: error.timestamp
  });
  
  // Geliştirme ortamında detaylı log
  if (process.env.NODE_ENV === 'development') {
    console.group('🔴 Error Details');
    console.log('Code:', error.code);
    console.log('Message:', error.message);
    console.log('Timestamp:', error.timestamp);
    if (error.details) {
      console.log('Details:', error.details);
    }
    console.groupEnd();
  }
};

// Retry logic için utility
export const shouldRetry = (error: AppError, attemptCount: number = 0): boolean => {
  // Maksimum 3 deneme
  if (attemptCount >= 3) return false;
  
  // Yeniden deneme yapılabilir hatalar
  const retryableErrors = [
    ErrorCode.NETWORK_ERROR,
    ErrorCode.SERVER_ERROR
  ];
  
  return retryableErrors.includes(error.code as ErrorCode);
};

// Retry delay hesaplama (exponential backoff)
export const getRetryDelay = (attemptCount: number): number => {
  return Math.min(1000 * Math.pow(2, attemptCount), 10000); // Maksimum 10 saniye
};

// Hata mesajını kullanıcı dostu formata çevirme
export const formatErrorMessage = (error: any): string => {
  const appError = parseApiError(error);
  return appError.message;
};

// Randevu çakışması kontrolü
export const checkAppointmentConflict = (
  newAppointment: { tarih: string; saat: string; doktorId: number },
  existingAppointments: Array<{ tarih: string; saat: string; doktorId: number; durum: string }>
): boolean => {
  return existingAppointments.some(appointment => 
    appointment.doktorId === newAppointment.doktorId &&
    appointment.tarih === newAppointment.tarih &&
    appointment.saat === newAppointment.saat &&
    appointment.durum !== 'İptal'
  );
};

// Doktor müsaitlik kontrolü
export const checkDoctorAvailability = (
  doctorSchedule: Record<string, string[]>,
  appointmentDate: string,
  appointmentTime: string
): boolean => {
  const date = new Date(appointmentDate);
  const dayNames = ['pazar', 'pazartesi', 'sali', 'carsamba', 'persembe', 'cuma', 'cumartesi'];
  const dayName = dayNames[date.getDay()];
  
  const availableTimes = doctorSchedule[dayName] || [];
  return availableTimes.includes(appointmentTime);
};

// Global error handler
export const setupGlobalErrorHandler = (): void => {
  // Yakalanmamış hatalar için
  window.addEventListener('error', (event) => {
    const error = parseApiError(event.error);
    notifyError(error);
  });
  
  // Promise rejection'ları için
  window.addEventListener('unhandledrejection', (event) => {
    const error = parseApiError(event.reason);
    notifyError(error);
    event.preventDefault(); // Console'da gösterilmesini engelle
  });
};

// API response wrapper'ı
export const handleApiResponse = async <T>(
  apiCall: () => Promise<T>,
  retryCount: number = 0
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    const appError = parseApiError(error);
    notifyError(appError);
    
    // Retry logic
    if (shouldRetry(appError, retryCount)) {
      const delay = getRetryDelay(retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      return handleApiResponse(apiCall, retryCount + 1);
    }
    
    throw appError;
  }
}; 