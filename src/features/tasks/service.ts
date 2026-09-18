import { http } from '@shared/api/http';
import type { Task } from './model';

export function getTasks(): Promise<Task[]> {
    return http.get<Task[]>('/tasks');
}

export function createTask(title: string, priority: Task['priority']): Promise<Task> {
    return http.post<Task>('/tasks', { title, priority, project: 'Personal' });
}

export function updateTask(
    id: string,
    changes: Partial<Pick<Task, 'done' | 'title' | 'priority'>>,
): Promise<Task> {
    return http.patch<Task>(`/tasks/${id}`, changes);
}

export function deleteTask(id: string): Promise<void> {
    return http.delete<void>(`/tasks/${id}`);
}
