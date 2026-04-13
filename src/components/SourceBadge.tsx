interface SourceBadgeProps {
  source: string;
  color: string;
}

export default function SourceBadge({ source, color }: SourceBadgeProps) {
  return (
    <span className="source-pill">
      <span
        style={{ backgroundColor: color }}
        className="w-1.5 h-1.5 rounded-full inline-block"
      />
      {source}
    </span>
  );
}
