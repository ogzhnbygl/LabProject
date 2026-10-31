# LabProject - Proje ve Etik Yönetim Sistemi

> **Antigravity Ekosistemi (Apex Hub & Spoke Mimarisi) - Yönetişim ve Denetim Katmanı (Governance Layer)**

**LabProject**, araştırma laboratuvarındaki tüm deneysel araştırma projelerini, yerel etik kurul (HADYEK) onay süreçlerini, çalışma takvimlerini ve türe/suşa özgü hayvan kullanım kotalarını uçtan uca yöneten merkezi yönetim modülüdür. Apex platformunun SSO (Tekil Oturum Açma) altyapısına doğrudan bağlı bir **Spoke** uygulama olarak çalışır.

---

## 🌟 Temel Özellikler

- **Proje & Etik İzin Yönetimi:**
  - Proje başlığı, Etik No (örn: `2024/001`), Protokol No ve Yürütücü (PI) tanımları.
  - Etik Kurul izin başlangıç/bitiş tarihleri ile laboratuvardaki fiili çalışma takviminin (Başlangıç/Bitiş) birbirinden bağımsız takibi.
  - İdari uyumluluk kontrolleri: **Çalışma Kuralları Formu** teslimi ve **Proje Defteri** zimmet doğrulaması.
  - Proje durum yaşam döngüsü: `Active` (Aktif), `Continuing` (Devam Ediyor), `Completed` (Tamamlandı), `Cancelled` (İptal Edildi) ve `Expired` (Süresi Dolmuş).

- **Granüler Hayvan Kota Takibi:**
  - Tür bazında tanımlı suş hiyerarşisi:
    - **Fare:** BALB/c, C57BL/6, CD-1 (ICR), Athymic Nude
    - **Sıçan:** Wistar, Sprague Dawley
    - **Tavşan:** New Zealand White
  - Cinsiyet ayrımı (*Erkek*, *Dişi*, *Erkek ve Dişi*).
  - Dinamik kota muhasebesi: Tanımlanan tahsis edilen toplam kota (`count`) ve harcanan fiili kullanım (`used`) takibi.

- **Proje Zaman Çizelgesi & Takvim (`/timeline`):**
  - Ay görünümünde 42 günlük (6 hafta, Pazartesi başlangıçlı) zaman matrisi.
  - Çakışmasız çoklu gün yayılımı (**Multi-day Spanning Row Slot Assignment**) algoritması.
  - Renk kodlamalı görsel bloklar, proje başlangıç/bitiş kenar yuvarlatmaları ve interaktif detay pencereleri (backdrop blur).
  - Proje ekleme, güncelleme ve silme işlemleriyle otomatik çift yönlü senkronizasyon.
  - Sistem yöneticilerine (Admin) özel tek tıkla tam takvim senkronizasyonu (**Full Sync**).

- **İstatistik & Raporlama Paneli (`/reports`):**
  - Aktif, devam eden, tamamlanan, iptal edilen ve süresi dolmuş araştırma projelerinin sayısal dağılım göstergeleri.
  - Recharts ve Lucide React destekli analitik kartlar.

- **Apex SSO & Güvenlik Altyapısı:**
  - Merkezi `interapp_session` (prod) / `interapp_session_test` (test) HTTP-only JWT çerez doğrulaması.
  - Rol ve uygulama bazlı erişim kontrolü (`admin` veya `labproject` uygulama yetkisi).
  - Zod v4 tabanlı sunucu tarafı şema doğrulaması ve tarih tutarlılık kontrolleri (`ethicsStartDate <= ethicsEndDate`, `startDate <= endDate`).
  - Veritabanı sorgu optimizasyonu: Liste görünümlerinde projection uygulaması ile düşük bellek ve bant genişliği tüketimi.

---

## 🛠️ Teknoloji Yığını

### Ön Yüz (Frontend)
| Paket / Araç | Sürüm | Kullanım Amacı |
|---|---|---|
| **React** | `^18.2.0` | Temel UI bileşen mimarisi ve reaktif durum yönetimi |
| **React DOM** | `^18.2.0` | React web tarayıcı bağlayıcısı |
| **React Router DOM** | `^7.16.0` | SPA istemci taraflı sayfa yönlendirmesi (`/`, `/new`, `/edit/:id`, `/timeline`, `/reports`) |
| **Lucide React** | `^0.344.0` | Modern, tutarlı SVG arayüz ikonları |
| **Recharts** | `^3.4.1` | Analitik veri görselleştirme ve raporlama grafikleri |
| **Tailwind CSS** | `^3.4.1` | Hızlı ve responsive yardımcı sınıf tabanlı stil kütüphanesi |
| **PostCSS & Autoprefixer** | `^8.4.35` / `^10.4.18` | CSS ön işleme ve tarayıcı uyumluluk optimizasyonu |
| **Vite** | `^5.1.6` | Hızlı HMR sunucusu ve optimize edilmiş üretim derleyicisi |

### Sunucu & Veritabanı (Backend & Database)
| Paket / Araç | Sürüm | Kullanım Amacı |
|---|---|---|
| **Vercel Serverless Functions** | Edge/Node.js | Sunucusuz API endpoint'leri (`/api/projects`, `/api/calendar`, `/api/auth/session`) |
| **MongoDB Driver** | `^7.0.0` | MongoDB Atlas / yerel veritabanı bağlantı havuzu ve doküman operasyonları |
| **Zod** | `^4.4.3` | Giriş verisi sanitizasyonu, alan doğrulama ve tarih kuralları |
| **Dotenv** | `^17.2.3` | Çevresel değişkenlerin yönetimi |
| **Crypto (Node.js built-in)** | Native | HS256 JWT imza doğrulaması ve `crypto.timingSafeEqual` ile zamanlama saldırılarına karşı koruma |

---

## 🚀 Kurulum & Çalıştırma Rehberi

### Gereksinimler
- **Node.js**: v18.0.0 veya üzeri
- **npm**: v9.0.0 veya üzeri
- **MongoDB**: Aktif bir MongoDB kümesi (Atlas veya yerel örnek)

### 1. Repoyu Klonlayın ve Bağımlılıkları Kurun
```bash
cd /Users/oguzhan/Antigravity/LabProject
npm install
```

### 2. Ortam Değişkenlerini Tanımlayın (`.env`)
Proje kök dizininde `.env` dosyasını oluşturun veya düzenleyin:

```env
# MongoDB Bağlantı URL'i
MONGODB_URI=mongodb+srv://<kullanici>:<sifre>@<cluster>.mongodb.net/?retryWrites=true&w=majority

# Apex SSO Entegrasyon Gizli Anahtarı (Apex Hub ile aynı olmalıdır)
JWT_SECRET=super_secret_jwt_key_shared_with_apex

# İsteğe Bağlı: Ortam Değişkenleri
NODE_ENV=development
# VERCEL_ENV=production        # Canlı veritabanı ayrımı için
# FORCE_PROD_DB=true          # Test veritabanı yerine canlı db kullanmaya zorlar
```

### 3. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Uygulama yerel olarak `http://localhost:5173` adresinde başlatılır. Geliştirme modunda (`import.meta.env.DEV`), oturum otomatik olarak mock yönetici kullanıcısıyla simüle edilir.

### 4. Üretim Derlemesi ve Önizleme
```bash
# Üretim çıktısını /dist dizinine derler
npm run build

# Derlenen çıktıyı yerel HTTP sunucusunda test eder
npm run preview
```

---

## 📂 Dizin Yapısı

```
LabProject/
├── api/                        # Vercel Serverless API Fonksiyonları
│   ├── auth/
│   │   └── session.js          # SSO oturum sorgulama (GET) ve sonlandırma (DELETE/POST)
│   ├── calendar.js             # Takvim etkinlikleri listeleme (GET) ve toplu eşitleme (POST)
│   └── projects.js             # Projeler CRUD operasyonları & takvim senkronizasyon kancaları
├── lib/                        # Paylaşılan Sunucu Kütüphaneleri
│   ├── auth.js                 # JWT doğrulama, çerez ayıklama ve RBAC erişim kontrolü
│   └── mongodb.js              # MongoClient bağlantı havuzu ve dinamik DB adı çözümleyici
├── public/                     # Statik dosyalar
├── src/                        # React Ön Yüz Kaynak Kodları
│   ├── components/
│   │   └── Layout.jsx          # Üst navigasyon çubuğu, profil ve ekosistem geçiş menüsü
│   ├── context/
│   │   └── AuthContext.jsx     # Apex SSO oturum durum sağlayıcısı ve yetki yönlendiricisi
│   ├── pages/
│   │   ├── ProjectCalendar.jsx # Çoklu gün yayılımlı interaktif proje zaman çizelgesi
│   │   ├── ProjectForm.jsx     # Yeni proje tanımlama ve düzenleme formu (Hayvan kotaları)
│   │   ├── ProjectList.jsx     # Sayfalanmış, filtrelenebilir proje ve etik listesi
│   │   └── ProjectReports.jsx  # Durum bazlı istatistik ve metrik kartları
│   ├── App.jsx                 # Rota tanımları (`react-router-dom`), form durum köprüleri
│   ├── index.css               # Tailwind CSS temel ve bileşen direktifleri
│   └── main.jsx                # React DOM kök montaj noktası
├── dist/                       # Üretim derleme çıktıları
├── index.html                  # HTML şablonu
├── package.json                # Bağımlılıklar ve npm script'leri
├── postcss.config.js           # PostCSS yapılandırması
├── tailwind.config.js          # Tailwind renk, font ve breakpoint tanımları
├── vercel.json                 # Vercel Serverless rewrite kuralları (SPA + API)
├── vite.config.js              # Vite yapılandırma dosyası
├── README.md                   # Proje ana tanıtım ve kurulum rehberi
├── TECHNICAL.md                # Derinlemesine mimari, API ve veri modelleri dokümanı
└── BLUEPRINT.md                # Ürün vizyonu, fazlar ve gelecek yol haritası
```

---

## 🔒 Güvenlik ve Yetkilendirme Modeli

- **Apex SSO Çerez Paylaşımı:** Çerezler `.wildtype.app` üst alan adına `HttpOnly`, `SameSite=Lax` ve `Secure` olarak yazılır. Bu sayede Hub (Apex) ve Spoke (LabProject, Dispo, Silo, Locus vb.) arasında güvenli oturum paylaşılır.
- **Rol Tabanlı Erişim Denetimi (RBAC):**
  - `admin` rolü: Tüm projelere tam erişim, silme ve takvimi baştan oluşturma yetkisine sahiptir.
  - `user` rolü: Kullanıcının Apex üzerindeki `apps` listesinde `"labproject"` yer almalıdır. Yetkisiz girişlerde `403 Forbidden` döndürülerek Apex ana paneline yönlendirilir.
- **Sıkı Veri Doğrulama (Zod v4):** API seviyesinde gelen tüm yükler şema doğrulamasından geçer; fazladan veya tanımsız parametreler Mongo enjeksiyonuna ve şema kirlenmesine karşı engellenir.
- **Tarih Sıralama Bütünlüğü:** Etik bitiş tarihinin etik başlangıç tarihinden, proje bitiş tarihinin de proje başlangıç tarihinden önce girilmesi hem ön yüzde hem API'de engellenir.

---

## 📚 İlgili Dokümanlar

- [TECHNICAL.md](./TECHNICAL.md) - Veritabanı şemaları, API endpoint spesifikasyonları, takvim slot algoritması ve mimari detaylar.
- [BLUEPRINT.md](./BLUEPRINT.md) - Ürün felsefesi, tamamlanan fazlar ve gelecek entegrasyon yol haritası.

---

## 📜 Lisans

Bu proje **Antigravity / WildType** ekosistemine ait özel mülkiyettir. Tüm hakları saklıdır.
