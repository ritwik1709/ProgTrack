import express from 'express';
import joi from 'joi';
import mongoose from 'mongoose';
import Project from '../models/index.js'
import authRouter from './auth.js'
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const api = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// JWT auth middleware
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided.' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}

// All project routes below require authentication
api.use(['/projects', '/project', '/project/:id', '/project/:id/*'], requireAuth);

api.get('/projects', async (req, res) => {
    try {
        const data = await Project.find(
          { 'members.user': req.user.id },
          { task: 0, __v: 0 }
        )
        return res.send(data)
    } catch (error) {
        return res.send(error)
    }
})

api.get('/project/:id', async (req, res) => {
    if (!req.params.id) res.status(422).send({ data: { error: true, message: 'Id is reaquire' } })
    try {
        const data = await Project.find({ _id: mongoose.Types.ObjectId(req.params.id) })
          .populate('members.user', 'username email')
          .sort({ order: 1 })
        return res.send(data)
    } catch (error) {
        return res.send(error)
    }
})

api.post('/project', async (req, res) => {
    // validate type 
    const project = joi.object({
        title: joi.string().min(3).max(100).required(),
        description: joi.string().required(),
    })

    // validation
    const { error, value } = project.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)

    // insert data 
    try {
        const data = await new Project({
          ...value,
          members: [{ user: mongoose.Types.ObjectId(req.user.id), role: 'Owner' }]
        }).save()
        res.send({ data: { title: data.title, description: data.description, updatedAt: data.updatedAt, _id: data._id } })
    } catch (e) {
        if (e.code === 11000) {
            return res.status(422).send({ data: { error: true, message: 'title must be unique' } })
        } else {
            return res.status(500).send({ data: { error: true, message: 'server error' } })
        }
    }
})

// Helper to check if user is Owner
function isOwner(project, userId) {
  return project.members.some(m => {
    if (!m.user) return false;
    // Convert both to strings for comparison
    return m.user.toString() === userId.toString() && m.role === 'Owner';
  });
}

// Update project details (Owner only)
api.put('/project/:id', async (req, res) => {
    const project = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })
    const { error, value } = project.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)
    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).send({ error: true, message: 'Project not found' });
    if (!isOwner(proj, req.user.id)) return res.status(403).send({ error: true, message: 'Only Owner can edit project' });
    Project.updateOne({ _id: req.params.id }, { ...value }, { upsert: true }, (error, data) => {
        if (error) {
            res.send(error)
        } else {
            res.send(data)
        }
    })
})

// Delete project (Owner only)
api.delete('/project/:id', async (req, res) => {
    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).send({ error: true, message: 'Project not found' });
    if (!isOwner(proj, req.user.id)) return res.status(403).send({ error: true, message: 'Only Owner can delete project' });
    try {
        const data = await Project.deleteOne({ _id: req.params.id })
        res.send(data)
    } catch (error) {
        res.send(error)
    }
})

// Helper to get user role in project
function getUserRole(project, userId) {
  const member = project.members.find(m => m.user && m.user.toString() === userId.toString());
  return member ? member.role : null;
}

//  task api   

api.post('/project/:id/task', async (req, res) => {
    if (!req.params.id) return res.status(500).send(`server error`);
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send({ error: true, message: 'Project not found' });
    const role = getUserRole(project, req.user.id);
    if (!role || role === 'Viewer') return res.status(403).send({ error: true, message: 'Only Owners and Members can add tasks' });
    // validate type 
    const task = joi.object({
        title: joi.string().min(3).max(100).required(),
        description: joi.string().required(),
    })
    const { error, value } = task.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)
    try {
        const [{ task }] = await Project.find({ _id: mongoose.Types.ObjectId(req.params.id) }, { "task.index": 1 }).sort({ 'task.index': 1 })
        let countTaskLength = [task.length, task.length > 0 ? Math.max(...task.map(o => o.index)) : task.length];
        const data = await Project.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $push: { task: { ...value, stage: "Requested", order: countTaskLength[0], index: countTaskLength[1] + 1 } } })
        return res.send(data)
    } catch (error) {
        return res.status(500).send(error)
    }
})

api.get('/project/:id/task/:taskId', async (req, res) => {

    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);

    // res.send(req.params)
    try {

        let data = await Project.find(
            { _id: mongoose.Types.ObjectId(req.params.id) },
            {
                task: {
                    $filter: {
                        input: "$task",
                        as: "task",
                        cond: {
                            $in: [
                                "$$task._id",
                                [
                                    mongoose.Types.ObjectId(req.params.taskId)
                                ]
                            ]
                        }
                    }
                }
            })
        if (data[0].task.length < 1) return res.status(404).send({ error: true, message: 'record not found' })
        return res.send(data)
    } catch (error) {
        return res.status(5000).send(error)
    }


})


api.put('/project/:id/task/:taskId', async (req, res) => {
    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send({ error: true, message: 'Project not found' });
    const role = getUserRole(project, req.user.id);
    if (!role || role === 'Viewer') return res.status(403).send({ error: true, message: 'Only Owners and Members can edit tasks' });
    const task = joi.object({
        title: joi.string().min(3).max(100).required(),
        description: joi.string().required(),
    })
    const { error, value } = task.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)
    try {
        const data = await Project.updateOne({
            _id: mongoose.Types.ObjectId(req.params.id),
            task: { $elemMatch: { _id: mongoose.Types.ObjectId(req.params.taskId) } }
        }, { $set: { "task.$.title": value.title, "task.$.description": value.description } })
        return res.send(data)
    } catch (error) {
        return res.send(error)
    }
})

api.delete('/project/:id/task/:taskId', async (req, res) => {
    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send({ error: true, message: 'Project not found' });
    const role = getUserRole(project, req.user.id);
    if (!role || role === 'Viewer') return res.status(403).send({ error: true, message: 'Only Owners and Members can delete tasks' });
    try {
        const data = await Project.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $pull: { task: { _id: mongoose.Types.ObjectId(req.params.taskId) } } })
        res.send(data)
    } catch (error) {
        res.send(error)
    }
})

api.put('/project/:id/todo', async (req, res) => {
    let todo = []

    for (const key in req.body) {
        // todo.push({ items: req.body[key].items, name: req.body[key]?.name })
        for (const index in req.body[key].items) {
            req.body[key].items[index].stage = req.body[key].name
            todo.push({ name: req.body[key].items[index]._id, stage: req.body[key].items[index].stage, order: index })
        }
    }

    todo.map(async (item) => {
        await Project.updateOne({
            _id: mongoose.Types.ObjectId(req.params.id),
            task: { $elemMatch: { _id: mongoose.Types.ObjectId(item.name) } }
        }, { $set: { "task.$.order": item.order, "task.$.stage": item.stage } })
    })

    res.send(todo)
})

// api.use('/project/:id/task', async (req, res, next) => {
//     if (req.method !== "GET") return next()

//     if (!req.params.id) return res.status(500).send(`server error`);

//     try {
//         const data = await Project.find({ _id: mongoose.Types.ObjectId(req.params.id) }, { task: 1 })
//         return res.send(data)
//     } catch (error) {
//         return res.send(error)
//     }


// })

// api.get('/project/:id/task/:taskId', (req, res) => {
//     res.send(req.params)
// })

api.use('/auth', authRouter)

// List project members
api.get('/project/:id/members', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members.user', 'username email');
    if (!project) return res.status(404).send({ error: true, message: 'Project not found' });
    res.send(project.members);
  } catch (err) {
    res.status(500).send({ error: true, message: 'Server error' });
  }
});

// Add/invite member to project (Owner only)
api.post('/project/:id/members', async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role) return res.status(400).send({ error: true, message: 'Email and role are required' });
  if (!['Owner', 'Member', 'Viewer'].includes(role)) return res.status(400).send({ error: true, message: 'Invalid role' });
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send({ error: true, message: 'Project not found' });
    if (!isOwner(project, req.user.id)) return res.status(403).send({ error: true, message: 'Only Owner can add members' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: true, message: 'User not found' });
    if (project.members.some(m => m.user.equals(user._id))) return res.status(400).send({ error: true, message: 'User already a member' });
    project.members.push({ user: user._id, role });
    await project.save();
    res.send({ success: true, message: 'Member added', member: { user: user._id, role } });
  } catch (err) {
    res.status(500).send({ error: true, message: 'Server error' });
  }
});

// Change member role (Owner only)
api.put('/project/:id/members/:userId', async (req, res) => {
  const { role } = req.body;
  if (!['Owner', 'Member', 'Viewer'].includes(role)) return res.status(400).send({ error: true, message: 'Invalid role' });
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send({ error: true, message: 'Project not found' });
    if (!isOwner(project, req.user.id)) return res.status(403).send({ error: true, message: 'Only Owner can change roles' });
    const member = project.members.find(m => m.user.equals(req.params.userId));
    if (!member) return res.status(404).send({ error: true, message: 'Member not found' });
    member.role = role;
    await project.save();
    res.send({ success: true, message: 'Role updated', member });
  } catch (err) {
    res.status(500).send({ error: true, message: 'Server error' });
  }
});

// Remove member (Owner only)
api.delete('/project/:id/members/:userId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send({ error: true, message: 'Project not found' });
    if (!isOwner(project, req.user.id)) return res.status(403).send({ error: true, message: 'Only Owner can remove members' });
    const memberIdx = project.members.findIndex(m => m.user.equals(req.params.userId));
    if (memberIdx === -1) return res.status(404).send({ error: true, message: 'Member not found' });
    project.members.splice(memberIdx, 1);
    await project.save();
    res.send({ success: true, message: 'Member removed' });
  } catch (err) {
    res.status(500).send({ error: true, message: 'Server error' });
  }
});

// Health check route
api.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

export default api