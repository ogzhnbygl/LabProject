# LabProject - Vizyon ve Blueprint

## 🎯 Amaç
**LabProject**, laboratuvar ekosisteminin **"Yönetim ve Denetim Katmanı" (Governance Layer)** olarak konumlanmıştır. Araştırmacıların proje başvurularını, etik kurul izinlerini ve hayvan kullanım kotalarını yöneten merkezi otoritedir.

Diğer modüller (örneğin stok takibi yapan **Dispo**), operasyonel işlemleri için LabProject'ten yetki ve kota bilgisi sorgular.

## 🌟 Vizyon
- **Merkezi Otorite:** Tüm etik izinler, protokoller ve süreler tek bir kaynaktan yönetilir.
- **Entegrasyon Hub'ı:** Kimlik doğrulama (Auth) ve yetkilendirme (AuthZ) için Apex platformu ile tam entegre çalışır.
- **Canlı Kota Yönetimi:** Projelerin hayvan kullanım hakları (Quota) statik bir sayı değil, operasyonel modüllerden gelen verilerle (Used vs Total) canlı bir mekanizmadır.
- **Kağıtsız Süreç:** "Proje Defteri" ve "Çalışma Kuralları" gibi fiziksel belge süreçlerinin dijital takibi.

## 🧩 Mevcut Modüller

### 1. Proje Yönetim Paneli
- **Liste ve Filtreleme:** Projelerin durum (Aktif, Tamamlandı, Süresi Dolmuş) ve metin bazlı filtrelenmesi.
- **CRUD İşlemleri:** Yeni proje oluşturma, düzenleme ve silme.

### 2. Proje Detay ve Form Yapısı
- **Kimlik:** Başlık, Yürütücü (PI), Etik No, Protokol No.
- **Zamanlama:** Etik izin tarihleri ve Genel proje tarihleri ayrımı.
- **Uyumluluk:** Çalışma kuralları ve Defter teslimatlarının checklist olarak takibi.

### 3. Akıllı Kota (Smart Quota)
- **Hiyerarşik Tanım:** Tür -> Suş -> Cinsiyet -> Sayı.
- **Görsel Takip:** Kullanılan/Toplam oranlarının anlık gösterimi.

### 4. Raporlama ve Dashboard
- **Özet Kartlar:** Proje durumlarının (Active, Expired vb.) sayısal dağılımı.
- **Renkli Göstergeler:** Kritik durumların (örn. Süresi dolmuş projeler) görsel olarak vurgulanması.

## 🚀 Yol Haritası (Roadmap)

### Kısa Vadeli Hedefler
- [ ] **Proje Takvimi (Timeline):** Tüm projelerin başlangıç ve bitiş tarihlerini Gantt şeması veya Takvim görünümünde sunan modül (Geliştirme aşamasında).
- [ ] **Apex Auth Entegrasyonu:** Mock auth yapısından gerçek Apex provider yapısına geçiş.

### Orta ve Uzun Vadeli Hedefler
- [ ] **Dispo Entegrasyonu:** Dispo modülünde harcanan her bir hayvanın, otomatik olarak LabProject kotasından düşülmesi.
- [ ] **AI Destekli Analiz:** Etik kurul PDF dosyalarının Gemini/OpenAI ile taranarak form alanlarının (Tarihler, Sayılar) otomatik doldurulması.
- [ ] **Bildirim Sistemi:** Süresi yaklaşan projeler veya dolan kotalar için e-posta uyarıları.

## 🏗️ Mimari Prensipler
- **Single Source of Truth:** Proje verisi sadece LabProject'te tutulur.
- **Stateless Backend:** Vercel Functions ile ölçeklenebilir, sunucusuz mimari.
- **Modular Frontend:** Bileşen tabanlı geliştirme (React) ile kolay bakım.
