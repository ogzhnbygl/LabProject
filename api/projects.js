import clientPromise from '../lib/mongodb.js';
import { ObjectId } from 'mongodb';
import { verifyAuth } from '../lib/auth.js';
import { z } from 'zod';

const quotaSchema = z.object({
    species: z.string(),
    strain: z.string(),
    sex: z.string(),
    count: z.coerce.number().int().nonnegative(),
    used: z.coerce.number().int().nonnegative().optional().default(0)
});

const projectPostSchema = z.object({
    title: z.string().min(1, 'Proje başlığı gereklidir.'),
    code: z.string().min(1, 'Proje kodu gereklidir.'),
    protocol: z.string().optional().default(''),
    pi: z.string().min(1, 'Yürütücü (PI) adı gereklidir.'),
    ethicsStartDate: z.string().optional(),
    ethicsEndDate: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.string().optional().default('Active'),
    workRulesForm: z.coerce.boolean().optional().default(false),
    projectNotebook: z.coerce.boolean().optional().default(false),
    quotas: z.array(quotaSchema).optional().default([]),
    animalQuota: z.coerce.number().int().nonnegative('Hayvan kotası negatif olamaz.').optional().default(0),
    budget: z.coerce.number().nonnegative('Bütçe negatif olamaz.').optional().default(0),
    description: z.string().optional().default('')
});

const projectPutSchema = projectPostSchema.partial().extend({
    id: z.string().refine(val => ObjectId.isValid(val), 'Geçersiz Proje ID formatı.')
});

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const user = await verifyAuth(req, 'labproject');
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

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
                const validation = projectPostSchema.safeParse(req.body);
                if (!validation.success) {
                    return res.status(400).json({ error: validation.error.errors[0].message });
                }
                const newProject = validation.data;
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
            try {
                const validation = projectPutSchema.safeParse(req.body);
                if (!validation.success) {
                    return res.status(400).json({ error: validation.error.errors[0].message });
                }
                const { id, ...updateData } = validation.data;

                await collection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { ...updateData, updatedAt: new Date() } }
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
