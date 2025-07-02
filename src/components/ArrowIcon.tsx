interface ArrowIconProps {
  direction: "UP" | "DOWN";
  color: string;
}

export default function ArrowIcon({ direction, color }: ArrowIconProps) {
  return (
    <svg
      className={`inline ml-1 w-4 h-4 transition-transform duration-200 relative top-[-2px] ${
        direction === "UP" ? "rotate-180" : ""
      }`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color }}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}
