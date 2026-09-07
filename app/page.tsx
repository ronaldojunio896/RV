"use client";

import React, { useState, useEffect } from "react";
import { Plus, List, FolderPlus, CheckCircle, Edit2, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import LoginModal from "@/components/LoginModal";
import FormInvestigado from "@/components/investigacao/FormInvestigado";
import ListaInvestigados from "@/components/investigacao/ListaInvestigados";
import MapaGlobal from "@/components/mapa/MapaGlobal";

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

  const [investigados, setInvestigados] = useState<PessoalData[]>([]);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  // Revenda & APKs
  const [streamings, setStreamings] = useState<StreamingItem[]>([
    {
      id: 1,
      nome: "Netflix Ultra HD",
      foto: "https://placehold.co/150x150/10b981/ffffff?text=NF",
      vencimento: "2026-10-10",
      usuario: "user_test",
      senha: "password123",
      apkUrl: "https://mediafire.com/file/exemplo_apk",
      vendido: false,
    },
  ]);
  const [editingStreamingId, setEditingStreamingId] = useState<number | null>(null);
  const [stForm, setStForm] = useState<StreamingItem>({
    id: 0, nome: "", foto: "", vencimento: "", usuario: "", senha: "", apkUrl: "", vendido: false
  });

  const [clientes, setClientes] = useState<Cliente[]>([
    { id: 1, nome: "João Silva", contato: "joao@email.com", plano: "Netflix Ultra HD", validade: "2026-10-10" },
  ]);
  const [cliForm, setCliForm] = useState<Cliente>({ id: 0, nome: "", contato: "", plano: "", validade: "" });

  const [mapsLoaded, setMapsLoaded] = useState(false);

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  useEffect(() => {
    const authStatus = localStorage.getItem("painel_auth");
    if (authStatus === "true") setIsAuthenticated(true);

    const saved = localStorage.getItem("investigados_data");
    if (saved) {
      try { setInvestigados(JSON.parse(saved)); } catch (e) { console.error(e); }
    } else {
      setInvestigados([{
        id: 1, nome: "Carlos Eduardo Silva", foto: "", cep: "30140-071",
        endereco: "Av. Getúlio Vargas, Belo Horizonte - MG", lat: -19.9322, lng: -43.9317,
        familiar: "Maria Silva", contato: "(31) 98888-7777", observacoes: "Alvo monitorado na região central."
      }]);
    }
    setLoadedFromStorage(true);
  }, []);

  useEffect(() => {
    if (loadedFromStorage) {
      localStorage.setItem("investigados_data", JSON.stringify(investigados));
    }
  }, [investigados, loadedFromStorage]);

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

  const handleSaveInvestigado = (data: PessoalData) => {
    if (!data.nome) return addToast("Nome do investigado é obrigatório", "error");
    const newTarget = { ...data, id: Date.now() };
    setInvestigados(prev => [...prev, newTarget]);
    addToast("Investigado salvo com sucesso!", "success");
    setInvestigacaoSubTab("lista");
  };

  const handleDeleteInvestigado = (id: number) => {
    if (confirm("Deseja remover este investigado do cadastro?")) {
      setInvestigados(prev => prev.filter(i => i.id !== id));
      addToast("Investigado removido", "info");
    }
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* ABA 1: INVESTIGAÇÃO */}
        {activeTab === "investigacao" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setInvestigacaoSubTab("cadastro")}
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
            </div>

            {investigacaoSubTab === "cadastro" ? (
              <FormInvestigado onSave={handleSaveInvestigado} mapsLoaded={mapsLoaded} />
            ) : (
              <ListaInvestigados investigados={investigados} onDelete={handleDeleteInvestigado} onNew={() => setInvestigacaoSubTab("cadastro")} />
            )}
          </div>
        )}

        {/* ABA 2: REVENDA & APKS */}
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
                <div className="bg-slate-900/50 backdrop-blur-sm border border-emerald-500/20 bg-emerald-950/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-4">
                    {editingStreamingId ? "Editar Produto / APK" : "Novo Produto / APK"}
                  </h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!stForm.nome) return addToast("Nome do serviço é obrigatório", "error");
                    if (editingStreamingId !== null) {
                      setStreamings(prev => prev.map(st => st.id === editingStreamingId ? { ...st, ...stForm } : st));
                      addToast("Streaming atualizado!", "success");
                      setEditingStreamingId(null);
                    } else {
                      setStreamings(prev => [...prev, { ...stForm, id: Date.now() }]);
                      addToast("Produto adicionado!", "success");
                    }
                    setStForm({ id: 0, nome: "", foto: "", vencimento: "", usuario: "", senha: "", apkUrl: "", vendido: false });
                  }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Serviço"
                      value={stForm.nome}
                      onChange={e => setStForm({...stForm, nome: e.target.value})}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100"
                    />
                    <input
                      type="text"
                      placeholder="Foto URL"
                      value={stForm.foto}
                      onChange={e => setStForm({...stForm, foto: e.target.value})}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100"
                    />
                    <input
                      type="date"
                      value={stForm.vencimento}
                      onChange={e => setStForm({...stForm, vencimento: e.target.value})}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100"
                    />
                    <input
                      type="text"
                      placeholder="Usuário"
                      value={stForm.usuario}
                      onChange={e => setStForm({...stForm, usuario: e.target.value})}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100"
                    />
                    <input
                      type="text"
                      placeholder="Senha"
                      value={stForm.senha}
                      onChange={e => setStForm({...stForm, senha: e.target.value})}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100"
                    />
                    <input
                      type="text"
                      placeholder="Link APK"
                      value={stForm.apkUrl}
                      onChange={e => setStForm({...stForm, apkUrl: e.target.value})}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100"
                    />
                    <div className="lg:col-span-3 flex justify-end gap-2">
                      <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        {editingStreamingId ? "Atualizar" : "Salvar Produto"}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {streamings.map(st => (
                    <div key={st.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 space-y-3">
                      <div className="flex gap-3 items-center">
                        {st.foto && <img src={st.foto} alt={st.nome} className="w-12 h-12 rounded-lg object-cover border border-slate-800" />}
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-200">{st.nome}</h4>
                          <p className="text-xs text-slate-400">Usuário: {st.usuario} | Senha: {st.senha}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setStreamings(prev => prev.map(s => s.id === st.id ? { ...s, vendido: !s.vendido } : s))}
                          className="bg-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700"
                        >
                          {st.vendido ? "Liberar" : "Vender"}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setStreamings(prev => prev.filter(s => s.id !== st.id)); addToast("Removido", "info"); }}
                          className="text-red-400 text-xs px-3 py-1.5"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!cliForm.nome) return addToast("Nome do cliente obrigatório", "error");
                  setClientes(prev => [...prev, { ...cliForm, id: Date.now() }]);
                  setCliForm({ id: 0, nome: "", contato: "", plano: "", validade: "" });
                  addToast("Cliente cadastrado!", "success");
                }} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <input
                    type="text"
                    placeholder="Nome do Cliente"
                    value={cliForm.nome}
                    onChange={e => setCliForm({...cliForm, nome: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100"
                  />
                  <input
                    type="text"
                    placeholder="WhatsApp / Contato"
                    value={cliForm.contato}
                    onChange={e => setCliForm({...cliForm, contato: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100"
                  />
                  <input
                    type="text"
                    placeholder="Plano / Serviço"
                    value={cliForm.plano}
                    onChange={e => setCliForm({...cliForm, plano: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100"
                  />
                  <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Adicionar Cliente
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ABA 3: MAPA GLOBAL GPS */}
        {activeTab === "mapa" && (
          <MapaGlobal investigados={investigados} mapsLoaded={mapsLoaded} />
        )}

        {/* ABA 4: MÓDULO RESERVADO */}
        {activeTab === "modulo4" && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-12 text-center border-dashed border-2 my-12">
            <FolderPlus className="mx-auto text-emerald-500 mb-4 opacity-40" size={48} />
            <h3 className="text-xl font-bold text-slate-200">Módulo 4 - Reservado</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Esta aba está ativa e preparada para receber novos recursos futuros.
            </p>
          </div>
        )}
      </main>

      {/* Notificações Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <CheckCircle size={16} className="text-emerald-400" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}