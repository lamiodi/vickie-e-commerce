export function Field({ label, id, help, children }) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium">
          {label}
        </label>
      )}
      {children}
      {help && (
        <p id={`${id}-help`} className="text-xs text-gray-500">
          {help}
        </p>
      )}
    </div>
  );
}

export function TextInput({ id, ...props }) {
  return <input id={id} className="border p-2 w-full rounded" {...props} />;
}

export function Select({ id, children, ...props }) {
  return (
    <select id={id} className="border p-2 w-full rounded" {...props}>
      {children}
    </select>
  );
}
