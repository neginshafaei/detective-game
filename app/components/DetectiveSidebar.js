"use client";
import React from "react";

export default function DetectiveSidebar({
  activeTab,
  setActiveTab,
  textCount,
  imageCount,
}) {
  const tabs = [
    { id: "text", label: "گزارشات متنی", icon: "📄", count: textCount },
    { id: "image", label: "آرشیو تصاویر", icon: "🖼️", count: imageCount },
  ];

  return (
    <div className="w-16 md:w-48 bg-[#121212] flex flex-col gap-2 p-2 pt-2 border-r border-white/5 shadow-2xl z-10">
      <div className="mb-4 px-2 hidden md:block">
        <span className="text-[10px] text-amber-900 font-mono font-black uppercase tracking-widest leading-none">
          Archive System v1.0
        </span>
      </div>

      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative flex flex-col md:flex-row items-center gap-3 p-3 rounded-lg transition-all duration-300 group ${
            activeTab === tab.id
              ? "bg-amber-900/20 border border-amber-600/30 text-amber-100 shadow-[0_0_15px_rgba(217,119,6,0.1)]"
              : "text-gray-500 hover:bg-white/5 border border-transparent"
          }`}
        >
          <span className="text-xl md:text-base">{tab.icon}</span>
          <div className="hidden md:flex flex-col items-start text-right">
            <span className="text-[11px] font-bold whitespace-nowrap">
              {tab.label}
            </span>
            <span
              className={`text-[9px] font-mono ${activeTab === tab.id ? "text-amber-500" : "text-gray-600"}`}
            >
              Files: {tab.count}
            </span>
          </div>

          {activeTab === tab.id && (
            <div className="absolute left-0 top-2 bottom-2 w-1 bg-amber-600 rounded-r-full" />
          )}
        </button>
      ))}

      <div className="mt-auto p-2 hidden md:block border-t border-white/5 pt-4">
        <div className="flex flex-col gap-2 opacity-30">
          <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-green-900 animate-pulse" />
          </div>
          <span className="text-[8px] font-mono text-gray-500">
            SYSTEM STABLE
          </span>
        </div>
      </div>
    </div>
  );
}
