import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Kullanıcı tipleri
export type UserType = 'hasta' | 'doktor' | 'yonetici' | null;

// Kullanıcı bilgileri interface'i
export interface User {
  id: string | null;
  name: string | null;
  email: string | null;
  userType: UserType;
  isAuthenticated: boolean;
}

// Başlangıç state'i
const initialState: User = {
  id: null,
  name: null,
  email: null,
  userType: null,
  isAuthenticated: false,
};

// User slice'ı oluşturma
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Kullanıcı girişi
    loginUser: (state, action: PayloadAction<{ 
      id: string; 
      name: string; 
      email: string; 
      userType: UserType 
    }>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.userType = action.payload.userType;
      state.isAuthenticated = true;
    },

    // Kullanıcı bilgilerini set etme (API'den gelen veriler için)
    setUser: (state, action: PayloadAction<{ 
      id: string; 
      name: string; 
      email: string; 
      userType: UserType; 
      isAuthenticated: boolean;
    }>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.userType = action.payload.userType;
      state.isAuthenticated = action.payload.isAuthenticated;
    },

    // Kullanıcı çıkışı
    logoutUser: (state) => {
      state.id = null;
      state.name = null;
      state.email = null;
      state.userType = null;
      state.isAuthenticated = false;
    },

    // Kullanıcı tipini güncelleme
    updateUserType: (state, action: PayloadAction<UserType>) => {
      state.userType = action.payload;
    },

    // Kullanıcı profilini güncelleme
    updateUserProfile: (state, action: PayloadAction<{ 
      name?: string; 
      email?: string 
    }>) => {
      if (action.payload.name !== undefined) {
        state.name = action.payload.name;
      }
      if (action.payload.email !== undefined) {
        state.email = action.payload.email;
      }
    },

    // Demo kullanıcıları için hızlı giriş
    setDemoUser: (state, action: PayloadAction<UserType>) => {
      switch (action.payload) {
        case 'hasta':
          state.id = 'demo-hasta-001';
          state.name = 'Ahmet Yılmaz';
          state.email = 'ahmet.yilmaz@email.com';
          state.userType = 'hasta';
          state.isAuthenticated = true;
          break;
        case 'doktor':
          state.id = 'demo-doktor-001';
          state.name = 'Dr. Fatma Şahin';
          state.email = 'dr.fatma.sahin@hastane.com';
          state.userType = 'doktor';
          state.isAuthenticated = true;
          break;
        case 'yonetici':
          state.id = 'demo-yonetici-001';
          state.name = 'Mehmet Kaya';
          state.email = 'mehmet.kaya@admin.com';
          state.userType = 'yonetici';
          state.isAuthenticated = true;
          break;
        default:
          // Çıkış yap
          state.id = null;
          state.name = null;
          state.email = null;
          state.userType = null;
          state.isAuthenticated = false;
      }
    },
  },
});

// Action'ları export etme
export const { 
  loginUser, 
  logoutUser, 
  updateUserType, 
  updateUserProfile, 
  setDemoUser,
  setUser
} = userSlice.actions;

// Selector'lar
export const selectUser = (state: { user: User }) => state.user;
export const selectUserType = (state: { user: User }) => state.user.userType;
export const selectIsAuthenticated = (state: { user: User }) => state.user.isAuthenticated;
export const selectUserName = (state: { user: User }) => state.user.name;

// Reducer'ı export etme
export default userSlice.reducer; 