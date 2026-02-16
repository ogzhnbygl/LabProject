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

### Faz 2: Entegrasyon ve Otomasyon
- [ ] **Proje Takvimi:** Tüm projelerin Gantt şeması görünümleri.
- [ ] **Dispo Entegrasyonu:** Dispo'da harcanan her bir hayvanın otomatik olarak LabProject kotasından düşülmesi.
- [ ] **Otomatik Uyarılar:** Süresi yaklaşan projeler veya dolan kotalar için e-posta bildirimleri.

### Faz 3: Akıllı Analiz
- [ ] **AI Destekli Form Doldurma:** Etik kurul PDF dosyalarının taranarak sistemin otomatik doldurulması.
- [ ] **Kullanım Tahminleri:** Geçmiş verilere dayanarak gelecek kota ihtiyaçlarının tahmini.
