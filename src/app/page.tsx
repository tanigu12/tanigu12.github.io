"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Client from "@/components/HomePage/client";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Client />
      </main>
      <Footer />
    </div>
  );
}
