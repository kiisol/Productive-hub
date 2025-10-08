import LoginForm from '@features/auth/LoginForm';
import { Card } from '@shared/ui/Card';

export default function LoginPage() {
  return (
    <div className="min-h-dvh grid place-items-center p-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Card className="w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Welcome back</h2>
        <LoginForm />
      </Card>
    </div>
  );
}
