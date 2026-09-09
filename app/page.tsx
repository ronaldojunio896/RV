"use client";

import React, { useState, useEffect } from "react";
import { Plus, List, FolderPlus, CheckCircle, UploadCloud, Edit2, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import LoginModal from "@/components/LoginModal";
import FormInvestigado from "@/components/investigacao/FormInvestigado";
import ListaInvestigados from "@/components/investigacao/ListaInvestigados";
import MapaGlobal from "@/components/mapa/MapaGlobal";
import { supabase } from "@/lib/supabase";
import { RAW_ALVOS } from "@/lib/alvos";

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

interface StreamingItem {
  id: number;
  nome: string;
  foto: string;
  vencimento: string;
  usuario: string;
  senha: string;
  apkUrl: string;
  vendido: boolean;
}

interface Cliente {
  id: number;
  nome: string;
  contato: string;
  plano: string;
  validade: string;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

declare global {
  interface Window {
    google: any;
  }
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"investigacao" | "revenda" | "mapa" | "modulo4">("investigacao");
  const [investigacaoSubTab, setInvestigacaoSubTab] = useState<"cadastro" | "lista">("cadastro");
  const [revendaSubTab, setRevendaSubTab] = useState<"streamings" | "clientes">("streamings");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [importing, setImporting] = useState(false);

  const [investigados, setInvestigados] = useState<PessoalData[]>([]);
  const [editingInvestigado, setEditingInvestigado] = useState<PessoalData | null>(null);

  const [streamings, setStreamings] = useState<StreamingItem[]>([]);
  const [editingStreamingId, setEditingStreamingId] = useState<number | null>(null);
  const [stForm, setStForm] = useState<StreamingItem>({
    id: 0, nome: "", foto: "", vencimento: "", usuario: "", senha: "", apkUrl: "", vendido: false
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cliForm, setCliForm] = useState<Cliente>({ id: 0, nome: "", contato: "", plano: "", validade: "" });
  const [mapsLoaded, setMapsLoaded] = useState(false);

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const loadData = async () => {
    const { data: invData } = await supabase.from("investigados").select("*").order("id", { ascending: false });
    if (invData) setInvestigados(invData);

    const { data: stData } = await supabase.from("streamings").select("*").order("id", { ascending: false });
    if (stData) {
      setStreamings(stData.map(item => ({
        id: item.id,
        nome: item.nome,
        foto: item.foto,
        vencimento: item.vencimento,
        usuario: item.usuario,
        senha: item.senha,
        apkUrl: item.apk_url,
        vendido: item.vendido
      })));
    }

    const { data: cliData } = await supabase.from("clientes").select("*").order("id", { ascending: false });
    if (cliData) setClientes(cliData);
  };

  useEffect(() => {
    const authStatus = localStorage.getItem("painel_auth");
    if (authStatus === "true") setIsAuthenticated(true);
    loadData();
  }, []);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }

    const scriptId = "google-maps-script";
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapsLoaded(true);
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener("load", () => setMapsLoaded(true));
    }
  }, []);

  const handleBatchImport = async () => {
    if (!confirm(`Deseja importar a lista com os ${RAW_ALVOS.length} investigados do CEP 31980-410 para o banco de dados?`)) return;

    setImporting(true);
    addToast(`Iniciando importação de ${RAW_ALVOS.length} alvos...`, "info");

    let count = 0;
    const geocoder = window.google && window.google.maps ? new window.google.maps.Geocoder() : null;

    for (const item of RAW_ALVOS) {
      let latVal = null;
      let lngVal = null;

      if (geocoder) {
        try {
          const res = await new Promise<any>((resolve) => {
            geocoder.geocode({ address: item.endereco }, (results: any, status: any) => {
              if (status === "OK" && results && results[0]) {
                resolve(results[0].geometry.location);
              } else {
                resolve(null);
              }
            });
          });

          if (res) {
            latVal = res.lat();
            lngVal = res.lng();
          }
        } catch (e) {
          console.error("Geocoding err:", e);
        }
      }

      const obs = `CPF: ${item.cpf} | Nasc: ${item.nascimento} | Renda: ${item.renda}${item.profissao ? " | Profissão: " + item.profissao : ""}${item.situacao ? " | Status: " + item.situacao : ""}`;

      const payload = {
        nome: item.nome,
        foto: "",
        cep: item.cep,
        endereco: item.endereco,
        familiar: item.mae ? `Mãe: ${item.mae}` : "",
        contato: item.telefones || item.cpf,
        observacoes: obs,
        lat: latVal,
        lng: lngVal
      };

      await supabase.from("investigados").insert([payload]);
      count++;
    }

    setImporting(false);
    addToast(`${count} investigados importados com sucesso!`, "success");
    loadData();
    setInvestigacaoSubTab("lista");
  };

  const handleSaveInvestigado = async (data: PessoalData) => {
    if (!data.nome) return addToast("Nome do investigado é obrigatório", "error");

    const payload = {
      nome: data.nome,
      foto: data.foto,
      cep: data.cep,
      endereco: data.endereco,
      familiar: data.familiar,
      contato: data.contato,
      observacoes: data.observacoes,
      lat: data.lat ? Number(data.lat) : null,
      lng: data.lng ? Number(data.lng) : null,
    };

    if (data.id) {
      const { error } = await supabase.from("investigados").update(payload).eq("id", data.id);
      if (error) {
        addToast("Erro ao atualizar no banco de dados", "error");
      } else {
        addToast("Cadastro do alvo atualizado!", "success");
        setEditingInvestigado(null);
        setInvestigacaoSubTab("lista");
        loadData();
      }
    } else {
      const { data: inserted, error } = await supabase.from("investigados").insert([payload]).select();
      if (error) {
        addToast("Erro ao salvar no banco de dados", "error");
      } else if (inserted && inserted.length > 0) {
        addToast("Investigado salvo com localização GPS!", "success");
        setInvestigacaoSubTab("lista");
        loadData();
      }
    }
  };

  const handleDeleteInvestigado = async (id: number) => {
    if (confirm("Deseja remover este investigado do cadastro?")) {
      const { error } = await supabase.from("investigados").delete().eq("id", id);
      if (!error) {
        setInvestigados(prev => prev.filter(i => i.id !== id));
        addToast("Investigado removido", "info");
      }
    }
  };

  const handleEditInvestigado = (inv: PessoalData) => {
    setEditingInvestigado(inv);
    setInvestigacaoSubTab("cadastro");
  };

  const handleEditStreaming = (st: StreamingItem) => {
    setEditingStreamingId(st.id);
    setStForm(st);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("painel_auth");
    addToast("Sessão encerrada com sucesso.", "info");
  };

  if (!isAuthenticated) {
    return <LoginModal onLoginSuccess={() => setIsAuthenticated(true)} addToast={addToast} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-10">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-4 md:py-6 space-y-6">
        {activeTab === "investigacao" && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-3 gap-3">
              <div className="flex gap-2 md:gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingInvestigado(null);
                    setInvestigacaoSubTab("cadastro");
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    investigacaoSubTab === "cadastro" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Plus size={14} /> Cadastrar Novo Alvo
                </button>
                <button
                  type="button"
                  onClick={() => setInvestigacaoSubTab("lista")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    investigacaoSubTab === "lista" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <List size={14} /> Alvos Cadastrados ({investigados.length})
                </button>
              </div>

              <button
                type="button"
                onClick={handleBatchImport}
                disabled={importing}
                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition disabled:opacity-50"
              >
                <UploadCloud size={14} />
                <span>{importing ? "Importando Alvos..." : `Importar Lista de Alvos (${RAW_ALVOS.length})`}</span>
              </button>
            </div>

            {investigacaoSubTab === "cadastro" ? (
              <FormInvestigado
                onSave={handleSaveInvestigado}
                mapsLoaded={mapsLoaded}
                initialData={editingInvestigado}
                onCancelEdit={() => setEditingInvestigado(null)}
              />
            ) : (
              <ListaInvestigados
                investigados={investigados}
                onDelete={handleDeleteInvestigado}
                onEdit={handleEditInvestigado}
                onNew={() => {
                  setEditingInvestigado(null);
                  setInvestigacaoSubTab("cadastro");
                }}
              />
            )}
          </div>
        )}

        {activeTab === "revenda" && (
          <div className="space-y-6">
            <div className="flex gap-4 border-b border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setRevendaSubTab("streamings")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                  revendaSubTab === "streamings" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400"
                }`}
              >
                Streamings & APKs
              </button>
              <button
                type="button"
                onClick={() => setRevendaSubTab("clientes")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                  revendaSubTab === "clientes" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400"
                }`}
              >
                Base de Clientes
              </button>
            </div>

            {revendaSubTab === "streamings" ? (
              <div className="space-y-6">
                <div className="bg-slate-900/50 backdrop-blur-sm border border-emerald-500/20 bg-emerald-950/10 rounded-xl p-4 md:p-6">
                  <h3 className="text-sm font-semibold text-emerald-400 mb-4 uppercase tracking-wider">
                    {editingStreamingId ? "Editar Produto / APK" : "Novo Produto / APK"}
                  </h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!stForm.nome) return addToast("Nome do serviço é obrigatório", "error");

                    const dbData = {
                      nome: stForm.nome,
                      foto: stForm.foto,
                      vencimento: stForm.vencimento,
                      usuario: stForm.usuario,
                      senha: stForm.senha,
                      apk_url: stForm.apkUrl,
                      vendido: stForm.vendido
                    };

                    if (editingStreamingId !== null) {
                      await supabase.from("streamings").update(dbData).eq("id", editingStreamingId);
                      addToast("Streaming atualizado!", "success");
                      setEditingStreamingId(null);
                    } else {
                      await supabase.from("streamings").insert([dbData]);
                      addToast("Produto adicionado ao Supabase!", "success");
                    }
                    setStForm({ id: 0, nome: "", foto: "", vencimento: "", usuario: "", senha: "", apkUrl: "", vendido: false });
                    loadData();
                  }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Serviço"
                      value={stForm.nome}
                      onChange={e => setStForm({...stForm, nome: e.target.value})}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Foto URL"
                      value={stForm.foto}
                      onChange={e => setStForm({...stForm, foto: e.target.value})}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="date"
                      value={stForm.vencimento}
                      onChange={e => setStForm({...stForm, vencimento: e.target.value})}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Usuário"
                      value={stForm.usuario}
                      onChange={e => setStForm({...stForm, usuario: e.target.value})}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Senha"
                      value={stForm.senha}
                      onChange={e => setStForm({...stForm, senha: e.target.value})}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Link APK"
                      value={stForm.apkUrl}
                      onChange={e => setStForm({...stForm, apkUrl: e.target.value})}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    <div className="lg:col-span-3 flex justify-end gap-2">
                      {editingStreamingId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStreamingId(null);
                            setStForm({ id: 0, nome: "", foto: "", vencimento: "", usuario: "", senha: "", apkUrl: "", vendido: false });
                          }}
                          className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer"
                        >
                          Cancelar
                        </button>
                      )}
                      <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition">
                        {editingStreamingId ? "Atualizar Produto" : "Salvar Produto"}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {streamings.map(st => (
                    <div key={st.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 space-y-3">
                      <div className="flex gap-3 items-center">
                        {st.foto ? (
                          <img src={st.foto} alt={st.nome} className="w-12 h-12 rounded-lg object-cover border border-slate-800 flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center text-[10px] text-slate-600 font-bold">APK</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-200 truncate">{st.nome}</h4>
                          <p className="text-xs text-slate-400 truncate">Usuário: {st.usuario || "N/A"} | Senha: {st.senha || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-slate-800/60">
                        <button
                          type="button"
                          onClick={() => handleEditStreaming(st)}
                          className="bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <Edit2 size={13} /> Editar
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await supabase.from("streamings").update({ vendido: !st.vendido }).eq("id", st.id);
                            loadData();
                          }}
                          className="bg-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
                        >
                          {st.vendido ? "Liberar" : "Vender"}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await supabase.from("streamings").delete().eq("id", st.id);
                            addToast("Removido", "info");
                            loadData();
                          }}
                          className="text-red-400 hover:text-red-300 text-xs px-2 py-1.5 cursor-pointer ml-auto flex items-center gap-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 md:p-6">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!cliForm.nome) return addToast("Nome do cliente obrigatório", "error");
                  await supabase.from("clientes").insert([{
                    nome: cliForm.nome,
                    contato: cliForm.contato,
                    plano: cliForm.plano,
                    validade: cliForm.validade
                  }]);
                  setCliForm({ id: 0, nome: "", contato: "", plano: "", validade: "" });
                  addToast("Cliente cadastrado no Supabase!", "success");
                  loadData();
                }} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <input
                    type="text"
                    placeholder="Nome do Cliente"
                    value={cliForm.nome}
                    onChange={e => setCliForm({...cliForm, nome: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="WhatsApp / Contato"
                    value={cliForm.contato}
                    onChange={e => setCliForm({...cliForm, contato: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Plano / Serviço"
                    value={cliForm.plano}
                    onChange={e => setCliForm({...cliForm, plano: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition">
                    Adicionar Cliente
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === "mapa" && (
          <MapaGlobal investigados={investigados} mapsLoaded={mapsLoaded} />
        )}

        {activeTab === "modulo4" && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 md:p-12 text-center border-dashed border-2 my-8">
            <FolderPlus className="mx-auto text-emerald-500 mb-4 opacity-40" size={48} />
            <h3 className="text-lg font-bold text-slate-200">Módulo 4 - Reservado</h3>
            <p className="text-xs md:text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Esta aba está ativa e preparada para receber novos recursos futuros.
            </p>
          </div>
        )}
      </main>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-[90vw]">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-xs md:text-sm">
            <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}