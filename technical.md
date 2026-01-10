# LabProject - Teknik Dokümantasyon

Bu doküman, LabProject modülünün teknik mimarisini, veritabanı yapısını ve API referanslarını detaylandırır.

## 🏗️ Mimari Genel Bakış

LabProject, laboratuvar proje ve etik süreçlerini yöneten bir **Yönetim Modülü (Governance Layer)** olarak tasarlanmıştır. Apex (Auth) ve Dispo (Data) ile entegre çalışır.

- **Frontend:** React ve Vite.
- **Backend:** Vercel Serverless Functions.
- **Veritabanı:** MongoDB (Apex/Dispo ile paylaşılan küme).

## 🗄️ Veritabanı Şeması

### `projects` Koleksiyonu

Kullanılan veritabanı: `LabProject_db` (veya paylaşımlı yapı)

| Alan Adı | Tip | Açıklama |
|---|---|---|
| `_id` | ObjectId | Benzersiz kimlik. |
| `title` | String | Proje başlığı. |
| `code` | String | Etik numarası / Protokol kodu (örn: 2024/001). |
| `pi` | String | Yürütücü (Principal Investigator). |
| `startDate` | String | Başlangıç tarihi. |
| `endDate` | String | Bitiş tarihi. |
| `status` | String | `Active`, `Expired`, `Completed`. |
| `quotas` | Array | Hayvan limitleri (`{species, strain, count}`). |
| `created_at` | Date | Oluşturulma tarihi. |

## 🔌 API Referansı

### `/api/projects`

- **GET**: Tüm projeleri (yeniden eskiye) listeler.
- **POST**: Yeni proje oluşturur.
- **PUT**: Proje bilgilerini veya durumu günceller.

## 🤖 Gelecek Özellikler (AI)

Sistem, `.docx` formatındaki etik kurul dosyalarını okuyup otomatize etmek üzere tasarlanmıştır. Altyapı (`upload` UI ve `api/parse-ethics` taslağı) hazırdır ancak henüz aktif edilmemiştir.
