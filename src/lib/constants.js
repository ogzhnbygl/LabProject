export const STRAINS = {
    'Fare': ['BALB/c', 'C57BL/6', 'CD-1 (ICR)', 'Athymic Nude'],
    'Sıçan': ['Wistar', 'Sprague Dawley'],
    'Tavşan': ['New Zealand White']
};

export const REMOVAL_REASONS = [
    {
        id: 'EXP',
        label: '1. KATEGORİ: Deneysel Nedenler (EXP)',
        options: [
            { code: 'EXP-01', label: 'EXP-01: Proje Sonu Sakrifikasyon (Scheduled Sacrifice)', description: 'Deney protokolü gereği belirlenen günde yapılan sonlandırma.', requiresProject: true },
            { code: 'EXP-02', label: 'EXP-02: Doku/Organ Temini (Tissue Harvest)', description: 'Canlı bir deney protokolü olmaksızın, sadece ex vivo çalışmalar için doku almak amacıyla yapılan sonlandırma.', requiresProject: true },
            { code: 'EXP-03', label: 'EXP-03: İnsani Sonlandırma Noktası (Humane Endpoint - Deneysel)', description: 'Deney süresince hayvanın ağrı/stres skoru belirlenen limitleri aştığı için, proje tamamlanmadan etik gereği yapılan ötenazi.', requiresProject: true },
            { code: 'EXP-04', label: 'EXP-04: Pilot Çalışma Sonlandırması', description: 'Ana deney öncesi doz/yöntem belirleme çalışmaları sonucu çıkarma.', requiresProject: true }
        ]
    },
    {
        id: 'COL',
        label: '2. KATEGORİ: Üretim ve Koloni Yönetimi (COL)',
        options: [
            { code: 'COL-01', label: 'COL-01: Damızlık Dışı (Retired Breeder)', description: 'Üreme verimi düşen veya yaş haddini dolduran damızlıkların sürüden çıkarılması.' },
            { code: 'COL-02', label: 'COL-02: Genotip Uyumsuzluğu (Wrong Genotype)', description: 'Transgenik/Knockout üretimlerinde istenen genotipe sahip olmayan yavruların (örn. Wild Type veya Heterozigot fazlası) elenmesi.' },
            { code: 'COL-03', label: 'COL-03: Cinsiyet Fazlası (Sex Surplus)', description: 'Projede sadece tek cinsiyet (örn. sadece erkek) gerektiğinde, dişi yavruların sürüden çıkarılması.' },
            { code: 'COL-04', label: 'COL-04: Sütten Kesim Fazlası (Weaning Surplus)', description: 'Stok ihtiyacından fazla doğan ve deneyde kullanılmayacak yavruların elenmesi (Culling).' },
            { code: 'COL-05', label: 'COL-05: Yaşlılık/Stok Yönetimi (Age/Inventory Control)', description: 'Deneye girmemiş ancak deney için uygun yaş aralığını (örn. >12 hafta) geçmiş hayvanların çıkarılması.' }
        ]
    },
    {
        id: 'CLIN',
        label: '3. KATEGORİ: Klinik ve Sağlık Nedenleri (CLIN)',
        options: [
            { code: 'CLIN-01', label: 'CLIN-01: Klinik Hastalık (Non-Experimental)', description: 'Deneyden bağımsız gelişen tümör, apse, maloklüzyon (diş uzaması) vb. nedenlerle ötenazi.' },
            { code: 'CLIN-02', label: 'CLIN-02: Yaralanma/Travma', description: 'Kafes arkadaşı kavgası (bites), sıkışma veya kaza sonucu oluşan tedavi edilemez yaralanmalar.' },
            { code: 'CLIN-03', label: 'CLIN-03: Doğum Komplikasyonları (Dystocia)', description: 'Güç doğum veya doğum sonrası anneyi/yavruları kurtarmak adına yapılan müdahaleler ve sonlandırmalar.' },
            { code: 'CLIN-04', label: 'CLIN-04: Sağlık Taraması/Sentinel (Sentinel Sacrifice)', description: 'Koloni sağlık durumunu izlemek amacıyla kullanılan mihmandar (sentinel) hayvanların rutin nekropsisi.' },
            { code: 'CLIN-05', label: 'CLIN-05: Enfeksiyon Kontrolü (Outbreak Control)', description: 'Bulaşıcı bir hastalığın yayılmasını önlemek amacıyla yapılan koruyucu itlaf.' }
        ]
    },
    {
        id: 'MORT',
        label: '4. KATEGORİ: Spontan Ölümler (MORT)',
        options: [
            { code: 'MORT-01', label: 'MORT-01: Doğal Ölüm/Eksitus (Found Dead)', description: 'Sabah kontrolünde kafeste ölü bulunan, nedeni bilinmeyen veya yaşlılığa bağlı ölümler.' },
            { code: 'MORT-02', label: 'MORT-02: Anestezi/Cerrahi Kaybı (Periprocedural Death)', description: 'Deney sırasında anestezi komplikasyonu veya cerrahi esnasında masada kalma durumu.', requiresProject: true },
            { code: 'MORT-03', label: 'MORT-03: Kanibalizm', description: 'Ebeveyn veya kafes arkadaşları tarafından yenmiş/parçalanmış olarak bulunma.' }
        ]
    },
    {
        id: 'ADM',
        label: '5. KATEGORİ: İdari ve Lojistik (ADM)',
        options: [
            { code: 'ADM-01', label: 'ADM-01: Kurum İçi Transfer', description: 'Aynı kurumda başka bir araştırıcıya veya odaya devir.' },
            { code: 'ADM-02', label: 'ADM-02: Kurum Dışı Transfer', description: 'Başka bir üniversite veya araştırma merkezine gönderim.' },
            { code: 'ADM-03', label: 'ADM-03: Kayıp/Firar (Missing)', description: 'Kafeste bulunamayan (kaçış veya kaydı var ama kendisi yok) hayvanlar.' }
        ]
    }
];
