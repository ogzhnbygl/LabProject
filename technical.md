# LabProject - Teknik Dokümantasyon

Bu doküman, LabProject modülünün teknik mimarisini, veri modellerini ve API referanslarını detaylandırır.

## 🏗️ Mimari Genel Bakış

LabProject, laboratuvar proje ve etik süreçlerini yöneten bir **Yönetim Modülü (Governance Layer)** olarak tasarlanmıştır.

- **Frontend:** React (Vite) SPA.
- **Backend:** Vercel Serverless Functions (`/api`).
- **Veritabanı:** MongoDB (Projeler JSON dokümanları olarak saklanır).
- **Auth:** Apex platformu üzerinden kimlik doğrulama.

## 📂 Dizin Yapısı

```
LabProject/
├── api/                # Backend API (Vercel Serverless Functions)
│   ├── index.js        # Ana API endpoint'i
│   └── lib/            # Ortak kütüphaneler
├── src/                # Frontend Kaynak Kodları
│   ├── components/     # UI Bileşenleri
│   ├── pages/          # Sayfa Görünümleri
│   ├── lib/            # Yardımcı Fonksiyonlar
│   └── App.jsx         # Ana Uygulama
└── public/             # Statik Dosyalar
```

## 🗄️ Veritabanı Şeması

### Koleksiyon: `projects`
Veritabanı: `LabProject_db`

| Alan Adı | Tip | Açıklama |
|---|---|---|
| `_id` | ObjectId | Benzersiz kayıt kimliği. |
| `title` | String | Proje başlığı. |
| `pi` | String | Yürütücü (Principal Investigator). |
| `code` | String | **Etik No** (örn: 2024/001). |
| `protocol` | String | **Protokol No**. |
| `ethicsStartDate` | Date | Etik izin başlangıç tarihi. |
| `ethicsEndDate` | Date | Etik izin bitiş tarihi. |
| `status` | String | Durum: `Active`, `Continuing`, `Completed`, `Cancelled`, `Expired`. |
| `workRulesForm` | Boolean | Çalışma Kuralları Formu teslim durumu. |
| `quotas` | Array | Hayvan kotaları listesi. |

#### Quota Objesi Yapısı
```json
{
  "species": "Fare",
  "strain": "BALB/c",
  "sex": "Erkek",
  "count": 50,
  "used": 10
}
```

## 🔌 API Referansı & Rotalar

### Ön Yüz Yönlendirmeleri (`react-router-dom`)
- `/` - Proje Listesi ve Yönetim Arayüzü (Ana sayfa)
- `/calendar` - Proje Süre ve Takvim Görünümü
- `/reports` - İstatistiksel Grafik ve Rapor Paneli

### Sunucu API Endpoint'leri (Zod Validasyonlu)
API istek gövdeleri sunucu tarafında Zod şemaları ile sıkı doğrulama aşamasına tabi tutulur. 

#### Projeler API (`/api/projects`)
- **GET `/api/projects`**: Sistemdeki tüm projeleri listeler.
- **POST `/api/projects`**: Yeni bir proje kaydeder. Gönderilen veri gövdesi Zod şeması ile kontrol edilir.
- **PUT `/api/projects`**: Mevcut bir projeyi (durumunu, tarihlerini, kotalarını vb.) günceller.
- **DELETE `/api/projects?id={id}`**: Belirtilen ID'ye sahip projeyi siler.

#### 🛡️ Zod Doğrulama ve Alan Kırpma (Parameter Stripping) Koruması
MongoDB güncellemelerinde formdan gönderilen verilerin kaybolmaması için Zod şeması aşağıdaki nested alt yapıları da tam olarak kapsayacak şekilde tanımlanmıştır:
- `quotas`: Tür (`species`), suş (`strain`), cinsiyet (`sex`), limit (`count`) ve kullanılan (`used`) verilerini içeren dizi.
- `status`: Projenin güncel durumu.
- `workRulesForm`: Çalışma kuralları formu teslimat durumu (Boolean).
- Tarih validasyonunda, `ethicsStartDate` < `ethicsEndDate` kuralı hem sunucuda hem ön yüzde kontrol edilir.

## 💻 Ön Yüz Oturum Entegrasyonu

`App.jsx` üzerinde bulunan eski statik dummy kullanıcı durumları (user, loading) tamamen temizlenerek, projenin en dış sarmalayıcısı olan `<AuthProvider>` üzerinden beslenen gerçek `useAuth()` context'ine bağlanmıştır. Böylece SSO oturum akışı ve kullanıcı izinleri alt uygulamada hatasız şekilde senkronize çalışır.

