import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { QRContent, WifiSecurity } from "@/lib/qr-content";
import { validateContent } from "@/lib/qr-validation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface ContentFormProps {
  content: QRContent;
  onChange: (content: QRContent) => void;
}

function ValidationMsg({ content }: { content: QRContent }) {
  const hasTouched = (() => {
    switch (content.type) {
      case "website": return content.url.length > 0;
      case "phone": return content.phone.length > 0;
      case "email": return content.email.length > 0;
      case "wifi": return content.ssid.length > 0;
      case "text": return content.text.length > 0;
    }
  })();
  const { valid, message } = validateContent(content);
  if (!hasTouched || valid) return null;
  return <p className="text-xs text-destructive mt-1" role="alert">{message}</p>;
}

export function ContentForm({ content, onChange }: ContentFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  switch (content.type) {
    case "website":
      return (
        <div>
          <p className="section-label">Link</p>
          <Input
            type="url"
            placeholder="https://example.com"
            value={content.url}
            onChange={(e) => onChange({ ...content, url: e.target.value })}
            className="h-12 text-base"
            aria-label="URL to encode"
          />
          <p className="text-xs text-muted-foreground mt-1.5">Enter a full valid URL.</p>
          <ValidationMsg content={content} />
        </div>
      );

    case "phone":
      return (
        <div>
          <p className="section-label">Phone</p>
          <Input
            type="tel"
            placeholder="+1 555 123 4567"
            value={content.phone}
            onChange={(e) => onChange({ ...content, phone: e.target.value })}
            className="h-12 text-base"
            aria-label="Phone number"
          />
          <p className="text-xs text-muted-foreground mt-1.5">Enter the phone number exactly as it should be dialed.</p>
          <ValidationMsg content={content} />
        </div>
      );

    case "email":
      return (
        <div className="space-y-4">
          <p className="section-label">Email</p>
          <div>
            <Label htmlFor="email-addr" className="control-label">Email address</Label>
            <Input
              id="email-addr"
              type="email"
              placeholder="hello@example.com"
              value={content.email}
              onChange={(e) => onChange({ ...content, email: e.target.value })}
              className="h-12 text-base mt-1.5"
              aria-label="Email address"
            />
            <p className="text-xs text-muted-foreground mt-1.5">Enter a valid email address.</p>
            <ValidationMsg content={content} />
          </div>
          <div>
            <Label htmlFor="email-subject" className="control-label">Subject</Label>
            <Input
              id="email-subject"
              placeholder="Optional subject"
              value={content.subject}
              onChange={(e) => onChange({ ...content, subject: e.target.value })}
              className="mt-1.5"
              aria-label="Email subject"
            />
          </div>
          <div>
            <Label htmlFor="email-body" className="control-label">Message</Label>
            <Textarea
              id="email-body"
              placeholder="Optional message body"
              value={content.body}
              onChange={(e) => onChange({ ...content, body: e.target.value })}
              className="mt-1.5"
              aria-label="Email body"
            />
          </div>
        </div>
      );

    case "wifi":
      return (
        <div className="space-y-4">
          <p className="section-label">Wi-Fi</p>
          <div>
            <Label htmlFor="wifi-ssid" className="control-label">Network name (SSID)</Label>
            <Input
              id="wifi-ssid"
              placeholder="MyNetwork"
              value={content.ssid}
              onChange={(e) => onChange({ ...content, ssid: e.target.value })}
              className="h-12 text-base mt-1.5"
              aria-label="Network name"
            />
          </div>
          <div>
            <Label htmlFor="wifi-password" className="control-label">Password</Label>
            <div className="relative mt-1.5">
              <Input
                id="wifi-password"
                type={showPassword ? "text" : "password"}
                placeholder={content.security === "nopass" ? "Not required" : "Enter password"}
                value={content.password}
                onChange={(e) => onChange({ ...content, password: e.target.value })}
                disabled={content.security === "nopass"}
                className="h-12 text-base pr-10"
                aria-label="Wi-Fi password"
              />
              {content.security !== "nopass" && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
          <div className="control-group">
            <Label htmlFor="wifi-security" className="control-label">Security</Label>
            <Select value={content.security} onValueChange={(v) => onChange({ ...content, security: v as WifiSecurity, password: v === "nopass" ? "" : content.password })}>
              <SelectTrigger id="wifi-security">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA / WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="wifi-hidden" className="control-label">Hidden network</Label>
            <Switch
              id="wifi-hidden"
              checked={content.hidden}
              onCheckedChange={(v) => onChange({ ...content, hidden: v })}
              aria-label="Toggle hidden network"
            />
          </div>
          <ValidationMsg content={content} />
        </div>
      );

    case "text":
      return (
        <div>
          <p className="section-label">Text</p>
          <Textarea
            placeholder="Enter text to encode…"
            value={content.text}
            onChange={(e) => onChange({ ...content, text: e.target.value })}
            className="min-h-[120px] text-base"
            aria-label="Text to encode"
          />
          <p className="text-xs text-muted-foreground mt-1.5">Enter the exact text to encode.</p>
          <ValidationMsg content={content} />
        </div>
      );
  }
}
