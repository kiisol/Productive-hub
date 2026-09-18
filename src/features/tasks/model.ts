export type Task = {
    id: string;
    title: string;
    project: string;
    priority: 'High' | 'Medium' | 'Low';
    done: boolean;
};
export const initialTasks: Task[] = [
    {
        id: '1',
        title: 'Collect inspiration for the new project',
        project: 'Productive Hub',
        priority: 'High',
        done: false,
    },
    {
        id: '2',
        title: 'Define the main workflow',
        project: 'Productive Hub',
        priority: 'High',
        done: false,
    },
    {
        id: '3',
        title: 'Sketch the main screen structure',
        project: 'Productive Hub',
        priority: 'Medium',
        done: false,
    },
    { id: '4', title: 'Read for 20 minutes', project: 'Personal', priority: 'Low', done: false },
    {
        id: '5',
        title: 'Review notes and ideas',
        project: 'Personal',
        priority: 'Medium',
        done: true,
    },
    {
        id: '6',
        title: 'Set the focus for the week',
        project: 'Productive Hub',
        priority: 'Medium',
        done: true,
    },
];
