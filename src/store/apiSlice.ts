import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Hasta interface'i
export interface Hasta {
  id: number;
  name: string;
  email: string;
  phone: string;
  tcKimlik: string;
  dogumTarihi: string;
  cinsiyet: 'Erkek' | 'Kadın';
  kanGrubu: string;
  adres: string;
  password: string;
  createdAt: string;
  hastaNotlari?: string;
}

// Doktor interface'i
export interface Doktor {
  id: number;
  name: string;
  email: string;
  phone: string;
  uzmanlik: string;
  diploma: string;
  deneyim: string;
  unvan: string;
  password: string;
  musaitlik: {
    pazartesi: string[];
    sali: string[];
    carsamba: string[];
    persembe: string[];
    cuma: string[];
  };
  randevuUcreti: number;
  aktif: boolean;
  createdAt: string;
}

// Randevu interface'i
export interface Randevu {
  id: number;
  hastaId: number;
  doktorId: number;
  tarih: string;
  saat: string;
  durum: 'Bekliyor' | 'Onaylandı' | 'Tamamlandı' | 'İptal';
  notlar?: string;
  randevuTuru: string;
  ucret: number;
  createdAt: string;
  updatedAt: string;
}

// Yönetici interface'i
export interface Yonetici {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  permissions: string[];
  createdAt: string;
  lastLogin: string;
}

// Randevu Türü interface'i
export interface RandevuTuru {
  id: number;
  name: string;
  sure: number;
  aciklama: string;
}

// Uzmanlık interface'i
export interface Uzmanlik {
  id: number;
  name: string;
  aciklama: string;
}

// Login Response interface'i
export interface LoginResponse {
  user: Hasta | Doktor | Yonetici;
  userType: 'hasta' | 'doktor' | 'yonetici';
  token?: string;
}

// Login Request interface'i
export interface LoginRequest {
  email: string;
  password: string;
}

// API slice oluşturma
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/',
  }),
  tagTypes: ['Hasta', 'Doktor', 'Randevu', 'Yonetici', 'RandevuTuru', 'Uzmanlik'],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<LoginResponse, LoginRequest>({
      queryFn: async (credentials) => {
        try {
          // Hasta kontrolü
          const hastalarResponse = await fetch('http://localhost:3001/hastalar');
          const hastalar = await hastalarResponse.json();
          const hasta = hastalar.find((h: Hasta) => 
            h.email === credentials.email && h.password === credentials.password
          );
          
          if (hasta) {
            return { data: { user: hasta, userType: 'hasta' as const } };
          }

          // Doktor kontrolü
          const doktorlarResponse = await fetch('http://localhost:3001/doktorlar');
          const doktorlar = await doktorlarResponse.json();
          const doktor = doktorlar.find((d: Doktor) => 
            d.email === credentials.email && d.password === credentials.password
          );
          
          if (doktor) {
            return { data: { user: doktor, userType: 'doktor' as const } };
          }

          // Yönetici kontrolü
          const yoneticilerResponse = await fetch('http://localhost:3001/yoneticiler');
          const yoneticiler = await yoneticilerResponse.json();
          const yonetici = yoneticiler.find((y: Yonetici) => 
            y.email === credentials.email && y.password === credentials.password
          );
          
          if (yonetici) {
            return { data: { user: yonetici, userType: 'yonetici' as const } };
          }

          return { error: { status: 401, data: 'Geçersiz giriş bilgileri' } };
        } catch (error) {
          return { error: { status: 500, data: 'Sunucu hatası' } };
        }
      },
    }),

    // Hasta endpoints
    getHastalar: builder.query<Hasta[], void>({
      query: () => 'hastalar',
      providesTags: ['Hasta'],
    }),

    getHasta: builder.query<Hasta, number>({
      query: (id) => `hastalar/${id}`,
      providesTags: (result, error, id) => [{ type: 'Hasta', id }],
    }),

    addHasta: builder.mutation<Hasta, Partial<Hasta>>({
      query: (newHasta) => ({
        url: 'hastalar',
        method: 'POST',
        body: {
          ...newHasta,
          createdAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: ['Hasta'],
    }),

    updateHasta: builder.mutation<Hasta, { id: number; data: Partial<Hasta> }>({
      query: ({ id, data }) => ({
        url: `hastalar/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Hasta', id }],
    }),

    deleteHasta: builder.mutation<void, number>({
      query: (id) => ({
        url: `hastalar/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Hasta'],
    }),

    // Doktor endpoints
    getDoktorlar: builder.query<Doktor[], void>({
      query: () => 'doktorlar',
      providesTags: ['Doktor'],
    }),

    getDoktor: builder.query<Doktor, number>({
      query: (id) => `doktorlar/${id}`,
      providesTags: (result, error, id) => [{ type: 'Doktor', id }],
    }),

    addDoktor: builder.mutation<Doktor, Partial<Doktor>>({
      query: (newDoktor) => ({
        url: 'doktorlar',
        method: 'POST',
        body: {
          ...newDoktor,
          createdAt: new Date().toISOString(),
          aktif: true,
        },
      }),
      invalidatesTags: ['Doktor'],
    }),

    updateDoktor: builder.mutation<Doktor, { id: number; data: Partial<Doktor> }>({
      query: ({ id, data }) => ({
        url: `doktorlar/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Doktor', id }],
    }),

    deleteDoktor: builder.mutation<void, number>({
      query: (id) => ({
        url: `doktorlar/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Doktor'],
    }),

    // Randevu endpoints
    getRandevular: builder.query<Randevu[], void>({
      query: () => 'randevular',
      providesTags: ['Randevu'],
    }),

    getRandevu: builder.query<Randevu, number>({
      query: (id) => `randevular/${id}`,
      providesTags: (result, error, id) => [{ type: 'Randevu', id }],
    }),

    getHastaRandevular: builder.query<Randevu[], number>({
      query: (hastaId) => `randevular?hastaId=${hastaId}`,
      providesTags: (result, error, hastaId) => [{ type: 'Randevu', id: hastaId }],
    }),

    getDoktorRandevular: builder.query<Randevu[], number>({
      query: (doktorId) => `randevular?doktorId=${doktorId}`,
      providesTags: (result, error, doktorId) => [{ type: 'Randevu', id: doktorId }],
    }),

    addRandevu: builder.mutation<Randevu, Partial<Randevu>>({
      query: (newRandevu) => ({
        url: 'randevular',
        method: 'POST',
        body: {
          ...newRandevu,
          durum: 'Bekliyor',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: ['Randevu'],
    }),

    updateRandevu: builder.mutation<Randevu, { id: number; data: Partial<Randevu> }>({
      query: ({ id, data }) => ({
        url: `randevular/${id}`,
        method: 'PUT',
        body: {
          ...data,
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Randevu', id }],
    }),

    deleteRandevu: builder.mutation<void, number>({
      query: (id) => ({
        url: `randevular/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Randevu'],
    }),

    // Yönetici endpoints
    getYoneticiler: builder.query<Yonetici[], void>({
      query: () => 'yoneticiler',
      providesTags: ['Yonetici'],
    }),

    // Randevu türleri endpoints
    getRandevuTurleri: builder.query<RandevuTuru[], void>({
      query: () => 'randevuTurleri',
      providesTags: ['RandevuTuru'],
    }),

    // Uzmanlık endpoints
    getUzmanliklar: builder.query<Uzmanlik[], void>({
      query: () => 'uzmanliklar',
      providesTags: ['Uzmanlik'],
    }),

    // İstatistik endpoints
    getStatistics: builder.query<any, void>({
      queryFn: async () => {
        try {
          const [hastalarRes, doktorlarRes, randevularRes] = await Promise.all([
            fetch('http://localhost:3001/hastalar'),
            fetch('http://localhost:3001/doktorlar'),
            fetch('http://localhost:3001/randevular')
          ]);

          const hastalar = await hastalarRes.json();
          const doktorlar = await doktorlarRes.json();
          const randevular = await randevularRes.json();

          const stats = {
            totalHastalar: hastalar.length,
            totalDoktorlar: doktorlar.length,
            totalRandevular: randevular.length,
            bekleyenRandevular: randevular.filter((r: Randevu) => r.durum === 'Bekliyor').length,
            onaylananRandevular: randevular.filter((r: Randevu) => r.durum === 'Onaylandı').length,
            tamamlananRandevular: randevular.filter((r: Randevu) => r.durum === 'Tamamlandı').length,
            iptalEdilenRandevular: randevular.filter((r: Randevu) => r.durum === 'İptal').length,
            aktifDoktorlar: doktorlar.filter((d: Doktor) => d.aktif).length,
            toplamGelir: randevular
              .filter((r: Randevu) => r.durum === 'Tamamlandı')
              .reduce((total: number, r: Randevu) => total + r.ucret, 0),
          };

          return { data: stats };
        } catch (error) {
          return { error: { status: 500, data: 'İstatistik verisi alınamadı' } };
        }
      },
    }),
  }),
});

// Hooks export etme
export const {
  useLoginMutation,
  useGetHastalarQuery,
  useGetHastaQuery,
  useAddHastaMutation,
  useUpdateHastaMutation,
  useDeleteHastaMutation,
  useGetDoktorlarQuery,
  useGetDoktorQuery,
  useAddDoktorMutation,
  useUpdateDoktorMutation,
  useDeleteDoktorMutation,
  useGetRandevularQuery,
  useGetRandevuQuery,
  useGetHastaRandevularQuery,
  useGetDoktorRandevularQuery,
  useAddRandevuMutation,
  useUpdateRandevuMutation,
  useDeleteRandevuMutation,
  useGetYoneticilerQuery,
  useGetRandevuTurleriQuery,
  useGetUzmanliklarQuery,
  useGetStatisticsQuery,
} = apiSlice; 