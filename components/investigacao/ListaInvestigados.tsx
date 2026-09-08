"use client";

import React from "react";
import { Edit2, Trash2, UserPlus, MapPin, Phone, Users, FileText } from "lucide-react";

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
  onEdit: (item: PessoalData) => void;
  onNew: () => void;
}

export default function ListaInvestigados({ investigados, onDelete, onEdit, onNew }: ListaInvestigadosProps) {
  if (investigados.length === 0) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 text-center space-y-4">
        <p className="text-slate-400 text-sm">Nenhum investigado cadastrado no banco de dados.</p>
        <button
          type="button"
          onClick={onNew}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus size={14} /> Cadastrar Primeiro Alvo
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {investigados.map(inv => (
        <div key={inv.id} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
          <div className="flex gap-3">
            <div className="w-16 h-16 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0">
              {inv.foto ? (
                <img src={inv.foto} alt={inv.nome} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 font-bold uppercase">Sem Foto</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-100 text-base truncate">{inv.nome}</h4>
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5 truncate">
                <Phone size={12} className="flex-shrink-0" /> {inv.contato || "Contato não informado"}
              </p>
              {inv.familiar && (
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                  <Users size={12} className="flex-shrink-0" /> Rel: {inv.familiar}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1 text-xs text-slate-300 border-t border-slate-800/80 pt-2">
            <p className="flex items-start gap-1.5 text-slate-400 line-clamp-2">
              <MapPin size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{inv.endereco || "Endereço não cadastrado"}</span>
            </p>
            {inv.observacoes && (
              <p className="flex items-start gap-1.5 text-slate-400 line-clamp-2 mt-1">
                <FileText size={13} className="text-slate-500 flex-shrink-0 mt-0.5" />
                <span>{inv.observacoes}</span>
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-800/60">
            <button
              type="button"
              onClick={() => onEdit(inv)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs py-2 rounded-lg border border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer font-medium"
            >
              <Edit2 size={13} /> Editar
            </button>
            <button
              type="button"
              onClick={() => inv.id && onDelete(inv.id)}
              className="px-3 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs py-2 rounded-lg border border-red-800/40 transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Trash2 size={13} /> Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}