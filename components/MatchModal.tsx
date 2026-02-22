"use client";

import { motion, AnimatePresence } from "framer-motion";

type MatchModalProps = {
  name: string;
  age: number;
  course: string;
  onClose: () => void;
};

export default function MatchModal({
  name,
  age,
  course,
  onClose,
}: MatchModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl p-8 w-[360px] text-center shadow-2xl"
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.85 }}
        >
          <h2 className="text-3xl font-bold mb-4">🎉 It’s a Match!</h2>

          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
            {name[0]}
          </div>

          <p className="text-lg font-semibold">{name}</p>
          <p className="text-gray-500">
            {age} • {course}
          </p>

          <button
            onClick={onClose}
            className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow hover:scale-105 transition"
          >
            Continue Swiping
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}