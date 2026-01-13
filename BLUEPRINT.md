# LabProject - Vizyon ve Blueprint

## 🎯 Amaç
**LabProject**, laboratuvarın "Yönetim/Policy" katmanıdır. Deney hayvanı kullanımının yasal ve etik sınırlara uygunluğunu denetleyen, projelerin yaşam döngüsünü (başvuru -> izin -> bitiş) takip eden merkezi bir otoritedir.

## 🌟 Vizyon
- **Merkezi Kontrol:** Tüm etik izinler ve protokoller tek bir dijital dosyada.
- **Entegrasyon:** Diğer modüller (örn. Dispo) hayvan kullanımı sırasında LabProject'e "İzin var mı? Kota yeterli mi?" diye sorar.
- **Veriye Dayalı Karar:** Anlık kota doluluk oranlarını göstererek araştırmacıların planlama yapmasını kolaylaştırır.
- **Otomasyon (Gelecek):** Etik kurul karar dosyalarını yapay zeka ile analiz edip formları otomatik doldurma.

## 🧩 Modüller ve Fonksiyonlar

### 1. Proje Yönetim Paneli
- **Genel Bakış:** Tüm projelerin liste halinde, durumlarıyla birlikte görüntülenmesi.
- **Detaylı Arama:** Etik no, başlık veya PID (Yürütücü) bazlı arama.
- **Hızlı Aksiyonlar:** Yeni proje ekleme, mevcut projeyi düzenleme veya arşivleme/silme.

### 2. Proje Kartı ve Detayları
- **Kimlik Bilgileri:** Proje Başlığı, Etik No, Protokol No, Yürütücü.
- **Zaman Çizelges:** Başlangıç ve Bitiş tarihleri, uzatma takibi.

### 3. Akıllı Kota (Smart Quota)
- **Kota Tanımlama:** Tür (Fare, Sıçan vb.), Suş ve Cinsiyet kırılımında kota belirleme.
- **Kullanım Görselleştirme:** Her proje kartında toplam kota ve kullanılan miktarının (Used vs Total) net gösterimi.
- **Validasyon:** Kota aşımını engelleyen kontrol mekanizmaları.

## 🏗️ Mimari ve Teknoloji
- **Framework:** React + Vite
- **UI Kütüphanesi:** TailwindCSS (Modern, temiz ve responsive tasarım)
- **İkonlar:** Lucide React
- **Backend:** Vercel Serverless Functions (Node.js Runtime)
- **Veritabanı:** MongoDB (Esnek doküman yapısı)
- **AI Entegrasyonu (Planlanan):** Google Gemini / OpenAI ile doküman ayrıştırma.
