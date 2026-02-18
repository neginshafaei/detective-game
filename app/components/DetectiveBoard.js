"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  RoomProvider,
  ClientSideSuspense,
  useStorage,
  useMutation,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import { LiveList, LiveObject } from "@liveblocks/client";
import EvidenceCard from "./EvidenceCard";
import { supabase } from "@/lib/supabase";

function Board({ roomId }) {
  const boardRef = useRef(null);
  const evidenceList = useStorage((root) => root.evidence);

  const [cards, setCards] = useState([]);
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [dbError, setDbError] = useState(null);

  const replaceEvidence = useMutation(({ storage }, dbCards) => {
    const list = storage.get("evidence");
    if (!list) return;

    if (list.size === dbCards.length && dbCards.length > 0) {
      const firstDbId = dbCards[0]?.id;
      const firstListId = list.get(0)?.get("id");
      if (firstDbId === firstListId) {
        console.log(
          "Liveblocks storage already synced with DB, skipping replace",
        );
        return;
      }
    }

    console.log("Syncing DB to Liveblocks - count:", dbCards.length);
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

    let isMounted = true;

    const fetchCards = async () => {
      setIsLoadingDb(true);
      setDbError(null);

      try {
        const { data, error } = await supabase
          .from("evidence_cards")
          .select("*")
          .eq("case_id", roomId)
          .order("updated_at", { ascending: false });

        if (error) throw error;

        console.log("Fetched cards from Supabase:", data?.length || 0);

        if (isMounted && data?.length > 0) {
          replaceEvidence(data);
        }
      } catch (err) {
        if (isMounted) {
          setDbError(err.message || "خطا در بارگذاری");
          console.error(err);
        }
      } finally {
        if (isMounted) setIsLoadingDb(false);
      }
    };

    fetchCards();

    return () => {
      isMounted = false;
    };
  }, [roomId]);

  if (isLoadingDb) {
    return (
      <div className="h-screen bg-[#121212] text-amber-100 p-10 flex items-center justify-center">
        در حال بارگذاری مدارک از Supabase...
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="h-screen bg-[#121212] text-red-400 p-10 flex items-center justify-center">
        خطا: {dbError}
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-[#121212] overflow-hidden p-10 flex flex-col">
      <div className="z-10 flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-serif text-amber-100 uppercase">
            پرونده عمارت سامور
          </h1>
          <p className="text-green-500 text-[10px] animate-pulse">
            ● سیستم ریل‌تایم فعال است
          </p>
        </div>
      </div>

      <div
        ref={boardRef}
        className="relative flex-1 bg-[#1e1e1e] rounded-lg border-2 border-[#2a2a2a] overflow-hidden shadow-2xl"
      >
        {evidenceList.map((doc) => (
          <EvidenceCard
            key={doc.id}
            doc={doc.toJSON ? doc.toJSON() : doc}
            containerRef={boardRef}
            onMove={(id, x, y) => updateCardPosition(id, x, y)}
          />
        ))}
      </div>
    </div>
  );
}

export default function DetectiveBoardWrapper({
  roomId = "my-detective-room-1",
}) {
  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY}
    >
      <RoomProvider
        id={roomId}
        initialStorage={{
          evidence: new LiveList([]),
        }}
      >
        <ClientSideSuspense
          fallback={
            <div className="h-screen bg-[#121212] text-amber-100 p-10 flex items-center justify-center">
              در حال اتصال به realtime و لود مدارک...
            </div>
          }
        >
          {() => <Board roomId={roomId} />}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
