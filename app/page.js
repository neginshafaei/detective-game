"use client";

import {
  RoomProvider,
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import DetectiveHeader from "./components/DetectiveHeader";
import { LiveList } from "@liveblocks/client";
import Board from "./components/DetectiveBoard";

const NAMES = ["کارآگاه علوی", "پوآرو", "شرلوک", "مارپل", "کلمبو"];
const COLORS = ["#D97706", "#2563EB", "#059669", "#7C3AED", "#DB2777"];

export default function Home({ roomId = "my-detective-room-1" }) {
  const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
  const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY}
    >
      <RoomProvider
        id={roomId}
        initialPresence={{ name: randomName, color: randomColor }}
        initialStorage={{ evidence: new LiveList([]), notes: new LiveList([]) }}
      >
        <ClientSideSuspense
          fallback={
            <div
              dir="ltr"
              className="h-screen bg-[#121212] text-amber-100 p-10 flex items-center justify-center"
            >
              Loading Evidences..
            </div>
          }
        >
          {() => (
            <div className="flex flex-col gap-4 h-screen bg-[#121212]">
              <DetectiveHeader />
              <Board roomId={roomId} />
            </div>
          )}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
