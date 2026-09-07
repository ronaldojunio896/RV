"use client";

import React from "react";
import { LayoutDashboard, FileText, HardDrive, MapPin, FolderPlus, LogOut } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: "investigacao" | "revenda" | "mapa" | "modulo4") => void;
  handleLogout: () => void;
}

export default function Header({ activeTab, setActiveTab, handleLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 max-w-7xl mx-auto gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">
            Painel<span className="text-emerald-500">Pro</span>
          </h1>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 flex-wrap justify-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("investigacao")}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
              activeTab === "investigacao" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText size={14} /> Investigação
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("revenda")}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
              activeTab === "revenda" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <HardDrive size={14} /> Revenda & APKs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mapa")}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
              activeTab === "mapa" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <MapPin size={14} /> Mapa Global GPS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("modulo4")}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
              activeTab === "modulo4" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <FolderPlus size={14} /> Módulo 4
          </button>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 transition cursor-pointer px-3 py-1.5 rounded-lg border border-slate-800 hover:border-rose-900/50 bg-slate-900"
        >
          <LogOut size={14} /> Sair
        </button>
      </div>
    </header>
  );
}