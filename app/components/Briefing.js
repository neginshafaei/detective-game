"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Briefing({ onStart }) {
  return (
    <div className="fixed inset-0 z-300 bg-black text-amber-100 flex flex-col items-center justify-center p-6 md:p-10 font-serif overflow-hidden">
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative max-w-2xl w-full space-y-8 border border-amber-900/20 p-8 md:p-12 bg-[#0a0a0a] shadow-[0_0_100px_rgba(120,50,0,0.1)]"
      >
        <div className="absolute -top-4 -right-4 bg-red-900 text-white text-[10px] px-6 py-1 rotate-12 font-mono font-bold uppercase tracking-[0.3em] shadow-lg">
          Top Secret
        </div>

        <div className="border-b border-amber-900/40 pb-6">
          <h2 className="text-red-800 text-[10px] font-mono tracking-[0.6em] uppercase mb-2">
            Intelligence Briefing / Case #77-B
          </h2>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-amber-50">
            پرونده عمارت سامور
          </h1>
        </div>

        <div
          className="space-y-6 text-base md:text-lg leading-relaxed text-amber-100/70 italic text-right"
          dir="rtl"
        >
          <p className="border-r-2 border-amber-900/30 pr-4">
            "ساعت از ۲ بامداد گذشته است. باران شدیدی پیکر بی‌جان عمارت سامور را
            شلاق می‌زند. سیاوش سامور، مردی که ثروتش را از ثانیه‌های دیگران ساخته
            بود، حالا در میان ساعت‌های خاموش کتابخانه‌اش، به ابدیت پیوسته است."
          </p>
          <p className="pr-4">
            کتابخانه از داخل قفل بود. هیچ نشانه‌ای از درگیری نیست، اما عقربه‌های
            ساعت جیبی او درست در لحظه ایستادن قلبش، روی زمانی غیرممکن متوقف
            شده‌اند.
          </p>
          <p className="text-amber-200/90 not-italic font-bold">
            کارآگاه، مدارک روی میز هستند. حقیقت در میان تیک‌تاک‌های نشنیده پنهان
            شده است.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 pt-6">
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "#d97706",
              color: "#000",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="w-full md:w-auto border border-amber-600/50 text-amber-500 px-12 py-4 transition-all uppercase text-xs font-black tracking-[0.2em] bg-transparent shadow-[0_0_20px_rgba(217,119,6,0.1)]"
          >
            ورود به صحنه جرم
          </motion.button>
          <span className="text-[9px] text-amber-900 uppercase tracking-widest animate-pulse">
            Waiting for authorization...
          </span>
        </div>
      </motion.div>

      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-transparent to-black pointer-events-none" />
    </div>
  );
}
