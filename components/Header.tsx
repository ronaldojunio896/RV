"use client";

import React from "react";
import { Shield, Users, ShoppingBag, Map, LogOut, Grid } from "lucide-react";

interface HeaderProps {
  activeTab: "investigacao" | "revenda" | "mapa" | "modulo4";
  setActiveTab: (tab: "investigacao" | "revenda" | "mapa" | "modulo4") => void;
  handleLogout: () => void;
}

export default function Header({ activeTab, setActiveTab, handleLogout }: HeaderProps) {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl text-emerald-400">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="font-bold text-base md:text-lg text-slate-100 leading-none">PainelPro</h1>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">INVESTIGAÇÃO & GESTÃO</span>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab("investigacao")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "investigacao" ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30" : "text-slate-400 hover:text-white"
            }`}
          >
            <Users size={14} /> <span className="hidden sm:inline">Investigação</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("revenda")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "revenda" ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30" : "text-slate-400 hover:text-white"
            }`}
          >
            <ShoppingBag size={14} /> <span className="hidden sm:inline">Revenda</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mapa")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "mapa" ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30" : "text-slate-400 hover:text-white"
            }`}
          >
            <Map size={14} /> <span className="hidden sm:inline">Mapa GPS</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("modulo4")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "modulo4" ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30" : "text-slate-400 hover:text-white"
            }`}
          >
            <Grid size={14} /> <span className="hidden sm:inline">Módulo 4</span>
          </button>
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-red-400 hover:text-red-300 bg-red-950/30 border border-red-900/40 px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer ml-auto sm:ml-0"
        >
          <LogOut size={14} /> <span className="hidden md:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}