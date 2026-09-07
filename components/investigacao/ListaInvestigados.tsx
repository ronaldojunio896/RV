"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, MapPin, Trash2, Users } from "lucide-react";

interface PessoalData {
  id?: number;
  nome: string;
  foto: string;
  cep: string;
  endereco: string;
  lat?: number;
  lng?: number;
  familiar: string;
  contato: string;
  observacoes: string;
}

interface ListaInvestigadosProps {
  investigados: PessoalData[];
  onDelete: (id: number) => void;
  onNew: () => void;
}

export default function ListaInvestigados({ investigados, onDelete, onNew }: ListaInvestigadosProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return investigados.filter(
      i => i.nome.toLowerCase().includes(search.toLowerCase()) || i.endereco.toLowerCase().includes(search.toLowerCase())
    );
  }, [investigados, search]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Buscar por nome ou endereço..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 outline-none"
          />
        </div>
        <button
          type="button"
          onClick={onNew}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-2 rounded-lg transition flex items-center gap-1 cursor-pointer"
        >
          <Plus size={14} /> Novo Cadastro
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 text-center text-slate-500">
          <Users className="mx-auto mb-2 opacity-30" size={32} />
          <p className="text-sm">Nenhum investigado encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(inv => (
            <div key={inv.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 flex gap-4 items-start relative group">
              <div className="w-16 h-16 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0">
                {inv.foto ? (
                  <img src={inv.foto} alt={inv.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-[10px]">SEM FOTO</div>
                )}
              </div>
              <div className="flex-1 space-y-1 pr-6">
                <h4 className="font-bold text-slate-100 text-sm">{inv.nome}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin size={12} className="text-emerald-400" /> {inv.endereco || "Endereço não informado"}
                </p>
                <p className="text-xs text-slate-500">Contato: {inv.contato} {inv.familiar ? `| Familiar: ${inv.familiar}` : ""}</p>
                {inv.observacoes && <p className="text-xs text-slate-400 italic bg-slate-950/60 p-1.5 rounded border border-slate-800/60">{inv.observacoes}</p>}
              </div>
              <button
                type="button"
                onClick={() => onDelete(inv.id!)}
                className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}