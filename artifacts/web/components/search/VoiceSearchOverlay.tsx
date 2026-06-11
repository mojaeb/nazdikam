import { motion, AnimatePresence } from "framer-motion";

interface VoiceSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (query: string) => void;
}

export function VoiceSearchOverlay({ isOpen, onClose }: VoiceSearchOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-neutral-900/95 z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Animated rings */}
          <div className="relative flex items-center justify-center mb-10">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2 border-blue-400/30"
                style={{
                  width: 80 + i * 48,
                  height: 80 + i * 48,
                }}
                animate={{
                  scale: [1, 1.12, 1],
                  opacity: [0.6, 0.2, 0.6],
                }}
                transition={{
                  duration: 1.8,
                  delay: i * 0.45,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Mic button */}
            <motion.div
              className="relative z-10 w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 013 3v7a3 3 0 01-6 0V5a3 3 0 013-3z" />
                <path d="M19 10v2a7 7 0 01-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </motion.div>
          </div>

          {/* Status text */}
          <motion.p
            className="text-white font-vazirmatn text-base mb-2"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            در حال گوش دادن...
          </motion.p>
          <p className="text-neutral-400 font-vazirmatn text-sm mb-12">
            بگویید چه می‌خواهید جستجو کنید
          </p>

          {/* Stop button */}
          <motion.button
            type="button"
            className="h-11 px-8 rounded-2xl bg-white/10 border border-white/20 text-white font-vazirmatn text-sm hover:bg-white/20 transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            توقف
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
