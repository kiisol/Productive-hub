export type Task = {
    id: string;
    title: string;
    project: string;
    priority: 'High' | 'Medium' | 'Low';
    done: boolean;
};
