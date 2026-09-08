"use client";

import React, { useState, useEffect } from "react";
import { Plus, List, FolderPlus, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import LoginModal from "@/components/LoginModal";
import FormInvestigado from "@/components/investigacao/FormInvestigado";
import ListaInvestigados from "@/components/investigacao/ListaInvestigados";
import MapaGlobal from "@/components/mapa/MapaGlobal";
import { supabase } from "@/lib/supabase";

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
  const [streamings, setStreamings] = useState<StreamingItem[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [editingStreamingId, setEditingStreamingId] = useState<number | null>(null);
  const [stForm, setStForm] = useState<StreamingItem>({
    id: 0, nome: "", foto: "", vencimento: "", usuario: "", senha: "", apkUrl: "", vendido: false
  });

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

  const handleSaveInvestigado = async (data: PessoalData) => {
    if (!data.nome) return addToast("Nome do investigado é obrigatório", "error");

    const { id, ...payload } = data;

    const { data: inserted, error } = await supabase
      .from("investigados")
      .insert([{
        ...payload,
        lat: data.lat ? Number(data.lat) : null,
        lng: data.lng ? Number(data.lng) : null,
      }])
      .select();

    if (error) {
      console.error("Erro Supabase:", error);
      addToast("Erro ao salvar no banco de dados", "error");
    } else if (inserted && inserted.length > 0) {
      setInvestigados(prev => [inserted[0], ...prev]);
      addToast("Investigado salvo com localização GPS!", "success");
      setInvestigacaoSubTab("lista");
      loadData();
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
                      <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
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
                          className="text-red-400 text-xs px-3 py-1.5 cursor-pointer"
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
                  <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
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
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-12 text-center border-dashed border-2 my-12">
            <FolderPlus className="mx-auto text-emerald-500 mb-4 opacity-40" size={48} />
            <h3 className="text-xl font-bold text-slate-200">Módulo 4 - Reservado</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Esta aba está ativa e preparada para receber novos recursos futuros.
            </p>
          </div>
        )}
      </main>

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