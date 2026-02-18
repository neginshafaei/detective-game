"use client";
import React, { useRef, useState, useEffect } from "react";
import { useStorage, useMutation } from "@liveblocks/react/suspense";
import { LiveObject } from "@liveblocks/client";
import EvidenceCard from "./EvidenceCard";
import { supabase } from "@/lib/supabase";
import EvidenceModal from "./EvidenceModal";
import Briefing from "./Briefing";
import DetectiveSidebar from "./DetectiveSidebar";

function Board({ roomId }) {
  const boardRef = useRef(null);
  const evidenceList = useStorage((root) => root.evidence);

  const [activeTab, setActiveTab] = useState("text");
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [dbError, setDbError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showBriefing, setShowBriefing] = useState(true);

  const replaceEvidence = useMutation(({ storage }, dbCards) => {
    const list = storage.get("evidence");
    if (!list) return;
    if (list.size === dbCards.length && dbCards.length > 0) {
      const firstDbId = dbCards[0]?.id;
      const firstListId = list.get(0)?.get("id");
      if (firstDbId === firstListId) return;
    }
    list.clear();
    dbCards.forEach((card) => {
      list.push(
        new LiveObject({
          id: card.id,
          title: card.title,
          type: card.type,
          content: card.content,
          x: card.x ?? 100,
          y: card.y ?? 100,
          rotation: card.rotation ?? 0,
        }),
      );
    });
  }, []);

  const updateCardPosition = useMutation(({ storage }, id, newX, newY) => {
    const list = storage.get("evidence");
    const cardIndex = list.findIndex((item) => item.get("id") === id);
    if (cardIndex !== -1) {
      const card = list.get(cardIndex);
      card.set("x", newX);
      card.set("y", newY);
    }
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const fetchCards = async () => {
      setIsLoadingDb(true);
      try {
        const { data, error } = await supabase
          .from("evidence_cards")
          .select("*")
          .eq("case_id", roomId)
          .order("updated_at", { ascending: false });
        if (!error && data) replaceEvidence(data);
      } catch (err) {
        setDbError(err.message);
      } finally {
        setIsLoadingDb(false);
      }
    };
    fetchCards();
  }, [roomId, replaceEvidence]);

  const allCards = evidenceList ? Array.from(evidenceList) : [];
  const filteredCards = allCards.filter(
    (doc) => (doc.get ? doc.get("type") : doc.type) === activeTab,
  );

  if (showBriefing) return <Briefing onStart={() => setShowBriefing(false)} />;
  if (isLoadingDb)
    return (
      <div className="h-screen bg-[#121212] text-amber-100 flex items-center justify-center">
        در حال چیدن میز کارآگاه...
      </div>
    );

  return (
    <div className="flex flex-1 overflow-hidden h-full relative">
      <div className="relative flex-1 bg-[#1e1e1e] rounded-lg border-2 border-[#2a2a2a] overflow-hidden shadow-2xl ml-4 md:ml-10 mr-2 md:mr-6 mb-10 mt-2">
        <div ref={boardRef} className="absolute inset-0 w-full h-full">
          {filteredCards.map((doc) => {
            const data = doc.toJSON ? doc.toJSON() : doc;
            return (
              <EvidenceCard
                key={data.id}
                doc={data}
                containerRef={boardRef}
                onMove={(id, x, y) => updateCardPosition(id, x, y)}
                onSelect={() => setSelectedCard(data)}
              />
            );
          })}
        </div>

        <div className="absolute top-4 left-4 pointer-events-none opacity-10 select-none">
          <span className="text-2xl md:text-5xl font-serif text-white uppercase tracking-tighter block">
            {activeTab === "text" ? "Field Reports" : "Visual Archive"}
          </span>
        </div>
      </div>

      <DetectiveSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        textCount={
          allCards.filter((c) => (c.get ? c.get("type") : c.type) === "text")
            .length
        }
        imageCount={
          allCards.filter((c) => (c.get ? c.get("type") : c.type) === "image")
            .length
        }
      />

      <EvidenceModal doc={selectedCard} onClose={() => setSelectedCard(null)} />
    </div>
  );
}

export default Board;
