import clientPromise from '../lib/mongodb.js';

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db('LabProject_db');
    const collection = db.collection('calendar');

    if (req.method === 'GET') {
        try {
            // Fetch all calendar events from the collection
            const events = await collection.find({}).toArray();

            const formatted = events.map(e => ({
                ...e,
                id: e._id.toString(),
                projectId: e.projectId ? e.projectId.toString() : null
            }));

            return res.status(200).json(formatted);
        } catch (e) {
            console.error('Fetch calendar events error:', e);
            return res.status(500).json({ error: 'Takvim verileri alınırken sunucu hatası oluştu.' });
        }
    }

    if (req.method === 'POST') {
        try {
            const cookieHeader = req.headers.cookie || '';
            let userRole = 'user';
            let userEmail = '';

            // 1. Auth check: standard verify or development mock fallback
            const isDevMock = process.env.NODE_ENV === 'development' && !cookieHeader.includes('interapp_session');
            if (isDevMock) {
                userRole = 'admin';
                userEmail = 'dev@wildtype.app';
            } else {
                const apexResponse = await fetch('https://wildtype.app/api/auth/me', {
                    method: 'GET',
                    headers: {
                        'Cookie': cookieHeader,
                        'Content-Type': 'application/json'
                    }
                });

                if (!apexResponse.ok) {
                    return res.status(401).json({ error: 'Kimlik doğrulama başarısız.' });
                }

                const userData = await apexResponse.json();
                userEmail = userData.email;

                const apexDb = client.db('Apex_db');
                const dbUser = await apexDb.collection('users').findOne({ email: userEmail });
                if (dbUser) {
                    userRole = dbUser.role;
                }
            }

            if (userRole !== 'admin') {
                return res.status(403).json({ error: 'Bu işlem için yetkiniz bulunmamaktadır.' });
            }

            // 2. Perform synchronization
            await collection.deleteMany({});

            const projects = await db.collection('projects').find({
                startDate: { $exists: true, $ne: '' },
                endDate: { $exists: true, $ne: '' }
            }).toArray();

            if (projects.length > 0) {
                const colors = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
                const syncDocs = projects.map((p, idx) => ({
                    projectId: p._id,
                    title: p.title,
                    pi: p.pi,
                    code: p.code,
                    startDate: p.startDate,
                    endDate: p.endDate,
                    color: colors[idx % colors.length],
                    createdAt: new Date()
                }));
                await collection.insertMany(syncDocs);
            }

            return res.status(200).json({ success: true, message: 'Bütün projeler başarıyla takvimle senkronize edildi!' });
        } catch (e) {
            console.error('Calendar sync error:', e);
            return res.status(500).json({ error: 'Senkronizasyon sırasında hata oluştu.' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
