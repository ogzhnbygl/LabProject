import { verifyAuth } from '../../lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const user = await verifyAuth(req, 'labproject');
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        return res.status(200).json({
            email: user.email,
            name: user.name || user.email.split('@')[0],
            role: user.role,
            apps: user.apps || []
        });

    } catch (error) {
        console.error('Session API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
