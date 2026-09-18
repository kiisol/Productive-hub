import { useEffect, useState } from 'react';
import type { Task } from './model';
import * as api from './service';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [storageError, setStorageError] = useState(false);

    useEffect(() => {
        let active = true;
        api.getTasks()
            .then((next) => {
                if (active) setTasks(next);
            })
            .catch(() => {
                if (active) {
                    setTasks([]);
                    setStorageError(true);
                }
            });
        return () => {
            active = false;
        };
    }, []);

    return {
        tasks,
        storageError,
        add: async (title: string, priority: Task['priority']) => {
            const task = await api.createTask(title, priority);
            setTasks((current) => [...current, task]);
            setStorageError(false);
        },
        toggle: async (id: string) => {
            const current = tasks.find((task) => task.id === id);
            if (!current) return;
            const updated = await api.updateTask(id, { done: !current.done });
            setTasks((items) => items.map((task) => (task.id === id ? updated : task)));
        },
        remove: async (id: string) => {
            await api.deleteTask(id);
            setTasks((current) => current.filter((task) => task.id !== id));
        },
    };
}
