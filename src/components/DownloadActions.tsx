import { Button } from "@/components/ui/button";
import { Download, FileImage } from "lucide-react";

interface DownloadActionsProps {
  disabled: boolean;
  onDownloadPng: () => void;
  onDownloadSvg: () => void;
}

export function DownloadActions({ disabled, onDownloadPng, onDownloadSvg }: DownloadActionsProps) {
  return (
    <div>
      <p className="section-label">Download</p>
      <div className="flex flex-col gap-2.5">
        <Button
          onClick={onDownloadPng}
          disabled={disabled}
          className="w-full h-11 gap-2"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </Button>
        <Button
          variant="outline"
          onClick={onDownloadSvg}
          disabled={disabled}
          className="w-full h-11 gap-2"
        >
          <FileImage className="w-4 h-4" />
          Download SVG
        </Button>
      </div>
    </div>
  );
}
