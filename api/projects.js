import clientPromise from '../lib/mongodb.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db('LabProject_db');
    const collection = db.collection('projects');

    switch (req.method) {
        case 'GET':
            try {
                // Return all projects sorted by creation date (newest first)
                const projects = await collection.find({}).sort({ _id: -1 }).toArray();
                const formatted = projects.map(p => ({
                    ...p,
                    id: p._id.toString()
                }));
                res.status(200).json(formatted);
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
            break;

        case 'POST':
            try {
                const newProject = req.body;
                newProject.createdAt = new Date();
                newProject.status = 'Active'; // Default status

                // Save to DB
                const result = await collection.insertOne(newProject);
                res.status(201).json({ ...newProject, id: result.insertedId.toString() });
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
            break;

        case 'PUT':
            // Update logic (e.g. for status change or edits)
            try {
                const { id, ...updateData } = req.body;
                if (!id) return res.status(400).json({ error: 'ID required' });

                await collection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );
                res.status(200).json({ success: true });
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
