"use client";

import React, { useState } from "react";
import { UploadCloud, X, Check, FileText } from "lucide-react";

interface ModalImportacaoTextoProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (alvos: any[]) => Promise<void>;
}

export default function ModalImportacaoTexto({ isOpen, onClose, onImport }: ModalImportacaoTextoProps) {
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const parseTextData = (text: string) => {
    const blocks = text.split(/\n\s*\n/).filter(b => b.includes("NOME:"));
    const parsedList: any[] = [];

    blocks.forEach(block => {
      const lines = block.split("\n");
      let nome = "", cpf = "", nascimento = "", mae = "", renda = "", profissao = "", telefones = "", endereco = "", cep = "", situacao = "";

      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith("NOME:")) nome = trimmed.replace("NOME:", "").trim();
        else if (trimmed.startsWith("CPF:")) cpf = trimmed.replace("CPF:", "").trim();
        else if (trimmed.startsWith("NASCIMENTO:")) nascimento = trimmed.replace("NASCIMENTO:", "").trim();
        else if (trimmed.startsWith("MAE:")) mae = trimmed.replace("MAE:", "").trim();
        else if (trimmed.startsWith("RENDA:")) renda = trimmed.replace("RENDA:", "").trim();
        else if (trimmed.startsWith("PROFISSAO:")) profissao = trimmed.replace("PROFISSAO:", "").trim();
        else if (trimmed.startsWith("TELEFONES:")) telefones = trimmed.replace("TELEFONES:", "").trim();
        else if (trimmed.startsWith("ENDERECO:")) endereco = trimmed.replace("ENDERECO:", "").trim();
        else if (trimmed.startsWith("CEP:")) cep = trimmed.replace("CEP:", "").trim();
        else if (trimmed.startsWith("SITUACAO:")) situacao = trimmed.replace("SITUACAO:", "").trim();
      });

      if (nome) {
        parsedList.push({
          nome,
          cpf,
          nascimento,
          mae,
          renda,
          profissao,
          telefones,
          endereco: endereco ? `${endereco}, Macapá - AP` : "",
          cep,
          situacao
        });
      }
    });

    return parsedList;
  };

  const handleProcess = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    const parsed = parseTextData(rawText);

    if (parsed.length === 0) {
      alert("Nenhum registro no formato 'NOME:' foi encontrado no texto.");
      setLoading(false);
      return;
    }

    await onImport(parsed);
    setLoading(false);
    setRawText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-md font-bold text-slate-100 flex items-center gap-2">
            <UploadCloud className="text-emerald-400" size={20} /> Importar Consulta Mind-7 / Texto
          </h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Cole abaixo a lista bruta da consulta (com NOME, CPF, TELEFONES, ENDERECO, etc.). O sistema vai identificar todos os alvos e cadastrar de uma só vez!
        </p>

        <textarea
          rows={10}
          value={rawText}
          onChange={e => setRawText(e.target.value)}
          placeholder="Cole os dados aqui... ex:&#10;NOME: MARIA JOSE DOS SANTOS...&#10;CPF: 09781072253...&#10;ENDERECO: LOURENCO ARAUJO DE SA 2702..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-700 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleProcess}
            disabled={loading || !rawText.trim()}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? "Processando e Salvação..." : <><Check size={14} /> Importar Alvos do Texto</>}
          </button>
        </div>
      </div>
    </div>
  );
}