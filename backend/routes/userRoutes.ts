import express from 'express';
import { protect } from '../models/authMiddleware';

import {
    getUsersHandler,
    createUserHandler,
    getUserHandler,
    deleteUserHandler,
    updateUserHandler,
    loginUserHandler,
} from '../controllers/userController';
const userRoutes = express.Router();

userRoutes.route('/').get(protect, getUsersHandler).post(createUserHandler);
userRoutes.route('/login').post(loginUserHandler);
userRoutes
    .route('/:id')
    .get(getUserHandler)
    .put(protect, updateUserHandler)
    .delete(protect, deleteUserHandler);

export default userRoutes;
