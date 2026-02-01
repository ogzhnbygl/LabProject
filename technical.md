# LabProject - Teknik Dokümantasyon

Bu doküman, LabProject modülünün teknik mimarisini, veri modellerini ve API referanslarını detaylandırır.

## 🏗️ Mimari Genel Bakış

LabProject, laboratuvar proje ve etik süreçlerini yöneten bir **Yönetim Modülü (Governance Layer)** olarak tasarlanmıştır.

- **Frontend:** React (Vite build tool) ile geliştirilmiş Single Page Application (SPA).
- **Backend:** Vercel Serverless Functions (`/api` klasörü altında) ile mikroservis yaklaşımı.
- **Veritabanı:** MongoDB. Projeler JSON dokümanları olarak saklanır.
- **Auth:** Apex platformu üzerinden kimlik doğrulama (planlanan entegrasyon).

## 🗄️ Veritabanı Şeması

### `projects` Koleksiyonu

Kullanılan veritabanı: `LabProject_db`

| Alan Adı | Tip | Açıklama |
|---|---|---|
| `_id` | ObjectId | Benzersiz kayıt kimliği. |
| `title` | String | Proje başlığı. |
| `pi` | String | Yürütücü (Principal Investigator). |
| `code` | String | **Etik No**. Projenin etik kurul numarası (örn: 2024/001). |
| `protocol` | String | **Protokol No**. İsteğe bağlı protokol numarası. |
| `ethicsStartDate` | Date/String | Etik izin başlangıç tarihi. |
| `ethicsEndDate` | Date/String | Etik izin bitiş tarihi. |
| `startDate` | Date/String | Proje çalışma başlangıç tarihi. |
| `endDate` | Date/String | Proje çalışma bitiş tarihi. |
| `status` | String | Enum: `Active`, `Continuing`, `Completed`, `Cancelled`, `Expired`. |
| `workRulesForm` | Boolean | Çalışma Kuralları Formu teslim edildi mi? |
| `projectNotebook` | Boolean | Proje Defteri teslim edildi mi? |
| `quotas` | Array | Hayvan kotaları listesi. |
| `created_at` | Date | Kayıt oluşturulma zamanı. |

#### Status (Durum) Tanımları
- **Active:** Proje aktif olarak başlamış durumda.
- **Continuing:** Proje devam ediyor (uzatma vs. durumları).
- **Completed:** Proje başarıyla tamamlandı.
- **Cancelled:** Proje iptal edildi.
- **Expired:** Projenin süresi doldu.

#### Quota Objesi Yapısı
`quotas` dizisi içindeki her bir eleman şu yapıdadır:
```json
{
  "species": "Fare",      // Tür (Fare, Sıçan, Tavşan)
  "strain": "BALB/c",     // Suş
  "sex": "Erkek",         // Cinsiyet (Erkek, Dişi, Erkek ve Dişi)
  "count": 50,            // Toplam izin verilen sayı
  "used": 10              // Şu ana kadar kullanılan sayı
}
```

## 🔌 API Referansı

### `/api/projects`

- **GET**: Tüm projeleri listeler. `created_at` tarihine göre yeniden eskiye sıralı döner. Opsiyonel query parametresi `id` ile tekil proje detayı çeker.
- **POST**: Yeni proje oluşturur.
- **PUT**: Mevcut bir projeyi günceller. Body içinde tüm proje objesini bekler.
- **DELETE**: Projeyi siler. Query string'de `id` parametresini bekler.

## 💻 Frontend Mantığı

### Bileşen Hiyerarşisi
- `App.jsx`: Ana layout ve routing (basit state tabanlı routing).
- `ProjectList.jsx`: Projelerin listelendiği, filtrelendiği ve sayfalandığı ana ekran.
- `ProjectForm.jsx`: Proje oluşturma ve düzenleme modal/sayfası.
- `ProjectReports.jsx`: İstatistiksel özet ekranı.

### Filtreleme ve Arama
Liste ekranında çift katmanlı filtreleme uygulanır:
1. **Status Filtresi:** Dropdown üzerinden seçilen duruma göre (Tümü, Aktif, vb.) filtreleme.
2. **Arama Input:** `code` (Etik No), `title` ve `pi` alanlarında "contains" mantığı ile arama.

### Raporlama
`ProjectReports` bileşeni, mevcut proje listesi üzerinden (client-side) anlık hesaplama yapar:
- Toplam proje sayısı
- Durum bazlı (Aktif, Tamamlandı vb.) dağılım sayıları
