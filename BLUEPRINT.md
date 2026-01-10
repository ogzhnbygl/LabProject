# LabProject - Vizyon ve Blueprint

## 🎯 Amaç
**LabProject**, laboratuvarın "Yönetim/Policy" katmanıdır. Deney hayvanı kullanımının yasal ve etik sınırlara uygunluğunu denetleyen, projelerin yaşam döngüsünü (başvuru -> izin -> bitiş) takip eden merkezi bir otoritedir.

## 🌟 Vizyon
- **Merkezi Kontrol:** Tüm etik izinler tek bir dijital dosyada.
- **Entegrasyon:** Dispo, hayvan düşerken LabProject'e "İzin var mı?" diye sorar.
- **Otomasyon (Gelecek):** Etik kurul kararlarını yapay zeka ile okuyup sisteme otomatik işler.

## 🧩 Modüller

1.  **Proje Kartı:** Projenin kimliği, yürütücüsü ve tarihleri.
2.  **Akıllı Kota (Smart Quota):** Hangi türden kaç hayvan kullanma hakkı kaldı?
3.  **Proje Takvimi:** Süresi dolan izinler için erken uyarı sistemi.

## 🏗️ Kullanılacak Teknolojiler
- React + Vite + TailwindCSS (Frontend)
- Vercel Serverless (Backend)
- MongoDB (Database)
- Google Gemini / OpenAI (Gelecek: AI Parsing)
