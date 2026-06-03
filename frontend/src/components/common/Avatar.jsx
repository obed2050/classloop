export default function Avatar({ src, name = 'User', size = 'md', ring = false }) {
  const sizes = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-2xl',
  };
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const image = src ? (
    <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover`} />
  ) : (
    <span className={`${sizes[size]} grid place-items-center rounded-full bg-hover font-semibold text-slate-900`}>
      {initials || 'CL'}
    </span>
  );

  return ring ? <span className="accent-ring inline-flex rounded-full">{image}</span> : image;
}
