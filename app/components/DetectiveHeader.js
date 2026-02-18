"use client";
import React, { useState } from "react";
import {
  useOthers,
  useSelf,
  useMutation,
  useStorage,
} from "@liveblocks/react/suspense";
import { LiveObject } from "@liveblocks/client";

export default function DetectiveHeader() {
  const others = useOthers();
  const self = useSelf();
  const notes = useStorage((root) => root.notes);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [newNote, setNewNote] = useState("");

  const addNote = useMutation(
    ({ storage }, text) => {
      storage.get("notes").push(
        new LiveObject({
          id: Date.now(),
          content: text,
          author: self.presence.name,
          authorColor: self.presence.color,
          time: new Date().toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }),
      );
    },
    [self],
  );

  const deleteNote = useMutation(({ storage }, id) => {
    const list = storage.get("notes");
    const index = list.findIndex((n) => n.get("id") === id);
    if (index !== -1) list.delete(index);
  }, []);

  return (
    <div
      className="z-20 flex md:flex-row flex-col gap-5 justify-between items-center bg-[#121212] p-6 mx-2 mt-4 rounded-xl border border-white/5"
      dir="rtl"
    >
      <div className="text-right">
        <h1 className="text-xl font-serif text-amber-100 uppercase tracking-widest">
          پرونده عمارت سامور
        </h1>
        <p className="text-green-500 text-[10px] mt-1 text-center">
          ● سیستم ریل‌تایم فعال
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowHistory(true)}
          className="px-4 py-2 bg-[#2a2a2a] text-amber-100 rounded text-xs border border-white/10 hover:bg-[#333]"
        >
          یادداشت‌ها ({notes?.length || 0})
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-amber-600 text-white rounded text-xs font-bold hover:bg-amber-500"
        >
          + یادداشت جدید
        </button>

        <div className="flex -space-x-2 mr-4 border-r border-white/10 pr-4">
          <Avatar user={self?.presence} isSelf />
          {others.map(({ connectionId, presence }) => (
            <Avatar key={connectionId} user={presence} />
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e1e1e] p-6 w-full max-w-2xl mx-2 rounded-lg border border-amber-500/20">
            <h2 className="text-amber-100 mb-4 font-serif">ثبت یادداشت جدید</h2>
            <textarea
              className="w-full h-32 bg-[#121212] text-white p-3 rounded border border-white/10 outline-none focus:border-amber-500 text-sm"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="متن یادداشت..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 text-xs"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  if (newNote) {
                    addNote(newNote);
                    setNewNote("");
                    setShowAddModal(false);
                  }
                }}
                className="bg-amber-600 px-4 py-2 rounded text-white text-xs"
              >
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e1e1e] p-6 rounded-lg w-full max-w-2xl mx-2 max-h-[80vh] flex flex-col border border-white/10">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <h2 className="text-amber-100 font-serif">تاریخچه یادداشت‌ها</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pl-2">
              {notes.length === 0 && (
                <p className="text-gray-600 text-center py-10 text-xs">
                  هنوز یادداشتی ثبت نشده است.
                </p>
              )}
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="bg-[#121212] p-3 rounded border-r-4 border-amber-600/50 group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: n.authorColor }}
                    >
                      {n.author}
                    </span>
                    <button
                      onClick={() => deleteNote(n.id)}
                      className="text-red-900 opacity-0 group-hover:opacity-100 text-[10px]"
                    >
                      حذف
                    </button>
                  </div>
                  <p className="text-white/80 text-xs leading-relaxed">
                    {n.content}
                  </p>
                  <div className="text-[8px] text-gray-600 mt-2 text-left">
                    {n.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Avatar({ user, isSelf }) {
  return (
    <div
      className={`h-8 w-8 rounded-full border-2 border-[#121212] flex items-center justify-center text-[10px] font-bold text-black ring-1 ${isSelf ? "ring-amber-500" : "ring-white/10"}`}
      style={{ backgroundColor: user?.color || "#555" }}
    >
      {user?.name?.charAt(0)}
    </div>
  );
}
