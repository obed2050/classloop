export default function PostsGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {items.map((item) => (
        <img key={item.id} src={item.image} alt={item.caption || item.title} className="aspect-square rounded-3xl object-cover transition hover:opacity-90" />
      ))}
    </div>
  );
}
