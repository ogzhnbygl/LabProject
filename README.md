# LabProject - Proje ve Etik Yönetim Sistemi

**LabProject**, laboratuvar araştırma projelerini, etik kurul izinlerini ve hayvan kullanım kotalarını yöneten kapsamlı bir modüldür. Araştırmacıların proje başvurularından sonuçlanma aşamasına kadar olan süreci dijitalleştirmeyi amaçlar.

## 🚀 Özellikler

### Proje Yönetimi
- **Proje Kaydı:** Proje başlığı, etik numarası, protokol numarası ve yürütücü bilgileri ile kolay kayıt.
- **Süreç Takibi:** Başlangıç, bitiş ve etik izin tarihlerinin takibi.
- **Durum Yönetimi:** Projelerin Aktif, Tamamlandı veya Süresi Dolmuş olarak sınıflandırılması.

### Hızlı Erişim ve Filtreleme
- **Akıllı Arama:** Etik no, proje başlığı veya yürütücü adına göre anlık filtreleme.
- **Görsel Gösterge:** Proje durumlarının renk kodları ile listelenmesi.

### Hayvan Kotası (Quota Management)
- **Detaylı Kota Tanımı:** Tür, suş, cinsiyet bazında hayvan kullanım haklarının tanımlanması.
- **Kullanım Takibi:** Toplam izin verilen ve kullanılan hayvan sayılarının görselleştirilmesi (Örn: 5/20).

## 🛠️ Kurulum ve Çalıştırma

Proje, modern web teknolojileri üzerine inşa edilmiştir.

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
`.env` dosyasını oluşturun ve veritabanı bağlantı bilgilerinizi girin.

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

Uygulama [http://localhost:5173](http://localhost:5173) adresinde çalışacaktır.

## 🏗️ Teknoloji Yığını
- **Frontend:** React, TailwindCSS, Lucide Icons
- **Backend:** Vercel Serverless Functions (Node.js)
- **Veritabanı:** MongoDB
