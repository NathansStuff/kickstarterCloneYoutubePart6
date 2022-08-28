import express from 'express';
import { protect } from '../models/authMiddleware';

import {
    getProjectsHandler,
    createProjectHandler,
    getProjectHandler,
    deleteProjectHandler,
    updateProjectHandler,
} from '../controllers/projectController';
const projectRoutes = express.Router();

projectRoutes
    .route('/')
    .get(getProjectsHandler)
    .post(protect, createProjectHandler);
projectRoutes
    .route('/:id')
    .get(getProjectHandler)
    .put(protect, updateProjectHandler)
    .delete(protect, deleteProjectHandler);

export default projectRoutes;
