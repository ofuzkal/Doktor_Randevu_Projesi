// Validation utility functions

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Email validasyonu
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email adresi gereklidir');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Geçerli bir email adresi giriniz');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Şifre validasyonu
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Şifre gereklidir');
  } else {
    if (password.length < 6) {
      errors.push('Şifre en az 6 karakter olmalıdır');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Şifre en az bir küçük harf içermelidir');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Şifre en az bir rakam içermelidir');
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

// TC Kimlik No validasyonu
export const validateTcKimlik = (tcKimlik: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!tcKimlik) {
    errors.push('TC Kimlik No gereklidir');
  } else if (!/^\d{11}$/.test(tcKimlik)) {
    errors.push('TC Kimlik No 11 haneli olmalıdır');
  } else if (tcKimlik[0] === '0') {
    errors.push('TC Kimlik No 0 ile başlayamaz');
  } else {
    // TC Kimlik No algoritma kontrolü
    const digits = tcKimlik.split('').map(Number);
    const sum1 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
    const checkDigit1 = (sum1 * 7 - sum2) % 10;
    const checkDigit2 = (sum1 + sum2 + digits[9]) % 10;
    
    if (checkDigit1 !== digits[9] || checkDigit2 !== digits[10]) {
      errors.push('Geçersiz TC Kimlik No');
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

// Telefon validasyonu
export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!phone) {
    errors.push('Telefon numarası gereklidir');
  } else if (!/^(\+90|0)?5\d{9}$/.test(phone.replace(/\s/g, ''))) {
    errors.push('Geçerli bir Türkiye telefon numarası giriniz (05XXXXXXXXX)');
  }
  
  return { isValid: errors.length === 0, errors };
};

// İsim validasyonu
export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('İsim gereklidir');
  } else if (name.trim().length < 2) {
    errors.push('İsim en az 2 karakter olmalıdır');
  } else if (!/^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+$/.test(name)) {
    errors.push('İsim sadece harf ve boşluk içerebilir');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Doğum tarihi validasyonu
export const validateBirthDate = (birthDate: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!birthDate) {
    errors.push('Doğum tarihi gereklidir');
  } else {
    const date = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    
    if (isNaN(date.getTime())) {
      errors.push('Geçerli bir tarih giriniz');
    } else if (date > today) {
      errors.push('Doğum tarihi gelecekte olamaz');
    } else if (age < 0 || age > 120) {
      errors.push('Geçerli bir doğum tarihi giriniz');
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

// Randevu tarihi validasyonu
export const validateAppointmentDate = (appointmentDate: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!appointmentDate) {
    errors.push('Randevu tarihi gereklidir');
  } else {
    const date = new Date(appointmentDate);
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 3); // 3 ay sonrasına kadar
    
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (isNaN(date.getTime())) {
      errors.push('Geçerli bir tarih giriniz');
    } else if (date < today) {
      errors.push('Randevu tarihi geçmişte olamaz');
    } else if (date > maxDate) {
      errors.push('Randevu tarihi en fazla 3 ay sonrası olabilir');
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

// Randevu saati validasyonu
export const validateAppointmentTime = (time: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!time) {
    errors.push('Randevu saati gereklidir');
  } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    errors.push('Geçerli bir saat formatı giriniz (HH:MM)');
  } else {
    const [hours, minutes] = time.split(':').map(Number);
    
    // Çalışma saatleri kontrolü (08:00 - 18:00)
    if (hours < 8 || hours > 18 || (hours === 18 && minutes > 0)) {
      errors.push('Randevu saati çalışma saatleri içinde olmalıdır (08:00-18:00)');
    }
    
    // 30 dakika aralıklarla randevu kontrolü
    if (minutes !== 0 && minutes !== 30) {
      errors.push('Randevu saatleri 30 dakika aralıklarla olmalıdır');
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

// Genel form validasyonu
export const validateForm = (fields: Record<string, any>, rules: Record<string, (value: any) => ValidationResult>): ValidationResult => {
  const allErrors: string[] = [];
  
  Object.keys(rules).forEach(fieldName => {
    const value = fields[fieldName];
    const validation = rules[fieldName](value);
    
    if (!validation.isValid) {
      allErrors.push(...validation.errors);
    }
  });
  
  return { isValid: allErrors.length === 0, errors: allErrors };
};

// Hasta kayıt formu validasyonu
export const validatePatientRegistration = (data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  tcKimlik: string;
  dogumTarihi: string;
}): ValidationResult => {
  return validateForm(data, {
    name: validateName,
    email: validateEmail,
    password: validatePassword,
    phone: validatePhone,
    tcKimlik: validateTcKimlik,
    dogumTarihi: validateBirthDate,
  });
};

// Randevu formu validasyonu
export const validateAppointmentForm = (data: {
  doktorId: number;
  tarih: string;
  saat: string;
  notlar?: string;
}): ValidationResult => {
  const errors: string[] = [];
  
  if (!data.doktorId) {
    errors.push('Doktor seçimi gereklidir');
  }
  
  const dateValidation = validateAppointmentDate(data.tarih);
  if (!dateValidation.isValid) {
    errors.push(...dateValidation.errors);
  }
  
  const timeValidation = validateAppointmentTime(data.saat);
  if (!timeValidation.isValid) {
    errors.push(...timeValidation.errors);
  }
  
  if (data.notlar && data.notlar.length > 500) {
    errors.push('Notlar 500 karakterden fazla olamaz');
  }
  
  return { isValid: errors.length === 0, errors };
}; 