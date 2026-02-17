"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

const EvidenceCard = ({ doc, onMove, containerRef }) => {
  const cardRef = useRef(null);
  const [constraints, setConstraints] = useState({
    top: 40,
    left: 40,
    right: 40,
    bottom: 40,
  });

  useEffect(() => {
    if (containerRef.current && cardRef.current) {
      const board = containerRef.current.getBoundingClientRect();
      const card = cardRef.current.getBoundingClientRect();
      const MARGIN = 40;

      setConstraints({
        top: MARGIN,
        left: MARGIN,
        right: board.width - card.width - MARGIN,
        bottom: board.height - card.height - MARGIN,
      });
    }
  }, [containerRef]);
console.log("Rendering EvidenceCard for id:", doc.id);
  const handleDragEnd = (event, info) => {
    if (!containerRef.current || !cardRef.current) return;

    const board = containerRef.current.getBoundingClientRect();
    const card = cardRef.current.getBoundingClientRect();

    const newX = card.left - board.left;
    const newY = card.top - board.top;

    onMove(doc.id, newX, newY);

    supabase
      .from("evidence_cards")
      .update({
        x: newX,
        y: newY,
        updated_at: new Date().toISOString(),
      })
      .eq("id", doc.id)
      .then(() => {
        console.log("Position saved to Supabase");
      })
      .catch((err) => {
        console.error("Supabase save error:", err);
      });
  };

  return (
    <motion.div
      ref={cardRef}
      drag
      dragMomentum={false}
      dragConstraints={constraints}
      dragElastic={0}
      animate={{ x: doc.x, y: doc.y, rotate: doc.rotation }}
      transition={{ type: "spring", stiffness: 250, damping: 30 }}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
      }}
      onDragEnd={handleDragEnd}
      whileDrag={{
        scale: 1.05,
        zIndex: 100,
        rotate: 0,
        boxShadow: "0px 20px 50px rgba(0,0,0,0.5)",
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      <div className="relative w-52 bg-[#f4f1ea] p-4 shadow-lg border border-black/5 flex flex-col gap-2 pointer-events-none">
        <div className="text-[10px] uppercase text-red-900 font-bold opacity-70">
          Case File No. {doc.id}
        </div>
        <h3 className="text-gray-900 font-serif font-bold text-sm border-b border-black/10 pb-1">
          {doc.title}
        </h3>
        {doc.type === "text" ? (
          <p className="text-gray-800 text-[12px] italic leading-relaxed">
            {doc.content}
          </p>
        ) : (
          <div className="w-full h-32 bg-gray-300 rounded-sm overflow-hidden grayscale contrast-125">
            <img
              src={doc.content}
              className="w-full h-full object-cover"
              alt="evidence"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EvidenceCard;
