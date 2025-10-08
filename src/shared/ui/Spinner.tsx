export function Spinner({ size = 16 }: { size?: number }) {
  const s = { width: size, height: size };
  return (
    <span
      role="status"
      aria-label="loading"
      className="inline-block animate-spin rounded-full border-2 border-gray-300 dark:border-gray-700 border-t-blue-500"
      style={s}
    />
  );
}
