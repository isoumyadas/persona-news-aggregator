export default function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="shimmer h-56 rounded-2xl" />
      ))}
    </div>
  );
}
