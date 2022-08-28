import express from 'express';
import * as Colors from 'colors.ts';

import { connectDB } from './database/db';
import { errorHandler } from './middleware/errorMiddleware';
import { PORT } from './utils/config';
import projectRoutes from './routes/projectRoutes';
import userRoutes from './routes/userRoutes';

Colors.colors('', '');

export const db = async (): Promise<void> => {
    await connectDB();
};

void db();

const app = express();
app.use(express.json());

app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
