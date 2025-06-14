# 🏥 Doktor_Randevu_Projesi

Modern ve kullanıcı dostu Doktor_Randevu_Projesi. React, TypeScript, Material-UI ve Redux Toolkit ile geliştirilmiştir.

## 📋 İçindekiler

- [Özellikler](#özellikler)
- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
- [Demo Giriş Bilgileri](#demo-giriş-bilgileri)
- [Kullanım](#kullanım)
- [Proje Yapısı](#proje-yapısı)
- [API Endpoints](#api-endpoints)
- [Kullanıcı Rolleri](#kullanıcı-rolleri)
- [State Management](#state-management)
- [Tema Sistemi](#tema-sistemi)
- [Deployment](#deployment)
- [Katkıda Bulunma](#katkıda-bulunma)

## ✨ Özellikler

### 👥 Hasta Paneli
- 🔐 Güvenli giriş ve kayıt sistemi
- 👨‍⚕️ Doktor listesi görüntüleme
- 📅 Randevu alma sistemi
- 📊 Randevu geçmişi görüntüleme
- 🎨 Modern ve responsive tasarım
- 🌙 Açık/Karanlık tema desteği

### 🩺 Doktor Paneli
- 📋 Program yönetimi
- ⏰ Müsaitlik durumu ayarlama
- 📝 Randevu isteklerini değerlendirme
- ✅ Randevu onaylama/reddetme
- 📊 Hasta randevu geçmişi
- 📈 İstatistik görüntüleme

### ⚙️ Yönetici Paneli
- 👥 Kullanıcı yönetimi (Hasta/Doktor)
- 📊 Kapsamlı raporlama sistemi
- 📈 İstatistik görüntüleme
- 🔧 Sistem ayarları
- 📋 Tüm randevuları yönetme
- 👨‍💼 Doktor ve hasta ekleme/düzenleme

## 🛠️ Teknolojiler

### Frontend Stack
- **React 19.1.0** - Modern UI framework
- **TypeScript 4.9.5** - Type safety ve geliştirici deneyimi
- **Material-UI 7.1.1** - Kapsamlı UI component library
- **Redux Toolkit 2.8.2** - Predictable state management
- **RTK Query** - Data fetching ve caching
- **React Router 7.6.2** - Client-side routing
- **Emotion** - CSS-in-JS styling solution

### Development Tools
- **ESLint** - Code linting ve quality
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **TypeScript** - Static type checking

## 🚀 Kurulum

### Önkoşullar
- **Node.js 16+** - JavaScript runtime
- **npm** veya **yarn** - Package manager
- **Git** - Version control

### Kurulum Adımları

```bash
# 1. Projeyi klonlayın
git clone <repository-url>
cd Doktor_Randevu_Projesi

# 2. Bağımlılıkları yükleyin
npm install

# 3. Geliştirme sunucusunu başlatın
npm start

# 4. Tarayıcıda açılacak
# http://localhost:3000
```

### Alternatif: Yarn ile kurulum
```bash
yarn install
yarn start
```

## 🔐 Demo Giriş Bilgileri

Sistemi test etmek için aşağıdaki demo hesapları kullanabilirsiniz:

### 👤 Hasta Girişi
- **Email:** hasta@demo.com
- **Şifre:** hasta123
- **Özellikler:** Randevu alma, doktor görüntüleme

### 👨‍⚕️ Doktor Girişi
- **Email:** doktor@demo.com
- **Şifre:** doktor123
- **Özellikler:** Program yönetimi, randevu onaylama

### ⚙️ Yönetici Girişi
- **Email:** admin@demo.com
- **Şifre:** admin123
- **Özellikler:** Tam sistem yönetimi, raporlama

## 📖 Kullanım

### Ana Sayfa
- Sistem tanıtımı ve özellikler
- Kullanıcı tipi seçimi
- Modern giriş modal'ı

### Hasta İşlemleri
1. **Kayıt/Giriş**: Ana sayfadan hasta girişi yapın
2. **Doktor Seçimi**: Uzman doktor listesini inceleyin
3. **Randevu Alma**: Uygun tarih ve saat seçin
4. **Takip**: Randevu durumunuzu kontrol edin

### Doktor İşlemleri
1. **Program Yönetimi**: Çalışma saatlerinizi ayarlayın
2. **Randevu Değerlendirme**: Gelen istekleri inceleyin
3. **Onay/Red**: Randevuları kabul edin veya reddedin
4. **Hasta Takibi**: Hasta bilgilerini görüntüleyin

### Yönetici İşlemleri
1. **Kullanıcı Yönetimi**: Hasta ve doktor hesaplarını yönetin
2. **Raporlama**: Sistem istatistiklerini görüntüleyin
3. **Ayarlar**: Sistem konfigürasyonunu düzenleyin

## 🏗️ Proje Yapısı

```
Doktor_Randevu_Projesi/
├── public/                  # Static files
│   ├── index.html          # HTML template
│   └── favicon.ico         # App icon
├── src/
│   ├── components/         # Reusable components
│   │   ├── Layout.tsx     # Ana layout wrapper
│   │   ├── LoginModal.tsx # Giriş modal'ı
│   │   ├── UserStatus.tsx # Kullanıcı durumu
│   │   ├── ThemeSwitcher.tsx # Tema değiştiricisi
│   │   ├── DoktorListesi.tsx # Doktor listesi
│   │   ├── RandevuTablosu.tsx # Randevu tablosu
│   │   └── ...
│   ├── pages/             # Sayfa bileşenleri
│   │   ├── AnaSayfa.tsx  # Ana sayfa
│   │   ├── Hastalar.tsx  # Hasta paneli
│   │   ├── Doktorlar.tsx # Doktor paneli
│   │   └── Yonetici.tsx  # Yönetici paneli
│   ├── store/            # Redux store
│   │   ├── store.ts      # Store konfigürasyonu
│   │   ├── userSlice.ts  # Kullanıcı state'i
│   │   └── apiSlice.ts   # API slice (RTK Query)
│   ├── contexts/         # React contexts
│   │   └── ThemeContext.tsx # Tema context'i
│   ├── App.tsx          # Ana uygulama bileşeni
│   └── index.tsx        # Entry point
├── package.json         # Dependencies ve scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Bu dosya
```

## 🌐 API Endpoints

### Hasta İşlemleri
```typescript
GET    /users           # Tüm hastaları getir
GET    /users/:id       # Tekil hasta getir
POST   /users           # Yeni hasta oluştur
PUT    /users/:id       # Hasta güncelle
DELETE /users/:id       # Hasta sil
```

### Randevu İşlemleri
```typescript
GET    /randevular                    # Tüm randevuları getir
GET    /randevular/hasta/:id         # Hasta randevularını getir
GET    /randevular/doktor/:id        # Doktor randevularını getir
POST   /randevular                   # Yeni randevu oluştur
PUT    /randevular/:id               # Randevu güncelle
DELETE /randevular/:id               # Randevu sil
```

### Doktor İşlemleri
```typescript
GET    /doktorlar                    # Tüm doktorları getir
GET    /doktorlar/:id               # Tekil doktor getir
PUT    /doktorlar/:id/musaitlik     # Doktor müsaitliği güncelle
```

⚠️ **Not**: Şu anda jsonplaceholder.typicode.com mock API'si kullanılmaktadır. Production için gerçek backend gereklidir.

## 👥 Kullanıcı Rolleri

### 🔐 Hasta (Patient)
- **Yetkiler:**
  - Randevu alma
  - Randevu geçmişi görüntüleme
  - Doktor bilgilerini inceleme
  - Profil yönetimi
- **Kısıtlamalar:**
  - Sadece kendi randevularını görebilir
  - Başka hastaların bilgilerine erişemez

### 👨‍⚕️ Doktor (Doctor)
- **Yetkiler:**
  - Program yönetimi
  - Randevu onaylama/reddetme
  - Hasta bilgilerini görüntüleme
  - Müsaitlik durumu ayarlama
- **Kısıtlamalar:**
  - Sadece kendi randevularını yönetebilir
  - Sistem ayarlarına erişemez

### ⚙️ Yönetici (Admin)
- **Yetkiler:**
  - Tüm kullanıcı yönetimi
  - Sistem raporları
  - Genel ayarlar
  - Randevu yönetimi
- **Kısıtlamalar:**
  - Hasta mahremiyeti kuralları
  - Doktor özgürlüğü sınırları

## 📊 State Management

### Redux Store Yapısı
```typescript
store
├── user          # Kullanıcı bilgileri ve auth durumu
└── api           # RTK Query cache ve API state
```

### User Slice Interface
```typescript
interface UserState {
  id: string | null;
  name: string;
  email: string;
  userType: 'hasta' | 'doktor' | 'yonetici';
  isAuthenticated: boolean;
}
```

### RTK Query Features
- **Automatic Caching**: Otomatik veri önbelleğe alma
- **Background Updates**: Arka plan güncellemeleri
- **Optimistic Updates**: İyimser güncellemeler
- **Error Handling**: Kapsamlı hata yönetimi

## 🎨 Tema Sistemi

### Desteklenen Temalar
- **Light Mode**: Aydınlık tema (varsayılan)
- **Dark Mode**: Karanlık tema
- **Auto**: Sistem tercihine göre

### Tema Özellikleri
- **Material-UI theming**: Tutarlı renk paleti
- **Custom CSS variables**: Esneklik
- **Responsive design**: Tüm ekran boyutları
- **Accessibility**: WCAG 2.1 uyumlu

### Tema Değiştirme
```typescript
// ThemeSwitcher bileşeni ile
<ThemeSwitcher />

// Manuel olarak
const { toggleColorMode } = useTheme();
toggleColorMode();
```

## 📱 Responsive Design

### Breakpoints
- **xs**: 0px ve üzeri (mobile)
- **sm**: 600px ve üzeri (tablet)
- **md**: 900px ve üzeri (desktop)
- **lg**: 1200px ve üzeri (large desktop)
- **xl**: 1536px ve üzeri (extra large)

### Mobile Features
- **Touch-friendly**: Büyük dokunma alanları
- **Swipe gestures**: Kaydırma hareketleri
- **Optimized forms**: Mobil form deneyimi
- **Fast loading**: Hızlı yükleme

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Seçenekleri

#### Netlify
```bash
# Build command
npm run build

# Publish directory
build
```

#### Vercel
```bash
# Otomatik deployment
vercel --prod
```

#### GitHub Pages
```bash
npm install --save-dev gh-pages

# package.json'a ekleyin
"homepage": "https://username.github.io/Doktor_Randevu_Projesi",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

npm run deploy
```

### Environment Variables
```bash
# .env dosyası
REACT_APP_API_URL=https://api.example.com
REACT_APP_VERSION=1.0.0
REACT_APP_THEME=light
```

## 🔧 Geliştirme

### Code Style
- **ESLint**: Kod standartları
- **Prettier**: Kod formatlama
- **TypeScript**: Type safety
- **Conventional Commits**: Commit standardı

### Performans Optimizasyonları
- **React.memo**: Component memoization
- **useMemo**: Value memoization
- **useCallback**: Function memoization
- **Code Splitting**: Lazy loading

### Testing
```bash
# Unit tests
npm test

# Coverage report
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## 🤝 Katkıda Bulunma

### Geliştirme Süreci
1. **Fork**: Projeyi fork edin
2. **Branch**: Feature branch oluşturun
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit**: Değişikliklerinizi commit edin
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. **Push**: Branch'inizi push edin
   ```bash
   git push origin feature/amazing-feature
   ```
5. **PR**: Pull Request oluşturun

### Commit Mesaj Formatı
```
type(scope): description

feat: yeni özellik
fix: hata düzeltmesi
docs: dokümantasyon
style: stil değişiklikleri
refactor: kod refactoring
test: test ekleme
chore: araç güncellemeleri
```

## 📞 İletişim

- **Proje Sahibi**: [@username](https://github.com/username)
- **Email**: developer@example.com
- **Issues**: [GitHub Issues](https://github.com/username/Doktor_Randevu_Projesi/issues)
- **Discussions**: [GitHub Discussions](https://github.com/username/Doktor_Randevu_Projesi/discussions)

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- **Material-UI ekibine** - Harika UI component'ları için
- **Redux Toolkit ekibine** - Modern state management için
- **React ekibine** - Güçlü framework için
- **TypeScript ekibine** - Type safety için
- **Tüm katkıda bulunanlara** - Sürekli iyileştirmeler için

## 🔄 Changelog

### v1.0.0 (2024-01-15)
- ✨ İlk stabil sürüm
- 🏥 Hasta, Doktor, Yönetici panelleri
- 🔐 Authentication sistemi
- 🎨 Material-UI entegrasyonu
- 📱 Responsive tasarım
- 🌙 Dark/Light tema
- 📊 RTK Query entegrasyonu

---

**⚠️ Önemli Not**: Bu proje demo amaçlıdır. Production ortamında kullanılmadan önce güvenlik önlemlerinin alınması, gerçek backend API'sinin entegre edilmesi ve kapsamlı testlerin yapılması gerekmektedir.

**🚀 Demo**: [https://doktor-randevu-demo.netlify.app](https://doktor-randevu-demo.netlify.app)
