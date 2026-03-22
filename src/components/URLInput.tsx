import { Input } from "@/components/ui/input";
import { validateUrl } from "@/lib/qr-validation";

interface URLInputProps {
  url: string;
  onChange: (url: string) => void;
}

export function URLInput({ url, onChange }: URLInputProps) {
  const touched = url.length > 0;
  const { valid, message } = validateUrl(url);

  return (
    <div>
      <p className="section-label">Link</p>
      <Input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 text-base"
        aria-label="URL to encode"
        aria-invalid={touched && !valid}
      />
      <p className="text-xs text-muted-foreground mt-1.5">
        Enter a full valid URL.
      </p>
      {touched && !valid && (
        <p className="text-xs text-destructive mt-1" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
