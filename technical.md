# LabProject - Teknik Dokümantasyon

Bu doküman, LabProject modülünün teknik mimarisini, veri modellerini ve API referanslarını detaylandırır.

## 🏗️ Mimari Genel Bakış

LabProject, laboratuvar proje ve etik süreçlerini yöneten bir **Yönetim Modülü (Governance Layer)** olarak tasarlanmıştır.

- **Frontend:** React (Vite build tool) ile geliştirilmiş SPA.
- **Backend:** Vercel Serverless Functions (`/api` klasörü altında) ile mikroservis mimarisi.
- **Veritabanı:** MongoDB. Projeler JSON dokümanları olarak saklanır.

## 🗄️ Veritabanı Şeması

### `projects` Koleksiyonu

Kullanılan veritabanı: `LabProject_db`

| Alan Adı | Tip | Açıklama |
|---|---|---|
| `_id` | ObjectId | Benzersiz kayıt kimliği. |
| `title` | String | Proje başlığı. |
| `code` | String | **Etik No**. Projenin etik kurul numarası (örn: 2024/001). |
| `protocol` | String | **Protokol No**. Projeye ait protokol numarası. |
| `pi` | String | Yürütücü (Principal Investigator). |
| `startDate` | String | Başlangıç tarihi (YYYY-MM-DD). |
| `endDate` | String | Bitiş tarihi (YYYY-MM-DD). |
| `status` | String | Proje durumu: `Active`, `Expired`, `Cancelled`, `Completed`. |
| `quotas` | Array | Hayvan kotaları listesi. |
| `created_at` | Date | Kayıt oluşturulma zamanı. |

#### Quota Objesi Yapısı
`quotas` dizisi içindeki her bir eleman şu yapıdadır:
```json
{
  "species": "Fare",
  "strain": "BALB/c",
  "sex": "Erkek",
  "count": 50,  // Toplam izin verilen sayı
  "used": 10    // Şu ana kadar kullanılan sayı
}
```

## 🔌 API Referansı

### `/api/projects`

- **GET**: Tüm projeleri listeler. `created_at` tarihine göre yeniden eskiye sıralı döner.
- **POST**: Yeni proje oluşturur.
    - Zorunlu alanlar: `title`, `code`, `pi`, `startDate`, `endDate`.
    - `protocol` alanı opsiyoneldir ancak doldurulması önerilir.
- **PUT**: Mevcut bir projeyi günceller. `id` parametresini body içinde bekler.
- **DELETE**: Projeyi siler. `id` parametresini bekler.

## 💻 Frontend Mantığı

### Kota Hesplama
Proje formunda, hayvan kotaları başlığı yanında gösterilen özet bilgi (Kullanılan / Toplam) frontend tarafında anlık hesaplanır:
- **Toplam Kota:** `quotas` dizisindeki tüm `count` değerlerinin toplamı.
- **Toplam Kullanılan:** `quotas` dizisindeki tüm `used` değerlerinin toplamı.

### Filtreleme
Liste ekranında yapılan arama şu alanları kapsar:
1. `code` (Etik No)
2. `title` (Proje Başlığı)
3. `pi` (Yürütücü)
