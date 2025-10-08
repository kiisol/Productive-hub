import { TextInput } from './TextInput';
import type { FieldError } from 'react-hook-form';

type Props = React.ComponentProps<typeof TextInput> & { errorObj?: FieldError };
export function FormField({ error, errorObj, ...rest }: Props) {
  const err = error ?? errorObj?.message ?? null;
  return <TextInput {...rest} error={typeof err === 'string' ? err : null} />;
}
