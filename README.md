# LabProject - Proje ve Etik Yönetim Sistemi

**LabProject**, laboratuvar araştırma projelerini, etik kurul izinlerini ve hayvan kullanım kotalarını yöneten kapsamlı bir yönetim modülüdür. Apex platformu ile entegre çalışarak araştırmacıların proje başvurularından sonuçlanma aşamasına kadar olan süreci dijitalleştirir.

## 🚀 Özellikler

- **Proje Yönetimi ve Takibi:**
    - Proje başlığı, etik numarası, protokol numarası ve yürütücü bilgileri ile detaylı proje tanımlama.
    - Etik kurul başlangıç/bitiş tarihleri ve proje çalışma takviminin ayrı ayrı takibi.
    - "Çalışma Kuralları Formu" ve "Proje Defteri" gibi doküman teslimatlarının entegre takibi.
    - Projelerin durum (aktif, taslak, tamamlandı vb.) güncellemelerinin sunucuda güvenli şekilde saklanması.
- **Güvenli Kimlik ve Oturum Yönetimi (Faz 1 & Faz 2):**
    - Apex merkezi kimlik sağlayıcısına entegre, `interapp_session` JWT çerez kontrolü.
    - `App.jsx` üzerindeki geçici (dummy) kullanıcı durumlarının temizlenerek gerçek `useAuth()` bağlamı ile oturum senkronizasyonunun kurulması.
    - `react-router-dom` tabanlı yönlendirme ile `/`, `/calendar`, `/reports` rotalarının hayata geçirilmesi.
- **Hayvan Kotası ve Veri Bütünlüğü (Zod):**
    - Tür, Suş ve Cinsiyet bazında hayvan kullanım kotalarının tanımlanması.
    - Sunucu tarafında Zod validasyon şeması ile veri doğrulaması yapılırken nested `quotas` yapısı ve proje meta verilerinin kırpılmasını (parameter stripping) engelleyen güçlü doğrulama.
    - İzin başlangıç tarihinin bitiş tarihinden önce olması zorunluluğunun backend düzeyinde kontrolü.

## 🛠️ Teknolojiler

LabProject, en güncel web teknolojileri ile geliştirilmiştir:

### Frontend
- **Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend
- **Runtime:** [Vercel Serverless Functions](https://vercel.com/docs/functions)
- **Database:** [MongoDB](https://www.mongodb.com/)

## 📦 Kurulum

Projeyi yerel ortamınızda çalıştırmak için:

### Gereksinimler
- Node.js (v18+)
- MongoDB Veritabanı

### Adımlar

1. **Repoyu klonlayın:**
   ```bash
   git clone <repo-url>
   cd LabProject
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Çevresel Değişkenleri Ayarlayın:**
   `.env` dosyasını oluşturun ve gerekli bilgileri girin:
   ```env
   MONGODB_URI=mongodb+srv://...
   ```

4. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```
   Uygulama `http://localhost:5173` adresinde çalışacaktır.

## 📂 Proje Yapısı

- `/src`: Frontend dosyaları (Sayfalar, Bileşenler).
- `/api`: Backend serverless fonksiyonları.
- `/public`: Statik dosyalar.

Detaylı teknik bilgi için [TECHNICAL.md](./TECHNICAL.md) dosyasına bakabilirsiniz.

## 📜 Lisans

Bu proje özel mülkiyettir. İzinsiz kopyalanması ve dağıtılması yasaktır.
