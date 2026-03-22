import { CONTENT_TYPE_OPTIONS, type ContentType } from "@/lib/qr-content";

interface TypeSelectorProps {
  value: ContentType;
  onChange: (type: ContentType) => void;
}

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div>
      <p className="section-label">Type</p>
      <div className="flex flex-wrap gap-2">
        {CONTENT_TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 
              ${value === opt.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            aria-pressed={value === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
