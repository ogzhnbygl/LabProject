import clientPromise from '../lib/mongodb.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const client = await clientPromise;
        const db = client.db('LabProject_db');
        const collection = db.collection('calendar');

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
