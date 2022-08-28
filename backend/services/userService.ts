import bcrypt from 'bcryptjs';

import { checkIsValidObjectId } from '../database/db';
import UserModel from '../models/userModel';
import { sanitizeLoginUser, sanitizeUser } from '../sanitizers/userSanitizer';
import { IUserSchema } from '../schema/userSchema';
import { UserReturnType, UserType } from '../types/userTypes';
import HttpException, { ErrorHandler } from '../utils/httpException';
import { generateToken } from './tokenService';

export async function getUsers(): Promise<UserType[]> {
    try {
        const users = await UserModel.find();

        return users;
    } catch (err) {
        throw ErrorHandler(err);
    }
}

export async function createUser(user: UserType): Promise<UserReturnType> {
    const sanitizedUser = await sanitizeUser(user);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(sanitizedUser.password, salt);

    try {
        const newUser = await UserModel.create({
            username: sanitizedUser.username,
            email: sanitizedUser.email,
            password: hashedPassword,
            isAdmin: sanitizedUser.isAdmin,
        });

        return {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            token: generateToken({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
            }),
        };
    } catch (err) {
        throw ErrorHandler(err);
    }
}

export async function getUserById(userId: string): Promise<IUserSchema> {
    checkIsValidObjectId(userId);
    try {
        const user = await UserModel.findById(userId);
        if (user == null) throw new HttpException('User not found', 404);

        return user;
    } catch (err) {
        throw ErrorHandler(err);
    }
}

export async function loginUser(
    email: string,
    password: string
): Promise<UserReturnType> {
    const sanitizedUser = await sanitizeLoginUser(email, password);

    try {
        const user = await UserModel.findOne({ email });
        if (user == null) throw new HttpException('User not found', 404);

        const isPasswordValid = await bcrypt.compare(
            sanitizedUser.password,
            user.password
        );
        if (!isPasswordValid)
            throw new HttpException('Password is invalid', 401);

        return {
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
            }),
        };
    } catch (err) {
        throw ErrorHandler(err);
    }
}

export async function updateUser(
    userId: string,
    user: UserType
): Promise<IUserSchema> {
    checkIsValidObjectId(userId);

    const sanitizedUser = sanitizeUser(user);

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            sanitizedUser,
            { new: true }
        );
        if (updatedUser == null) throw new HttpException('User not found', 404);

        return updatedUser;
    } catch (err) {
        throw ErrorHandler(err);
    }
}

export async function deleteUser(userId: string): Promise<void> {
    checkIsValidObjectId(userId);

    try {
        const user = await UserModel.findByIdAndDelete(userId);
        if (user == null) throw new HttpException('User not found', 404);

        return;
    } catch (err) {
        throw ErrorHandler(err);
    }
}
