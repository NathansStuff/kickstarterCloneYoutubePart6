import { checkIsValidObjectId } from '../database/db';
import ProjectModel from '../models/projectModel';
import { sanitizeProject } from '../sanitizers/projectSanitizer';
import { IProjectSchema } from '../schema/projectSchema';
import { ProjectType } from '../types/projectTypes';
import { ErrorHandler } from '../utils/httpException';

export async function getProjects(): Promise<ProjectType[]> {
    try {
        const projects = await ProjectModel.find();

        return projects;
    } catch (err) {
        throw ErrorHandler(err);
    }
}

export async function createProject(
    project: ProjectType
): Promise<ProjectType> {
    const sanitizedProject = sanitizeProject(project);

    try {
        const newProject = await ProjectModel.create(sanitizedProject);

        return newProject;
    } catch (err: unknown) {
        throw ErrorHandler(err);
    }
}

export async function getProjectById(
    projectId: string
): Promise<IProjectSchema> {
    checkIsValidObjectId(projectId);
    try {
        const project = await ProjectModel.findById(projectId);
        if (project == null) throw new Error('Project not found');

        return project;
    } catch (err) {
        throw ErrorHandler(err);
    }
}

export async function updateProject(
    projectId: string,
    project: ProjectType
): Promise<IProjectSchema> {
    checkIsValidObjectId(projectId);

    const sanitizedProject = sanitizeProject(project);

    try {
        const updatedProject = await ProjectModel.findByIdAndUpdate(
            projectId,
            sanitizedProject,
            { new: true }
        );
        if (updatedProject == null) throw new Error('Project not found');

        return updatedProject;
    } catch (err) {
        throw ErrorHandler(err);
    }
}

export async function deleteProject(projectId: string): Promise<void> {
    checkIsValidObjectId(projectId);

    try {
        const project = await ProjectModel.findByIdAndDelete(projectId);
        if (project == null) throw new Error('Project not found');

        return;
    } catch (err) {
        throw ErrorHandler(err);
    }
}
