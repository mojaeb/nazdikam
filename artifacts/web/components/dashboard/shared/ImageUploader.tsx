import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  id: string;
  url: string;       /* data URL or gradient string for placeholder */
  isPlaceholder?: boolean;
  gradient?: string;
}

interface ImageUploaderProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  maxImages?: number;
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* Preset gradient placeholders for quick demo adds */
const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
  "linear-gradient(135deg, #10B981 0%, #065F46 100%)",
  "linear-gradient(135deg, #F59E0B 0%, #92400E 100%)",
  "linear-gradient(135deg, #EF4444 0%, #7F1D1D 100%)",
  "linear-gradient(135deg, #8B5CF6 0%, #4C1D95 100%)",
  "linear-gradient(135deg, #EC4899 0%, #831843 100%)",
];

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function MoveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" /><polyline points="15 19 12 22 9 19" /><polyline points="19 9 22 12 19 15" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" />
    </svg>
  );
}

export function ImageUploader({ images, onChange, maxImages = 6 }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const canAddMore = images.length < maxImages;

  const handleFiles = (files: FileList | null) => {
    if (!files || !canAddMore) return;
    const remaining = maxImages - images.length;
    const toProcess = Array.from(files).slice(0, remaining).filter(f => f.type.startsWith("image/"));
    if (toProcess.length === 0) return;

    Promise.all(
      toProcess.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const url = e.target?.result as string;
              if (url) resolve(url);
              else reject(new Error("read failed"));
            };
            reader.onerror = () => reject(reader.error ?? new Error("read failed"));
            reader.readAsDataURL(file);
          }),
      ),
    ).then((urls) => {
      onChange([
        ...images,
        ...urls.map((url) => ({ id: genId(), url })),
      ]);
    }).catch(() => {
      /* ignore read errors */
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const addPlaceholder = () => {
    if (!canAddMore) return;
    const gradient = PLACEHOLDER_GRADIENTS[images.length % PLACEHOLDER_GRADIENTS.length];
    onChange([...images, { id: genId(), url: gradient, isPlaceholder: true, gradient }]);
  };

  const remove = (id: string) => {
    onChange(images.filter(img => img.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    const next = [...images];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {canAddMore && (
        <motion.div
          className={cn(
            "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors",
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : "border-neutral-200 hover:border-blue-300 hover:bg-neutral-50"
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          role="button"
          tabIndex={0}
          aria-label="آپلود تصویر"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
        >
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mx-auto mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p className="font-vazirmatn text-sm text-neutral-600 font-medium">
            کلیک کنید یا فایل را اینجا بکشید
          </p>
          <p className="font-vazirmatn text-xs text-neutral-400 mt-1">
            JPG, PNG یا WebP — حداکثر {maxImages} تصویر
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            aria-hidden="true"
          />
        </motion.div>
      )}

      {/* Demo: Add placeholder button */}
      {canAddMore && (
        <button
          type="button"
          className="w-full text-xs font-vazirmatn text-neutral-400 hover:text-blue-600 py-1 transition-colors"
          onClick={(e) => { e.stopPropagation(); addPlaceholder(); }}
        >
          + افزودن رنگ پیش‌نمایش (نمایشی)
        </button>
      )}

      {/* Image grid */}
      <AnimatePresence>
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                className="relative rounded-xl overflow-hidden aspect-square group"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
              >
                {/* Image / gradient */}
                {img.isPlaceholder ? (
                  <div className="w-full h-full" style={{ background: img.gradient }} />
                ) : (
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                )}

                {/* Cover badge */}
                {i === 0 && (
                  <span className="absolute top-1.5 start-1.5 text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-md">
                    کاور
                  </span>
                )}

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* Reorder buttons */}
                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    aria-label="جابجایی به جلو"
                  >
                    <MoveIcon />
                  </button>

                  {/* Remove */}
                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg bg-red-500/80 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
                    onClick={() => remove(img.id)}
                    aria-label="حذف تصویر"
                  >
                    <XIcon />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Counter */}
      {images.length > 0 && (
        <p className="font-vazirmatn text-xs text-neutral-400 text-end">
          {images.length} از {maxImages} تصویر
        </p>
      )}
    </div>
  );
}
