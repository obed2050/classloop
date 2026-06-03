export default function BrandLogo({ className = 'h-12 w-12', alt = 'ClassLoop logo' }) {
  return (
    <img
      src="/ibhe_logo.png"
      alt={alt}
      className={`${className} rounded-full object-cover shadow-[0_10px_18px_rgba(15,23,42,0.10)]`}
    />
  );
}
