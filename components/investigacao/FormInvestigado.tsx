"use client";

import React, { useState, useEffect } from "react";
import { Save, Upload, Link as LinkIcon } from "lucide-react";

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

interface FormInvestigadoProps {
  onSave: (data: PessoalData) => void;
  mapsLoaded: boolean;
}

export default function FormInvestigado({ onSave, mapsLoaded }: FormInvestigadoProps) {
  const [fotoTipo, setFotoTipo] = useState<"link" | "file">("file");
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [pessoalForm, setPessoalForm] = useState<PessoalData>({
    nome: "", foto: "", cep: "", endereco: "", familiar: "", contato: "", observacoes: "", lat: 0, lng: 0
  });

  useEffect(() => {
    if (mapsLoaded && window.google && window.google.maps) {
      const input = document.getElementById("endereco-input") as HTMLInputElement;
      if (input) {
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ["address"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            setPessoalForm(prev => ({
              ...prev,
              endereco: place.formatted_address || input.value,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }));
          }
        });
      }
    }
  }, [mapsLoaded]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPessoalForm({ ...pessoalForm, foto: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingGeo(true);

    let finalLat = pessoalForm.lat;
    let finalLng = pessoalForm.lng;

    // Se o usuário digitou o endereço e não pegou pelo Autocomplete, faz Geocoding via API
    if ((!finalLat || !finalLng) && pessoalForm.endereco && window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      try {
        const result = await new Promise<any>((resolve) => {
          geocoder.geocode({ address: pessoalForm.endereco }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              resolve(results[0].geometry.location);
            } else {
              resolve(null);
            }
          });
        });

        if (result) {
          finalLat = result.lat();
          finalLng = result.lng();
        }
      } catch (err) {
        console.error("Erro no geocoding:", err);
      }
    }

    onSave({
      ...pessoalForm,
      lat: finalLat,
      lng: finalLng
    });

    setPessoalForm({ nome: "", foto: "", cep: "", endereco: "", familiar: "", contato: "", observacoes: "", lat: 0, lng: 0 });
    setLoadingGeo(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Nome Completo</label>
            <input
              type="text"
              value={pessoalForm.nome}
              onChange={e => setPessoalForm({ ...pessoalForm, nome: e.target.value })}
              placeholder="Nome do alvo"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Contato / Documento</label>
            <input
              type="text"
              value={pessoalForm.contato}
              onChange={e => setPessoalForm({ ...pessoalForm, contato: e.target.value })}
              placeholder="Telefone ou CPF"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">CEP</label>
            <input
              type="text"
              value={pessoalForm.cep}
              onChange={e => setPessoalForm({ ...pessoalForm, cep: e.target.value })}
              placeholder="00000-000"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Endereço Completo</label>
            <input
              id="endereco-input"
              type="text"
              value={pessoalForm.endereco}
              onChange={e => setPessoalForm({ ...pessoalForm, endereco: e.target.value })}
              placeholder="Digite rua, número, bairro e cidade..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm mt-1"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Familiar Relacionado</label>
          <input
            type="text"
            value={pessoalForm.familiar}
            onChange={e => setPessoalForm({ ...pessoalForm, familiar: e.target.value })}
            placeholder="Nome do familiar"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Observações e Informações</label>
          <textarea
            rows={3}
            value={pessoalForm.observacoes}
            onChange={e => setPessoalForm({ ...pessoalForm, observacoes: e.target.value })}
            placeholder="Notas adicionais sobre o alvo..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm mt-1 resize-none"
          />
        </div>
        
        <button
          type="submit"
          disabled={loadingGeo}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition shadow-lg shadow-emerald-900/20 flex items-center justify-center cursor-pointer text-sm disabled:opacity-50"
        >
          <Save size={16} className="mr-2" /> {loadingGeo ? "Localizando no GPS..." : "Salvar Cadastro no Sistema"}
        </button>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between items-center text-center space-y-4">
        <div className="w-32 h-32 rounded-xl bg-slate-950 border-2 border-slate-800 flex items-center justify-center overflow-hidden">
          {pessoalForm.foto ? (
            <img src={pessoalForm.foto} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-slate-600 font-semibold uppercase">Sem Imagem</span>
          )}
        </div>

        <div className="w-full space-y-3">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setFotoTipo("file")}
              className={`flex-1 py-1 text-xs font-medium rounded transition ${fotoTipo === "file" ? "bg-slate-800 text-emerald-400" : "text-slate-500"}`}
            >
              <Upload size={12} className="inline mr-1" /> Arquivo
            </button>
            <button
              type="button"
              onClick={() => setFotoTipo("link")}
              className={`flex-1 py-1 text-xs font-medium rounded transition ${fotoTipo === "link" ? "bg-slate-800 text-emerald-400" : "text-slate-500"}`}
            >
              <LinkIcon size={12} className="inline mr-1" /> Link URL
            </button>
          </div>

          {fotoTipo === "file" ? (
            <label className="block w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-400 cursor-pointer transition">
              <span>Escolher foto do PC...</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          ) : (
            <input
              type="text"
              placeholder="Cole a URL da foto..."
              value={pessoalForm.foto}
              onChange={e => setPessoalForm({ ...pessoalForm, foto: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm"
            />
          )}
        </div>
      </div>
    </form>
  );
}