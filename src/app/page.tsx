"use client";

import Header from "@/components/Header";
import Terminal from "@/components/Terminal";
import StatusBar from "@/components/StatusBar";

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-black text-white font-mono pb-8 md:pb-6">
      <Header />
      <div className="flex-1 p-2 md:p-4 overflow-hidden">
        <Terminal />
      </div>
      <StatusBar />
    </main>
  );
}
