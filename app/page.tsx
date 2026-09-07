"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  FileText, 
  HardDrive, 
  Save, 
  FolderPlus,
  Boxes,
  Upload,
  Link as LinkIcon,
  MapPin,
  List
} from "lucide-react";

// --- Interfaces ---
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

// --- Componentes ---
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ 
  onClick, 
  children, 
  variant = "primary", 
  size = "md", 
  className = "",
  disabled = false,
  type = "button"
}: { 
  onClick?: () => void; 
  children: React.ReactNode; 
  variant?: "primary" | "secondary" | "danger" | "ghost"; 
  size?: "sm" | "md" | "lg"; 
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 cursor-pointer";
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ 
  label, value, onChange, placeholder, type = "text", className = "", id
}: { 
  label?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string; className?: string; id?: string;
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">{label}</label>}
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all text-sm"
    />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 3 }: { label?: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">{label}</label>}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all resize-none text-sm"
    />
  </div>
);

const Badge = ({ status }: { status: boolean }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
    status ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-800 text-slate-400 border-slate-700"
  }`}>
    {status ? "Vendido" : "Em Estoque"}
  </span>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<"investigacao" | "revenda" | "mapa" | "modulo4">("investigacao");
  const [investigacaoSubTab, setInvestigacaoSubTab] = useState<"cadastro" | "lista">("cadastro");
  const [revendaSubTab, setRevendaSubTab] = useState<"streamings" | "clientes">("streamings");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [fotoTipoInvestigacao, setFotoTipoInvestigacao] = useState<"link" | "file">("file");
  const [fotoTipoStreaming, setFotoTipoStreaming] = useState<"link" | "file">("file");

  // Lista de Investigados Salvos com persistência no LocalStorage
  const [investigados, setInvestigados] = useState<PessoalData[]>([]);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("investigados_data");
    if (saved) {
      try {
        setInvestigados(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao ler localStorage", e);
      }
    } else {
      setInvestigados([
        {
          id: 1,
          nome: "Carlos Eduardo Silva",
          foto: "",
          cep: "30140-071",
          endereco: "Av. Getúlio Vargas, Belo Horizonte - MG",
          lat: -19.9322,
          lng: -43.9317,
          familiar: "Maria Silva",
          contato: "(31) 98888-7777",
          observacoes: "Alvo monitorado na região central."
        }
      ]);
    }
    setLoadedFromStorage(true);
  }, []);

  useEffect(() => {
    if (loadedFromStorage) {
      localStorage.setItem("investigados_data", JSON.stringify(investigados));
    }
  }, [investigados, loadedFromStorage]);

  const [pessoalForm, setPessoalForm] = useState<PessoalData>({
    nome: "", foto: "", cep: "", endereco: "", familiar: "", contato: "", observacoes: "", lat: 0, lng: 0
  });

  // Estados - Revenda
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
  const [searchStreaming, setSearchStreaming] = useState("");

  // Estados - Clientes
  const [clientes, setClientes] = useState<Cliente[]>([
    { id: 1, nome: "João Silva", contato: "joao@email.com", plano: "Netflix Ultra HD", validade: "2026-10-10" },
  ]);
  const [cliForm, setCliForm] = useState<Cliente>({ id: 0, nome: "", contato: "", plano: "", validade: "" });
  const [searchCliente, setSearchCliente] = useState("");
  const [searchInvestigado, setSearchInvestigado] = useState("");

  const mapRef = useRef<HTMLDivElement>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  // Carregar script do Google Maps dinamicamente
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapsLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Autocomplete no Endereço
  useEffect(() => {
    if (activeTab === "investigacao" && investigacaoSubTab === "cadastro" && mapsLoaded && window.google) {
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
  }, [activeTab, investigacaoSubTab, mapsLoaded]);

  // Renderizar o Mapa na 3ª Aba
  useEffect(() => {
    if (activeTab === "mapa" && mapRef.current && mapsLoaded && window.google) {
      const defaultCenter = { lat: -19.9322, lng: -43.9317 }; // Belo Horizonte / Brasil
      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 5,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#1e293b" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#334155" }] }
        ],
      });

      investigados.forEach(inv => {
        if (inv.lat && inv.lng) {
          const marker = new window.google.maps.Marker({
            position: { lat: inv.lat, lng: inv.lng },
            map,
            title: inv.nome,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="color: #0f172a; font-family: sans-serif; font-size: 12px; padding: 4px;">
                <strong style="font-size: 14px;">${inv.nome}</strong><br/>
                <span style="color: #475569;">${inv.endereco}</span><br/>
                <small style="color: #059669;">Contato: ${inv.contato}</small>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        }
      });
    }
  }, [activeTab, mapsLoaded, investigados]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveInvestigado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pessoalForm.nome) return addToast("Nome do investigado é obrigatório", "error");

    const newTarget = { ...pessoalForm, id: Date.now() };
    setInvestigados(prev => [...prev, newTarget]);
    addToast("Investigado salvo com sucesso!", "success");
    setPessoalForm({ nome: "", foto: "", cep: "", endereco: "", familiar: "", contato: "", observacoes: "", lat: 0, lng: 0 });
    setInvestigacaoSubTab("lista");
  };

  const handleDeleteInvestigado = (id: number) => {
    if (confirm("Deseja remover este investigado do cadastro?")) {
      setInvestigados(prev => prev.filter(i => i.id !== id));
      addToast("Investigado removido", "info");
    }
  };

  const handleSaveStreaming = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stForm.nome) return addToast("Nome do serviço é obrigatório", "error");

    if (editingStreamingId !== null) {
      setStreamings(prev => prev.map(st => st.id === editingStreamingId ? { ...st, ...stForm } : st));
      addToast("Streaming atualizado!", "success");
      handleCancelEdit();
    } else {
      setStreamings(prev => [...prev, { ...stForm, id: Date.now() }]);
      addToast("Produto adicionado!", "success");
      setStForm({ id: 0, nome: "", foto: "", vencimento: "", usuario: "", senha: "", apkUrl: "", vendido: false });
    }
  };

  const handleEditStreaming = (st: StreamingItem) => {
    setEditingStreamingId(st.id);
    setStForm(st);
  };

  const handleCancelEdit = () => {
    setEditingStreamingId(null);
    setStForm({ id: 0, nome: "", foto: "", vencimento: "", usuario: "", senha: "", apkUrl: "", vendido: false });
  };

  const handleDeleteStreaming = (id: number) => {
    if (confirm("Deseja apagar este produto?")) {
      setStreamings(prev => prev.filter(st => st.id !== id));
      addToast("Produto removido", "info");
    }
  };

  const toggleVendido = (id: number) => {
    setStreamings(prev => prev.map(st => st.id === id ? { ...st, vendido: !st.vendido } : st));
  };

  const addCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliForm.nome) return addToast("Nome do cliente é obrigatório", "error");
    setClientes(prev => [...prev, { ...cliForm, id: Date.now() }]);
    setCliForm({ id: 0, nome: "", contato: "", plano: "", validade: "" });
    addToast("Cliente cadastrado!", "success");
  };

  const filteredStreamings = useMemo(() => 
    streamings.filter(s => s.nome.toLowerCase().includes(searchStreaming.toLowerCase())), [streamings, searchStreaming]
  );

  const filteredInvestigados = useMemo(() => 
    investigados.filter(i => i.nome.toLowerCase().includes(searchInvestigado.toLowerCase()) || i.endereco.toLowerCase().includes(searchInvestigado.toLowerCase())), [investigados, searchInvestigado]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Topbar com 4 Abas */}
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
        </div>
      </header>

      {/* Conteúdo Principal */}
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
              <form onSubmit={handleSaveInvestigado} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Nome Completo" value={pessoalForm.nome} onChange={e => setPessoalForm({...pessoalForm, nome: e.target.value})} placeholder="Nome do alvo" />
                    <Input label="Contato / Documento" value={pessoalForm.contato} onChange={e => setPessoalForm({...pessoalForm, contato: e.target.value})} placeholder="Telefone ou CPF" />
                    <Input label="CEP" value={pessoalForm.cep} onChange={e => setPessoalForm({...pessoalForm, cep: e.target.value})} placeholder="00000-000" />
                    <Input id="endereco-input" label="Endereço (Google Autocomplete)" value={pessoalForm.endereco} onChange={e => setPessoalForm({...pessoalForm, endereco: e.target.value})} placeholder="Busque rua, número ou cidade..." />
                  </div>
                  <Input label="Familiar Relacionado" value={pessoalForm.familiar} onChange={e => setPessoalForm({...pessoalForm, familiar: e.target.value})} placeholder="Nome do familiar" />
                  <Textarea label="Observações e Informações" value={pessoalForm.observacoes} onChange={e => setPessoalForm({...pessoalForm, observacoes: e.target.value})} placeholder="Notas adicionais sobre o alvo..." />
                  
                  <Button type="submit" variant="primary" className="w-full">
                    <Save size={16} className="mr-2" /> Salvar Cadastro no Sistema
                  </Button>
                </Card>

                <Card className="p-6 bg-slate-900/80 border-slate-800 flex flex-col justify-between items-center text-center space-y-4">
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
                        onClick={() => setFotoTipoInvestigacao("file")}
                        className={`flex-1 py-1 text-xs font-medium rounded transition ${fotoTipoInvestigacao === "file" ? "bg-slate-800 text-emerald-400" : "text-slate-500"}`}
                      >
                        <Upload size={12} className="inline mr-1" /> Arquivo
                      </button>
                      <button
                        type="button"
                        onClick={() => setFotoTipoInvestigacao("link")}
                        className={`flex-1 py-1 text-xs font-medium rounded transition ${fotoTipoInvestigacao === "link" ? "bg-slate-800 text-emerald-400" : "text-slate-500"}`}
                      >
                        <LinkIcon size={12} className="inline mr-1" /> Link URL
                      </button>
                    </div>

                    {fotoTipoInvestigacao === "file" ? (
                      <label className="block w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-400 cursor-pointer transition">
                        <span>Escolher foto do PC...</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleFileUpload(e, base64 => setPessoalForm({ ...pessoalForm, foto: base64 }))}
                        />
                      </label>
                    ) : (
                      <Input
                        placeholder="Cole a URL da foto..."
                        value={pessoalForm.foto}
                        onChange={e => setPessoalForm({ ...pessoalForm, foto: e.target.value })}
                      />
                    )}
                  </div>
                </Card>
              </form>
            ) : (
              /* LISTA DE INVESTIGADOS CADASTRADOS */
              <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="relative max-w-md flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="text"
                      placeholder="Buscar por nome ou endereço..."
                      value={searchInvestigado}
                      onChange={e => setSearchInvestigado(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 outline-none"
                    />
                  </div>
                  <Button size="sm" onClick={() => setInvestigacaoSubTab("cadastro")}>
                    <Plus size={14} className="mr-1" /> Novo Cadastro
                  </Button>
                </div>

                {filteredInvestigados.length === 0 ? (
                  <Card className="p-8 text-center text-slate-500">
                    <Users className="mx-auto mb-2 opacity-30" size={32} />
                    <p className="text-sm">Nenhum investigado encontrado.</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredInvestigados.map(inv => (
                      <Card key={inv.id} className="p-4 flex gap-4 items-start relative group">
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
                          onClick={() => handleDeleteInvestigado(inv.id!)}
                          className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
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
                <Card className="p-6 border-emerald-500/20 bg-emerald-950/10">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-4">
                    {editingStreamingId ? "Editar Produto / APK" : "Novo Produto / APK"}
                  </h3>
                  <form onSubmit={handleSaveStreaming} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input label="Serviço" value={stForm.nome} onChange={e => setStForm({...stForm, nome: e.target.value})} placeholder="Ex: IPTV Premium" />
                    
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Foto/Logo</label>
                        <div className="flex gap-2 text-[10px]">
                          <button type="button" onClick={() => setFotoTipoStreaming("file")} className={fotoTipoStreaming === "file" ? "text-emerald-400 font-bold" : "text-slate-500"}>Arquivo</button>
                          <button type="button" onClick={() => setFotoTipoStreaming("link")} className={fotoTipoStreaming === "link" ? "text-emerald-400 font-bold" : "text-slate-500"}>Link</button>
                        </div>
                      </div>
                      {fotoTipoStreaming === "file" ? (
                        <label className="block w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-400 cursor-pointer">
                          <span>Upload Imagem...</span>
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, base64 => setStForm({ ...stForm, foto: base64 }))} />
                        </label>
                      ) : (
                        <input
                          type="text"
                          value={stForm.foto}
                          onChange={e => setStForm({...stForm, foto: e.target.value})}
                          placeholder="https://..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-sm"
                        />
                      )}
                    </div>

                    <Input label="Vencimento" type="date" value={stForm.vencimento} onChange={e => setStForm({...stForm, vencimento: e.target.value})} />
                    <Input label="Usuário" value={stForm.usuario} onChange={e => setStForm({...stForm, usuario: e.target.value})} placeholder="Usuário" />
                    <Input label="Senha" value={stForm.senha} onChange={e => setStForm({...stForm, senha: e.target.value})} placeholder="Senha" />
                    <Input label="Link do APK" value={stForm.apkUrl} onChange={e => setStForm({...stForm, apkUrl: e.target.value})} placeholder="https://mediafire.com/..." />
                    <div className="lg:col-span-3 flex justify-end gap-2">
                      {editingStreamingId && <Button variant="secondary" onClick={handleCancelEdit}>Cancelar</Button>}
                      <Button type="submit" variant="primary">{editingStreamingId ? "Atualizar" : "Salvar Produto"}</Button>
                    </div>
                  </form>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredStreamings.map(st => (
                    <Card key={st.id} className="p-4 space-y-3">
                      <div className="flex gap-3 items-center">
                        {st.foto && (
                          <img src={st.foto} alt={st.nome} className="w-12 h-12 rounded-lg object-cover border border-slate-800" />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-200">{st.nome}</h4>
                            <Badge status={st.vendido} />
                          </div>
                          <p className="text-xs text-slate-400">Usuário: {st.usuario} | Senha: {st.senha}</p>
                        </div>
                      </div>
                      {st.apkUrl && (
                        <a href={st.apkUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 underline block">
                          Download APK
                        </a>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="secondary" onClick={() => toggleVendido(st.id)}>
                          {st.vendido ? "Liberar" : "Vender"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEditStreaming(st)}><Edit2 size={14} /></Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteStreaming(st.id)} className="text-red-400"><Trash2 size={14} /></Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="p-6">
                <form onSubmit={addCliente} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <Input label="Cliente" value={cliForm.nome} onChange={e => setCliForm({...cliForm, nome: e.target.value})} placeholder="Nome" />
                  <Input label="Contato" value={cliForm.contato} onChange={e => setCliForm({...cliForm, contato: e.target.value})} placeholder="WhatsApp" />
                  <Input label="Plano" value={cliForm.plano} onChange={e => setCliForm({...cliForm, plano: e.target.value})} placeholder="Plano" />
                  <Button type="submit" variant="primary">Adicionar Cliente</Button>
                </form>
              </Card>
            )}
          </div>
        )}

        {/* ABA 3: MAPA GLOBAL GPS DO GOOGLE MAPS */}
        {activeTab === "mapa" && (
          <Card className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-bold text-slate-100 flex items-center gap-2">
                <MapPin className="text-emerald-400" size={18} /> Rastreamento e Mapeamento Global
              </h3>
              <span className="text-xs text-slate-400">Pontos no Mapa: {investigados.filter(i => i.lat && i.lng).length}</span>
            </div>

            <div className="w-full h-[550px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative">
              <div ref={mapRef} className="w-full h-full" />
              {!mapsLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-slate-400 text-xs">
                  <MapPin className="text-emerald-500 animate-bounce mb-2" size={28} />
                  <span>Carregando Google Maps...</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* ABA 4: MÓDULO FUTURO */}
        {activeTab === "modulo4" && (
          <Card className="p-12 text-center border-dashed border-2 border-slate-800 my-12">
            <FolderPlus className="mx-auto text-emerald-500 mb-4 opacity-40" size={48} />
            <h3 className="text-xl font-bold text-slate-200">Módulo 4 - Reservado</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Esta aba está ativa e preparada para receber os seus novos recursos futuros.
            </p>
          </Card>
        )}
      </main>

      {/* Toasts */}
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