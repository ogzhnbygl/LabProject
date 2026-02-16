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

## 🔌 API Referansı

### `/api/projects`

- **GET**: Tüm projeleri listeler. `created_at` tarihine göre yeniden eskiye sıralı döner.
- **POST**: Yeni proje oluşturur.
- **PUT**: Mevcut bir projeyi günceller.
- **DELETE**: Projeyi siler. Query string'de `id` parametresini bekler.

## 💻 Frontend Mantığı

### Bileşen Hiyerarşisi
- `App.jsx`: Ana layout ve routing.
- `ProjectList.jsx`: Projelerin listelendiği ana ekran.
- `ProjectForm.jsx`: Proje oluşturma ve düzenleme modalı.
- `ProjectReports.jsx`: İstatistiksel özet ekranı.
