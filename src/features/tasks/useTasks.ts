import { useState } from 'react';
import { initialTasks, type Task } from './model';
const key = 'productive-hub.tasks.v2';
function readTasks(): Task[] {
    try {
        const saved: unknown = JSON.parse(localStorage.getItem(key) ?? 'null');
        if (
            Array.isArray(saved) &&
            saved.every(
                (t) =>
                    t &&
                    typeof t.id === 'string' &&
                    typeof t.title === 'string' &&
                    typeof t.project === 'string' &&
                    typeof t.done === 'boolean' &&
                    ['High', 'Medium', 'Low'].includes(t.priority),
            )
        )
            return saved;
    } catch {
        /* Use examples when storage is unavailable. */
    }
    return initialTasks;
}
export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>(readTasks);
    const [storageError, setStorageError] = useState(false);
    function update(next: Task[]) {
        setTasks(next);
        try {
            localStorage.setItem(key, JSON.stringify(next));
            setStorageError(false);
        } catch {
            setStorageError(true);
        }
    }
    return {
        tasks,
        storageError,
        add: (title: string, priority: Task['priority']) =>
            update([
                ...tasks,
                { id: crypto.randomUUID(), title, priority, project: 'Personal', done: false },
            ]),
        toggle: (id: string) =>
            update(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
        remove: (id: string) => update(tasks.filter((t) => t.id !== id)),
    };
}
