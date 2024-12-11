import express, { Router, Request, Response } from 'express';
import { User } from '../models/user'; 
export class UserController {

  async createUser(req, res) {
    if (!req.body || 
        typeof req.body.name !== 'string' || 
        typeof req.body.firstname !== 'string' || 
        typeof req.body.role !== 'string' || 
        typeof req.body.email !== 'string' || 
        typeof req.body.password !== 'string') {
      res.status(400).end(); 
      return;
    }
    
    try {
      const { name, firstname, role, email, password } = req.body;
      const user = await User.create({ name, firstname, role, email, password });
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating user' }); 
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  }

  async getUserById(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({ error: 'User not found' }); 
        return;
      }
      res.status(200).json(user); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching user' });
    }
  }

  buildRouter() {
    const router = Router();
    
    router.post('/', express.json(), this.createUser.bind(this));
    router.get('/', this.getAllUsers.bind(this));
    router.get('/:id', this.getUserById.bind(this));

    return router;
  }
}
