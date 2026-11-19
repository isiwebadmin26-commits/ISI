// src/components/chat/FileAttachmentCard.tsx
import React from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  FileCheck, 
  File as GenericFile, 
  Download, 
  X,
  ExternalLink 
} from 'lucide-react';

interface FileAttachmentCardProps {
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl?: string;
  onRemove?: () => void;
  isRemovable?: boolean;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getFileIcon(type: string, name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (type.includes('pdf') || ext === 'pdf') {
    return <FileText className="w-5 h-5 text-red-500" />;
  }
  if (
    type.includes('sheet') || 
    type.includes('excel') || 
    type.includes('csv') || 
    ext === 'xlsx' || 
    ext === 'xls' || 
    ext === 'csv'
  ) {
    return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
  }
  if (type.includes('word') || ext === 'docx' || ext === 'doc') {
    return <FileCheck className="w-5 h-5 text-blue-500" />;
  }
  return <GenericFile className="w-5 h-5 text-amber-500" />;
}

export const FileAttachmentCard: React.FC<FileAttachmentCardProps> = ({
  fileName,
  fileSize,
  fileType,
  fileUrl,
  onRemove,
  isRemovable = false
}) => {
  return (
    <div className="flex items-center justify-between gap-3 p-2.5 px-3 rounded-xl border border-border/80 bg-muted/40 dark:bg-slate-900/40 hover:bg-muted/60 transition-colors max-w-sm">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-2 rounded-lg bg-background border border-border/60 shrink-0">
          {getFileIcon(fileType, fileName)}
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-foreground truncate max-w-[180px] sm:max-w-[220px]" title={fileName}>
            {fileName}
          </p>
          <span className="text-[11px] text-muted-foreground">
            {formatFileSize(fileSize)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {fileUrl && (
          <a
            href={fileUrl}
            download={fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </a>
        )}

        {isRemovable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
