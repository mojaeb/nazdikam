import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { ApiErrorBanner } from "@/components/dashboard/shared/ApiErrorBanner";
import {
  businessEntitlementsQueryKey,
  fetchEntitlements,
} from "@/lib/subscription-api";
import {
  canUploadVideos,
  maxVideoFileSizeMb,
  uploadVideo,
  businessVideosQueryKey,
  type VideoDto,
} from "@/lib/video-api";
import {
  extractVideoCover,
  formatFileSize,
  getVideoDuration,
} from "@/lib/video-utils";

function CloseIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder,
}: {
  tags: string[];
  onAdd: (t: string) => void;
  onRemove: (t: string) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const handleKey = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput("");
    }
  };
  return (
    <div className="min-h-11 flex flex-wrap gap-1.5 p-2 border border-neutral-200 rounded-xl focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all bg-neutral-50">
      {tags.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-purple-100 text-purple-700 text-xs font-vazirmatn">
          {t}
          <button type="button" onClick={() => onRemove(t)} className="text-purple-400 hover:text-purple-700 w-4 h-4 flex items-center justify-center" aria-label={`حذف ${t}`}>
            <CloseIcon size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm font-vazirmatn text-neutral-700 placeholder:text-neutral-400 px-1"
      />
    </div>
  );
}

function UploadProgressBar({ percent }: { percent: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-vazirmatn text-neutral-500">
        <span>در حال آپلود…</span>
        <span>{percent}٪</span>
      </div>
      <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-purple-600"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </div>
  );
}

interface VideoUploadSheetProps {
  open: boolean;
  businessId: number;
  onClose: () => void;
}

export function VideoUploadSheet({ open, businessId, onClose }: VideoUploadSheetProps) {
  const queryClient = useQueryClient();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverBlob, setCoverBlob] = useState<Blob | null>(null);
  const [coverIsAuto, setCoverIsAuto] = useState(false);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [productId, setProductId] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);

  const { data: entitlements, refetch: refetchEntitlements } = useQuery({
    queryKey: businessEntitlementsQueryKey(businessId),
    queryFn: () => fetchEntitlements(businessId),
    enabled: businessId > 0,
    staleTime: 0,
  });

  useEffect(() => {
    if (open && businessId > 0) {
      void refetchEntitlements();
    }
  }, [open, businessId, refetchEntitlements]);

  const { data: products = [] } = useQuery({
    queryKey: [`/api/businesses/${businessId}/products`] as const,
    queryFn: async (): Promise<Product[]> => {
      const res = await fetch(`/api/businesses/${businessId}/products`, { credentials: "include" });
      if (!res.ok) return [];
      const body = (await res.json()) as { data?: Product[] };
      return body.data ?? [];
    },
    enabled: open && businessId > 0,
    staleTime: 60_000,
  });
  const uploadAllowed = canUploadVideos(entitlements);
  const maxMb = maxVideoFileSizeMb(entitlements);

  const resetForm = () => {
    setVideoFile(null);
    setCoverPreview(null);
    setCoverBlob(null);
    setCoverIsAuto(false);
    setCaption("");
    setTags([]);
    setProductId("");
    setUploadProgress(0);
    setIsUploading(false);
    setIsPreparing(false);
    setError(null);
    setDurationSeconds(null);
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const handleVideoSelect = async (file: File | null) => {
    if (!file) return;
    setError(null);

    const maxBytes = maxMb * 1024 * 1024;
    if (maxBytes > 0 && file.size > maxBytes) {
      setError(new Error(`حداکثر حجم ویدیو ${maxMb} مگابایت است`));
      return;
    }

    setIsPreparing(true);
    try {
      const [cover, duration] = await Promise.all([
        extractVideoCover(file),
        getVideoDuration(file).catch(() => null),
      ]);
      setVideoFile(file);
      setCoverBlob(cover);
      setCoverPreview(URL.createObjectURL(cover));
      setCoverIsAuto(true);
      setDurationSeconds(duration);
    } catch (err) {
      setError(err);
    } finally {
      setIsPreparing(false);
    }
  };

  const handleCoverSelect = (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    setCoverBlob(file);
    setCoverPreview(URL.createObjectURL(file));
    setCoverIsAuto(false);
  };

  const handleSubmit = async () => {
    if (!videoFile || !coverBlob) return;
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const created = await uploadVideo({
        businessId,
        video: videoFile,
        cover: coverBlob,
        caption,
        tags,
        productId: productId ? Number(productId) : null,
        durationSeconds,
        onProgress: setUploadProgress,
      });

      queryClient.setQueryData<VideoDto[]>(
        businessVideosQueryKey(businessId),
        (prev) => [created, ...(prev ?? [])],
      );
      await queryClient.invalidateQueries({ queryKey: businessEntitlementsQueryKey(businessId) });
      onClose();
    } catch (err) {
      setError(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isUploading ? onClose : undefined}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl px-6 pt-4 pb-10 max-h-[92vh] overflow-y-auto"
            dir="rtl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-neutral-200" />
            </div>

            <h2 className="font-iran-yekan-x font-bold text-neutral-900 text-xl mb-1">افزودن ویدیو</h2>
            <p className="font-vazirmatn text-sm text-neutral-500 mb-5">
              {uploadAllowed
                ? `حداکثر حجم: ${maxMb} مگابایت`
                : "آپلود ویدیو در پلان فعلی شما فعال نیست"}
            </p>

            {!uploadAllowed ? (
              <ApiErrorBanner
                error={new Error("آپلود ویدیو در پلان فعلی شما فعال نیست. اگر پلان پیشرفته دارید، صفحه را رفرش کنید.")}
              />
            ) : (
              <div className="space-y-4">
                {/* Video picker */}
                <div>
                  <label className="block text-sm font-vazirmatn font-medium text-neutral-700 mb-2">
                    فایل ویدیو
                  </label>
                  {videoFile ? (
                    <div className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-200 bg-neutral-50">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2" aria-hidden="true">
                          <polygon points="23 7 16 12 23 17 23 7" />
                          <rect x="1" y="5" width="15" height="14" rx="2" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-vazirmatn text-neutral-800 truncate" dir="ltr">{videoFile.name}</p>
                        <p className="text-xs text-neutral-400">{formatFileSize(videoFile.size)}</p>
                      </div>
                      {!isUploading && (
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFile(null);
                            setCoverPreview(null);
                            setCoverBlob(null);
                          }}
                          className="text-neutral-400 hover:text-red-500 p-1"
                          aria-label="حذف ویدیو"
                        >
                          <CloseIcon />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isPreparing}
                      onClick={() => videoInputRef.current?.click()}
                      className={cn(
                        "w-full h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors",
                        isPreparing
                          ? "border-purple-200 bg-purple-50"
                          : "border-neutral-200 hover:border-purple-300 hover:bg-neutral-50",
                      )}
                    >
                      {isPreparing ? (
                        <span className="text-sm font-vazirmatn text-purple-600">در حال آماده‌سازی کاور…</span>
                      ) : (
                        <>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="1.8" aria-hidden="true">
                            <polygon points="23 7 16 12 23 17 23 7" />
                            <rect x="1" y="5" width="15" height="14" rx="2" />
                          </svg>
                          <span className="text-sm font-vazirmatn text-neutral-600">انتخاب ویدیو (MP4, WebM, MOV)</span>
                        </>
                      )}
                    </button>
                  )}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      void handleVideoSelect(e.target.files?.[0] ?? null);
                      e.target.value = "";
                    }}
                  />
                </div>

                {/* Cover */}
                {coverPreview && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-vazirmatn font-medium text-neutral-700">
                        کاور ویدیو
                      </label>
                      {coverIsAuto && (
                        <span className="text-[11px] font-vazirmatn text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                          از اولین فریم
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 items-start">
                      <img
                        src={coverPreview}
                        alt="کاور ویدیو"
                        className="w-24 h-32 rounded-xl object-cover border border-neutral-200"
                      />
                      {!isUploading && (
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          className="text-xs font-vazirmatn text-purple-600 hover:text-purple-800 mt-1"
                        >
                          تغییر کاور
                        </button>
                      )}
                    </div>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => handleCoverSelect(e.target.files?.[0] ?? null)}
                    />
                  </div>
                )}

                {/* Caption */}
                <div>
                  <label className="block text-sm font-vazirmatn font-medium text-neutral-700 mb-2">
                    کپشن
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    disabled={isUploading}
                    rows={3}
                    placeholder="توضیح کوتاه درباره ویدیو…"
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-vazirmatn text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 resize-none"
                  />
                </div>

                {products.length > 0 ? (
                  <div>
                    <label className="block text-sm font-vazirmatn font-medium text-neutral-700 mb-2">
                      محصول مرتبط <span className="text-neutral-400 font-normal">(اختیاری)</span>
                    </label>
                    <select
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      disabled={isUploading}
                      className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-vazirmatn text-neutral-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400"
                    >
                      <option value="">بدون محصول</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {/* Tags */}
                <div>
                  <label className="block text-sm font-vazirmatn font-medium text-neutral-700 mb-2">
                    تگ‌ها
                  </label>
                  <TagInput
                    tags={tags}
                    onAdd={(t) => !tags.includes(t) && setTags([...tags, t])}
                    onRemove={(t) => setTags(tags.filter((x) => x !== t))}
                    placeholder="تگ را بنویسید و Enter بزنید"
                  />
                </div>

                {isUploading && <UploadProgressBar percent={uploadProgress} />}

                {error ? <ApiErrorBanner error={error} /> : null}

                <motion.button
                  type="button"
                  disabled={!videoFile || !coverBlob || isUploading || isPreparing}
                  onClick={() => void handleSubmit()}
                  className={cn(
                    "w-full h-12 rounded-2xl font-vazirmatn font-bold text-sm text-white transition-colors",
                    !videoFile || !coverBlob || isUploading || isPreparing
                      ? "bg-neutral-300 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700",
                  )}
                  whileTap={{ scale: 0.97 }}
                >
                  {isUploading ? "در حال آپلود…" : "انتشار ویدیو"}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
