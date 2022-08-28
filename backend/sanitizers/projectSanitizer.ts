import { ProjectType } from '../types/projectTypes';
import HttpException from '../utils/httpException';

export function sanitizeProject(project: ProjectType): ProjectType {
    const sanitizedProject: ProjectType = {
        title: '',
    };

    sanitizedProject.title = sanitizeTitle(project.title);

    return sanitizedProject;
}

function sanitizeTitle(title: string): string {
    // Types
    if (title === undefined) {
        throw new HttpException('Title is undefined', 400);
    }
    if (typeof title !== 'string') {
        throw new HttpException('Title is not a string', 400);
    }

    // Attributes
    title = title.trim();
    if (title.length < 3) {
        throw new HttpException('Title must be at least 3 characters', 400);
    }
    if (title.length > 50) {
        throw new HttpException('Title mut be less then 50 characters', 400);
    }

    return title;
}
