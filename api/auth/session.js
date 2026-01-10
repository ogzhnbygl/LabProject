import clientPromise from '../../lib/mongodb.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // 1. Verify Identity with Apex (Forwarding Cookies)
        // We must forward the 'cookie' header so Apex receives the interapp_session
        const cookieHeader = req.headers.cookie || '';

        const apexResponse = await fetch('https://wildtype.app/api/auth/me', {
            method: 'GET',
            headers: {
                'Cookie': cookieHeader,
                'Content-Type': 'application/json'
            }
        });

        if (!apexResponse.ok) {
            // If Apex says no (401/403), we say no.
            return res.status(apexResponse.status).json({ error: 'Authentication failed' });
        }

        const userData = await apexResponse.json();
        const userEmail = userData.email;

        // 2. Verify Authorization with Database (Apex_db)
        const client = await clientPromise;
        // Correct DB name from screenshot is 'Apex_db' (Case Sensitive)
        const db = client.db('Apex_db');
        const user = await db.collection('users').findOne({ email: userEmail });

        if (!user) {
            console.error(`User not found in Apex_db for email: ${userEmail}`);
            return res.status(403).json({ error: 'Kullanıcı veritabanında bulunamadı.' });
        }

        // Check Permissions: Admin OR has 'dispo' app access (case-insensitive)
        const isAdmin = user.role === 'admin';
        const hasDispoAccess = Array.isArray(user.apps) && user.apps.some(app => app.toLowerCase() === 'dispo');

        if (isAdmin || hasDispoAccess) {
            // Success! Return the user data (merged or from Apex)
            return res.status(200).json({
                ...userData,
                // Ensure we return the authoritative role/permissions from DB if needed
                role: user.role,
                apps: user.apps
            });
        } else {
            console.warn(`Access denied for ${userEmail}. Role: ${user.role}, Apps: ${JSON.stringify(user.apps)}`);
            return res.status(403).json({
                error: 'Bu uygulamaya erişim yetkiniz bulunmamaktadır.'
            });
        }

    } catch (error) {
        console.error('Session API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
