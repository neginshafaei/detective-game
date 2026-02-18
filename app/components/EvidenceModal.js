"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EvidenceModal({ doc, onClose }) {
  if (!doc) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl max-h-[85vh] bg-[#f9f7f2] shadow-2xl flex flex-col rounded-lg border border-[#d1cfc7] overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-32 h-2 bg-[#e2e0d8] rounded-tr-full" />

          <div className="pt-8 px-6 pb-4 border-b border-black/5 flex justify-between items-start bg-[#f3f1eb]">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-red-700 animate-pulse" />
                <span className="text-[10px] font-bold text-red-800 tracking-widest uppercase">
                  Top Secret / Classification 4
                </span>
              </div>
              <h2 className="text-2xl font-serif font-black text-gray-900 leading-tight">
                {doc.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-black/5 rounded-md transition-colors text-gray-400 hover:text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {doc.type === "image" && (
              <div className="relative p-2 bg-white shadow-sm border border-gray-200 -rotate-1">
                <img
                  src={doc.content}
                  alt="Crime Scene"
                  className="w-full h-auto grayscale-50 contrast-110"
                />
                <div className="absolute bottom-4 right-4 bg-red-900/10 border border-red-900/20 px-2 py-1 rotate-12">
                  <span className="text-[10px] font-bold text-red-900/60 uppercase">
                    Exhibit.A
                  </span>
                </div>
              </div>
            )}

            <div className="relative py-2">
              <div className="absolute -left-6 top-0 bottom-0 w-0.5 bg-red-200" />
              <p className="text-gray-800 text-sm md:text-base font-serif leading-relaxed italic indent-4">
                {doc.type === "text"
                  ? doc.content
                  : "تحلیل بصری مدرک: جزئیات تصویر باید با دقت بررسی شود. هرگونه ناهماهنگی در زاویه نور یا اشیاء موجود در صحنه می‌تواند کلید حل معما باشد."}
              </p>
            </div>

            <div className="pt-10 flex justify-between items-end opacity-40">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold tracking-tighter">
                  Verified by:
                </span>
                <span className="font-serif text-sm italic">
                  Detective Alavi
                </span>
              </div>
              <div className="w-16 h-16 border-4 border-red-900/30 rounded-full flex items-center justify-center rotate-[-20deg]">
                <span className="text-[8px] font-black text-red-900/40 text-center leading-none">
                  SAMUR
                  <br />
                  ESTATE
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-3 bg-[#e2e0d8] flex justify-between items-center text-[9px] font-mono text-gray-500 tracking-widest uppercase">
            <span>Case File: 1947-B</span>
            <span>Do not remove from archive</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
