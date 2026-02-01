# LabProject - Proje ve Etik Yönetim Sistemi

**LabProject**, laboratuvar araştırma projelerini, etik kurul izinlerini ve hayvan kullanım kotalarını yöneten kapsamlı bir yönetim modülüdür. Apex platformu ile entegre çalışarak araştırmacıların proje başvurularından sonuçlanma aşamasına kadar olan süreci dijitalleştirir.

## 🚀 Özellikler

### 📊 Proje Yönetimi ve Takibi
- **Kapsamlı Kayıt:** Proje başlığı, etik numarası, protokol numarası ve yürütücü bilgileri ile detaylı proje tanımlama.
- **Süreç Yönetimi:** Etik kurul başlangıç/bitiş tarihleri ve proje çalışma takviminin ayrı ayrı takibi.
- **Durum Sınıflandırması:** Projelerin **Aktif**, **Devam Ediyor**, **Tamamlandı**, **İptal Edildi** veya **Süresi Dolmuş** statülerinde yönetilmesi.
- **Uyumluluk Kontrolleri:** "Çalışma Kuralları Formu" ve "Proje Defteri" gibi zorunlu dokümanların teslim durumunun takibi.

### 🔍 Hızlı Erişim ve Filtreleme
- **Gelişmiş Arama:** Etik no, proje başlığı veya yürütücü (PI) adına göre anlık arama.
- **Durum Filtresi:** Projeleri mevcut durumlarına göre (Örn: Sadece 'Aktif' olanlar) filtreleme yeteneği.
- **Sayfalama:** Çok sayıda proje kaydının sayfalama özelliği ile performanslı listelenmesi.

### 📈 Raporlar ve Analiz
- **Dashboard:** Tüm projelerin durumlarına göre dağılımını gösteren görsel özet kartları.
- **İstatistikler:** Toplam, aktif, tamamlanan ve süresi dolan proje sayılarının anlık takibi.

### 🐭 Hayvan Kotası (Quota Management)
- **Detaylı Kota Tanımı:** Tür (Fare, Sıçan, Tavşan vb.), Suş ve Cinsiyet bazında hayvan kullanım haklarının tanımlanması.
- **Kullanım Takibi:** Toplam izin verilen ve kullanılan hayvan sayılarının görselleştirilmesi (Örn: 5/20).

## 🛠️ Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v18+)
- MongoDB Veritabanı

### Kurulum Adımları

1. Repoyu klonlayın:
```bash
git clone <repo-url>
cd LabProject
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Çevresel değişkenleri ayarlayın:
`.env` dosyasını oluşturun ve gerekli API ve veritabanı bağlantı bilgilerini girin.

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

Uygulama [http://localhost:5173](http://localhost:5173) adresinde çalışacaktır.

## 🏗️ Teknoloji Yığını
- **Frontend:** React, Vite, TailwindCSS
- **UI Bileşenleri:** Lucide Icons
- **Backend:** Vercel Serverless Functions (`/api`)
- **Veritabanı:** MongoDB
