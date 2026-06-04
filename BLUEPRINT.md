# LabProject - Vizyon ve Blueprint

## 🌟 Vizyon

**LabProject**, laboratuvar ekosisteminin **"Yönetim ve Denetim Katmanı" (Governance Layer)** olarak konumlanmıştır. Araştırmacıların proje başvurularını, etik kurul izinlerini ve hayvan kullanım kotalarını yöneten merkezi otoritedir.

Diğer modüller (örneğin stok takibi yapan **Dispo**), operasyonel işlemleri için LabProject'ten yetki ve kota bilgisi sorgular. Amacımız, kağıt işlerini ortadan kaldırarak tam dijital ve denetlenebilir bir süreç oluşturmaktır.

## 🏗️ Mimari

LabProject, Apex ekosistemi içinde "Kural Koyucu" (Policy Maker) rolünü üstlenir.

- **Merkezi Otorite:** Tüm etik izinler, protokoller ve süreler tek bir kaynaktan yönetilir.
- **Entegrasyon Hub'ı:** Kimlik doğrulama (Auth) ve yetkilendirme (AuthZ) için Apex platformu ile tam entegre çalışır.
- **Canlı Kota Yönetimi:** Projelerin hayvan kullanım hakları statik bir sayı değil, operasyonel modüllerden gelen verilerle yaşayan bir mekanizmadır.

## 🎨 Tasarım Prensipleri

- **Single Source of Truth:** Proje verisi ve kurallar sadece LabProject'te tutulur.
- **Şeffaflık:** Araştırmacılar, kotalarını ve sürelerini anlık olarak görebilmelidir.
- **Öngörü:** Süresi yaklaşan veya kotası dolmak üzere olan projeler önceden uyarılmalıdır.

## 🗺️ Yol Haritası (Roadmap)

### Faz 1: Temel Yönetim (Tamamlandı ✅)
- [x] Proje oluşturma, düzenleme ve silme.
- [x] Temel kota (Quota) tanımlama.
- [x] Durum (Status) takibi.

### Faz 2: Entegrasyon, Doğrulama ve Yönlendirme (Tamamlandı ✅)
- [x] **Yönlendirme:** `react-router-dom` entegrasyonu ile URL tabanlı yönlendirme (`/`, `/calendar`, `/reports`).
- [x] **SSO Entegrasyonu:** Ön yüzden statik dummy durumların silinmesi ve gerçek zamanlı `useAuth()` oturumunun bağlanması.
- [x] **Zod API Doğrulamaları:** Kayıt/güncelleme gövdelerinin Zod ile doğrulanması, nested kota dizileri ve durumların alan kırpılma (stripping) hatasına karşı koruma altına alınması.
- [x] **Tarih Kuralları:** Başlangıç tarihinin bitiş tarihinden önce olması kontrolü.
- [x] **Takvim Görünümü:** `/calendar` üzerinden projelerin sürelerinin izlenebilmesi.

### Faz 3: Gelişmiş Özellikler (Planlanıyor)
- [ ] **Dispo Entegrasyonu:** Dispo modülünde harcanan her bir hayvanın otomatik olarak LabProject kotasından düşürülmesi.
- [ ] **Otomatik Uyarılar:** Süresi yaklaşan projeler veya dolan kotalar için ön yüz/e-posta bildirimleri.
- [ ] **AI Destekli Form Taraması:** Etik kurul PDF dosyalarının OCR ile okunarak proje verilerinin otomatik doldurulması.
- [ ] **Kullanım Tahminleri:** Geçmiş trendlere göre gelecek dönem kota ihtiyaçlarının tahmin edilmesi.
