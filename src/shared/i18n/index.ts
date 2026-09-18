import { useCallback } from 'react';

const translations = {
    common: {
        cancel: 'Cancel',
        addTask: 'Add task',
        signOut: 'Sign out',
        personal: 'Personal',
    },
    auth: {
        email: 'Email',
        emailPlaceholder: 'you@example.com',
        name: 'Name',
        namePlaceholder: 'Your name',
        invalidEmail: 'Enter a valid email',
        shortPassword: 'Use at least 6 characters',
        nameRequired: 'Enter your name',
        signInError: 'Unable to sign in. Check your email and password.',
        signUpError: 'Unable to create your account. This email may already be registered.',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        signIn: 'Enter your space →',
        signUp: 'Create my space →',
        signingIn: 'Signing in…',
        signingUp: 'Creating your space…',
        haveAccount: 'Already have an account?',
        needAccount: 'Need an account?',
        switchToSignIn: 'Sign in',
        switchToSignUp: 'Create one',
    },
    login: {
        eyebrow: 'A SPACE FOR WHAT MATTERS',
        titleFirst: 'Less noise.',
        titleSecond: 'More meaning.',
        descriptionFirst: 'Gather your tasks, clear your mind',
        descriptionSecond: 'and find your rhythm.',
        footer: 'Small steps change everything.',
        formEyebrow: "LET'S START WELL",
        heading: 'Welcome back',
        subtitle: 'Your plans are waiting for you.',
    },
    navigation: {
        personalSpace: 'Personal space',
        ideas: 'A place for your ideas',
        space: 'SPACE',
        myDay: 'My day',
        tasks: 'Tasks',
        roomForMore: 'Room for more',
        clearMind: 'Good ideas start with a clear mind.',
        mySpace: 'My space',
    },
    tasks: {
        workspace: 'Workspace',
        myDay: 'My day',
        focusEyebrow: 'LESS NOISE. MORE FOCUS.',
        myDayTitle: 'A good day for good work.',
        tasksTitle: 'Big ideas. Small steps.',
        myDaySubtitle: 'Choose what matters and move at your own pace.',
        tasksSubtitle: 'Clear your mind — let your plans live here.',
        newTask: 'New task',
        overview: 'Task overview',
        total: 'Total tasks',
        inProgress: 'In progress',
        completed: 'Completed',
        inYourSpace: 'In your space',
        stepByStep: 'Step by step toward your goal',
        beProud: 'A reason to be proud',
        nextStep: 'Your next step',
        yourTasks: 'Your tasks',
        list: '≡ List',
        filter: 'Task filter',
        all: 'All tasks',
        active: 'In progress',
        done: 'Completed',
        search: 'Search tasks',
        searchPlaceholder: 'Find a task…',
        name: 'TASK NAME',
        priority: 'PRIORITY',
        doneLabel: 'Completed: {title}',
        deleteLabel: 'Delete: {title}',
        noResults: 'Nothing found',
        noResultsHint: 'Try a different task name.',
        empty: 'Nothing here yet',
        emptyHint: 'Add a new task or change the filter.',
        saved: 'Saved in this browser',
        storageError:
            'Your browser could not save changes. They will be available until the page reloads.',
        focus: 'YOUR FOCUS',
        focusTitleFirst: 'Not everything at once.',
        focusTitleSecond: 'One important thing.',
        focusText: 'Choose one task that will make today better. The rest can wait.',
        goToTasks: 'Go to tasks ↗',
        smallWins: 'Small wins',
        smallWinsText: 'Every finished step matters.',
        progress: '{done} of {total} completed',
        progressStarted: 'A great start. Keep going at your own pace.',
        progressEmpty: 'The first win starts with one step.',
        pageNote: 'Your space for clear thoughts and important work.',
        newTaskTitle: 'One step toward a big idea',
        newTaskQuestion: 'What would you like to do?',
        taskName: 'Name',
        taskPlaceholder: 'For example, gather ideas for the project',
    },
    priority: {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
    },
} as const;

type TranslationKey = string;

function getValue(key: TranslationKey): string {
    const value = key.split('.').reduce<unknown>((current, part) => {
        if (typeof current !== 'object' || current === null) return undefined;
        return (current as Record<string, unknown>)[part];
    }, translations);
    return typeof value === 'string' ? value : key;
}

export function t(key: TranslationKey, values: Record<string, string | number> = {}): string {
    return getValue(key).replace(/\{(\w+)\}/g, (_, name: string) =>
        String(values[name] ?? `{${name}}`),
    );
}

export function useTranslation() {
    const translate = useCallback(t, []);
    return { t: translate, language: 'en' as const };
}
