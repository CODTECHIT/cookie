import express from 'express';
import { getSiteBootstrap } from '../controllers/bootstrap.controller.js';

const router = express.Router();

// ⚡ Get all initial site data in ONE call
router.get('/bootstrap', getSiteBootstrap);

export default router;
