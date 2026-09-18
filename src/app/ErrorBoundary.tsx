import { Component, ReactNode } from 'react';

type Props = {
    fallback?: ReactNode;
    children?: ReactNode;
};
type State = { error?: Error };

export class ErrorBoundary extends Component<Props, State> {
    state: State = { error: undefined };
    static getDerivedStateFromError(error: Error) { return { error }; }
    render() {
        if (this.state.error) {
            return this.props.fallback ?? <div>Something went wrong</div>;
        }
        return this.props.children ?? null;
    }
}
