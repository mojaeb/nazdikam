import { motion } from "framer-motion";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function DefaultEmptyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-20 h-20 rounded-3xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-4">
        {icon ?? <DefaultEmptyIcon />}
      </div>
      <p className="font-iran-yekan-x font-bold text-neutral-700 text-lg mb-2">{title}</p>
      {description && (
        <p className="font-vazirmatn text-neutral-400 text-sm leading-relaxed max-w-xs">{description}</p>
      )}
      {action && (
        <motion.button
          type="button"
          className="mt-5 h-10 px-6 rounded-xl bg-blue-600 text-white font-vazirmatn text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
          whileTap={{ scale: 0.97 }}
          onClick={action.onClick}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
