import { motion, AnimatePresence } from "framer-motion";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
}

const VARIANT_STYLES = {
  danger:  { icon: "🗑", confirmCls: "bg-red-600 hover:bg-red-700 text-white" },
  warning: { icon: "⚠️", confirmCls: "bg-amber-500 hover:bg-amber-600 text-white" },
  info:    { icon: "ℹ️", confirmCls: "bg-blue-600 hover:bg-blue-700 text-white" },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "تأیید",
  cancelLabel = "لغو",
  variant = "danger",
}: ConfirmDialogProps) {
  const s = VARIANT_STYLES[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
            >
              <div className="text-3xl mb-3 text-center">{s.icon}</div>
              <h2
                id="confirm-title"
                className="font-iran-yekan-x font-bold text-neutral-900 text-lg text-center mb-2"
              >
                {title}
              </h2>
              <p className="font-vazirmatn text-neutral-500 text-sm text-center leading-relaxed mb-6">
                {message}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 h-10 rounded-xl border border-neutral-200 text-neutral-700 font-vazirmatn text-sm font-medium hover:bg-neutral-50 transition-colors"
                  onClick={onClose}
                >
                  {cancelLabel}
                </button>
                <motion.button
                  type="button"
                  className={`flex-1 h-10 rounded-xl font-vazirmatn text-sm font-bold transition-colors ${s.confirmCls}`}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { onConfirm(); onClose(); }}
                >
                  {confirmLabel}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
