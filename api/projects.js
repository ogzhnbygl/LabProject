import clientPromise from '../lib/mongodb.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db('LabProject_db');
    const collection = db.collection('projects');

    switch (req.method) {
        case 'GET':
            try {
                const { id } = req.query;

                if (id) {
                    if (!ObjectId.isValid(id)) {
                        return res.status(400).json({ error: 'Invalid Project ID format' });
                    }
                    const project = await collection.findOne({ _id: new ObjectId(id) });
                    if (!project) return res.status(404).json({ error: 'Project not found' });
                    return res.status(200).json({ ...project, id: project._id.toString() });
                }

                // Return all projects summary sorted by creation date (Projection Applied)
                const projects = await collection.find({})
                    .project({
                        title: 1,
                        code: 1,
                        pi: 1,
                        ethicsStartDate: 1,
                        ethicsEndDate: 1,
                        status: 1,
                        createdAt: 1
                    })
                    .sort({ _id: -1 })
                    .toArray();

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

                // Calendar synchronization
                if (newProject.startDate && newProject.endDate) {
                    const colors = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];

                    await db.collection('calendar').insertOne({
                        projectId: result.insertedId,
                        title: newProject.title,
                        pi: newProject.pi,
                        code: newProject.code,
                        startDate: newProject.startDate,
                        endDate: newProject.endDate,
                        color: randomColor,
                        createdAt: new Date()
                    });
                }

                res.status(201).json({ ...newProject, id: result.insertedId.toString() });
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
            break;

        case 'PUT':
            // Update logic (e.g. for status change or edits)
            try {
                const { id, _id, ...updateData } = req.body;
                if (!id) return res.status(400).json({ error: 'ID required' });

                await collection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );

                // Calendar synchronization
                if (updateData.startDate && updateData.endDate) {
                    const existingEvent = await db.collection('calendar').findOne({ projectId: new ObjectId(id) });
                    if (existingEvent) {
                        await db.collection('calendar').updateOne(
                            { projectId: new ObjectId(id) },
                            {
                                $set: {
                                    title: updateData.title || existingEvent.title,
                                    pi: updateData.pi || existingEvent.pi,
                                    code: updateData.code || existingEvent.code,
                                    startDate: updateData.startDate,
                                    endDate: updateData.endDate
                                }
                            }
                        );
                    } else {
                        const colors = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
                        const randomColor = colors[Math.floor(Math.random() * colors.length)];

                        await db.collection('calendar').insertOne({
                            projectId: new ObjectId(id),
                            title: updateData.title || '',
                            pi: updateData.pi || '',
                            code: updateData.code || '',
                            startDate: updateData.startDate,
                            endDate: updateData.endDate,
                            color: randomColor,
                            createdAt: new Date()
                        });
                    }
                } else if (updateData.startDate === '' || updateData.endDate === '') {
                    // Dates removed
                    await db.collection('calendar').deleteOne({ projectId: new ObjectId(id) });
                }

                res.status(200).json({ success: true });
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
            break;

        case 'DELETE':
            try {
                const id = req.body?.id || req.query?.id;
                if (!id) return res.status(400).json({ error: 'ID required' });

                const result = await collection.deleteOne({ _id: new ObjectId(id) });
                
                // Calendar synchronization
                await db.collection('calendar').deleteOne({ projectId: new ObjectId(id) });

                if (result.deletedCount === 1) {
                    res.status(200).json({ success: true });
                } else {
                    res.status(404).json({ error: 'Project not found' });
                }
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
