"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

const EvidenceCard = ({ doc, onMove, onSelect, containerRef }) => {
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  const caseNumber = useMemo(() => {
    const idStr = String(doc.id);
    return `№ DG-${idStr.slice(-4)}`;
  }, [doc.id]);

  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current && cardRef.current) {
        const board = containerRef.current.getBoundingClientRect();
        const card = cardRef.current.getBoundingClientRect();
        const MARGIN = 20;
        setBoardSize({ width: board.width, height: board.height });
        setConstraints({
          top: MARGIN,
          left: MARGIN,
          right: board.width - card.width - MARGIN,
          bottom: board.height - card.height - MARGIN,
        });
      }
    };
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, [containerRef]);

  const safePos = useMemo(() => {
    if (boardSize.width === 0) return { x: doc.x, y: doc.y };
    const cardWidth = 208;
    const cardHeight = 260;
    return {
      x: Math.min(Math.max(20, doc.x), boardSize.width - cardWidth - 20),
      y: Math.min(Math.max(20, doc.y), boardSize.height - cardHeight - 20),
    };
  }, [doc.x, doc.y, boardSize]);

  const handleDragEnd = (event, info) => {
    if (!containerRef.current || !cardRef.current) return;
    const board = containerRef.current.getBoundingClientRect();
    const card = cardRef.current.getBoundingClientRect();
    const newX = card.left - board.left;
    const newY = card.top - board.top;

    setIsDragging(false);
    onMove(doc.id, newX, newY);

    supabase
      .from("evidence_cards")
      .update({ x: newX, y: newY, updated_at: new Date().toISOString() })
      .eq("id", doc.id)
      .then(() => console.log("Position saved"))
      .catch((err) => console.error("Supabase error:", err));
  };

  return (
    <motion.div
      ref={cardRef}
      drag
      dragMomentum={false}
      dragConstraints={constraints}
      dragElastic={0}
      animate={{ x: safePos.x, y: safePos.y, rotate: doc.rotation }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ position: "absolute", left: 0, top: 0, touchAction: "none" }}
      onDragStart={() => setIsDragging(true)}
      onTap={() => {
        if (!isDragging) onSelect();
      }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, zIndex: 100, rotate: 0 }}
      className="cursor-grab active:cursor-grabbing touch-none z-10 p-2"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#d9d2b8]/60 backdrop-blur-sm -rotate-2 z-20 border-x border-black/5 shadow-sm" />

      <div className="relative w-52 bg-[#efede4] p-4 shadow-[5px_5px_15px_rgba(0,0,0,0.3)] border border-[#d4cfc1] flex flex-col gap-3 pointer-events-none select-none overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />

        <div className="flex justify-between items-start border-b border-black/10 pb-1 z-10">
          <span className="text-[9px] font-mono font-bold text-red-900/70 uppercase">
            {caseNumber}
          </span>
          <div className="w-2 h-2 rounded-full bg-red-800/20" />
        </div>

        <h3 className="text-gray-900 font-serif font-black text-sm leading-tight uppercase tracking-tight z-10">
          {doc.title}
        </h3>

        {doc.type === "text" ? (
          <div className="relative z-10">
            <p className="text-[#3a3a3a] text-[11px] font-serif italic leading-relaxed bg-black/5 p-2 rounded-sm border-l-2 border-black/10">
              "{doc.content}"
            </p>
          </div>
        ) : (
          <div className="relative bg-white p-2 pb-6 shadow-md -rotate-1 border border-black/5">
            <div className="w-full h-28 bg-gray-200 overflow-hidden grayscale contrast-125">
              <img
                src={doc.content}
                className="w-full h-full object-cover"
                alt="evidence photo"
                draggable="false"
              />
            </div>
            <div className="absolute bottom-1 left-0 right-0 text-center">
              <span className="text-[8px] font-mono text-gray-400 uppercase tracking-tighter">
                Evidence Photo / Archive
              </span>
            </div>
          </div>
        )}

        <div className="absolute -bottom-2 -right-4 w-16 h-16 border-2 border-red-900/5 rounded-full flex items-center justify-center rotate-12 pointer-events-none">
          <span className="text-[7px] font-black text-red-900/10 text-center uppercase">
            Confidential
            <br />
            Samur Estate
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default EvidenceCard;
