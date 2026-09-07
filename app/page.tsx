"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  FileText, 
  HardDrive, 
  LogOut,
  Save,
  X,
  Filter
} from "lucide-react";

// --- Types ---
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
  nome: string;
  foto: string;
  cep: string;
  endereco: string;
  familiar: string;
  contato: string;
  observacoes: string;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

// --- Components ---

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
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 focus:ring-emerald-500",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 focus:ring-slate-500",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20 focus:ring-red-500",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text", 
  name,
  className = ""
}: { 
  label?: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; 
  placeholder?: string; 
  type?: string; 
  name?: string;
  className?: string;
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">{label}</label>}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
    />
  </div>
);

const Textarea = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  rows = 3 
}: { 
  label?: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
  placeholder?: string; 
  rows?: number; 
}) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">{label}</label>}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
    />
  </div>
);

const Badge = ({ status }: { status: boolean }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
    status 
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
      : "bg-slate-800 text-slate-400 border-slate-700"
  }`}>
    {status ? "Vendido" : "Em Estoque"}
  </span>
);

// --- Main Application ---

export default function Home() {
  const [activeTab, setActiveTab] = useState<"investigacao" | "revenda">("investigacao");
  const [revendaSubTab, setRevendaSubTab] = useState<"streamings" | "clientes">("streamings");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // --- State: Investigação ---
  const [pessoalForm, setPessoalForm] = useState<PessoalData>({
    nome: "",
    foto: "",
    cep: "",
    endereco: "",
    familiar: "",
    contato: "",
    observacoes: "",
  });

  // --- State: Revenda - Streamings ---
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
    nome: "", foto: "", vencimento: "", usuario: "", senha: "", apkUrl: "", vendido: false
  });
  const [searchStreaming, setSearchStreaming] = useState("");

  // --- State: Revenda - Clientes ---
  const [clientes, setClientes] = useState<Cliente[]>([
    { id: 1, nome: "João Silva", contato: "joao@email.com", plano: "Netflix Ultra HD", validade: "2026-10-10" },
  ]);
  const [cliForm, setCliForm] = useState<Cliente>({
    id: 0, nome: "", contato: "", plano: "", validade: ""
  });
  const [searchCliente, setSearchCliente] = useState("");

  // --- Helpers ---
  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleSaveStreaming = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stForm.nome) {
      addToast("Nome é obrigatório", "error");
      return;
    }

    if (editingStreamingId !== null) {
      setStreamings(prev => prev.map(st => st.id === editingStreamingId ? { ...st, ...stForm } : st));
      addToast("Streaming atualizado com sucesso!", "success");
      handleCancelEdit();
    } else {
      const newStreaming = { ...stForm, id: Date.now(), foto: stForm.foto || `https://placehold.co/150x150/10b981/ffffff?text=${stForm.nome.substring(0,2).toUpperCase()}` };
      setStreamings(prev => [...prev, newStreaming]);
      addToast("Novo streaming adicionado!", "success");
      setStForm({ nome: "", foto: "", vencimento: "", usuario: "", senha: "", apkUrl: "", vendido: false });
    }
  };

  const handleEditStreaming = (st: StreamingItem) => {
    setEditingStreamingId(st.id);
    setStForm(st);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingStreamingId(null);
    setStForm({ nome: "", foto: "", vencimento: "", usuario: "", senha: "", apkUrl: "", vendido: false });
  };

  const handleDeleteStreaming = (id: number) => {
    if (confirm("Tem certeza que deseja apagar este produto?")) {
      setStreamings(prev => prev.filter(st => st.id !== id));
      if (editingStreamingId === id) handleCancelEdit();
      addToast("Produto removido", "info");
    }
  };

  const toggleVendido = (id: number) => {
    setStreamings(prev => prev.map(st => st.id === id ? { ...st, vendido: !st.vendido } : st));
    const item = streamings.find(s => s.id === id);
    addToast(item?.vendido ? "Estoque liberado" : "Item marcado como vendido", "success");
  };

  const addCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliForm.nome) {
      addToast("Nome do cliente é obrigatório", "error");
      return;
    }
    setClientes(prev => [...prev, { ...cliForm, id: Date.now() }]);
    setCliForm({ id: 0, nome: "", contato: "", plano: "", validade: "" });
    addToast("Cliente cadastrado com sucesso!", "success");
  };

  const deleteCliente = (id: number) => {
    if (confirm("Remover cliente?")) {
      setClientes(prev => prev.filter(c => c.id !== id));
      addToast("Cliente removido", "info");
    }
  };

  // Filtered Data
  const filteredStreamings = useMemo(() => 
    streamings.filter(s => s.nome.toLowerCase().includes(searchStreaming.toLowerCase())), 
    [streamings, searchStreaming]
  );

  const filteredClientes = useMemo(() => 
    clientes.filter(c => c.nome.toLowerCase().includes(searchCliente.toLowerCase()) || c.contato.toLowerCase().includes(searchCliente.toLowerCase())), 
    [clientes, searchCliente]
  );

  // --- Render Helpers ---
  const renderToast = () => (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right-full duration-300 ${
          toast.type === "success" ? "bg-emerald-900/90 border-emerald-700 text-emerald-100" :
          toast.type === "error" ? "bg-red-900/90 border-red-700 text-red-100" :
          "bg-slate-800/90 border-slate-700 text-slate-100"
        }`}>
          {toast.type === "success" ? <CheckCircle size={18} /> : toast.type === "error" ? <XCircle size={18} /> : <Activity size={18} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-900/20">
              <LayoutDashboard className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Painel<span className="text-emerald-500">Pro</span>
            </h1>
          </div>
          
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveTab("investigacao")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === "investigacao"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <FileText size={16} /> Investigação
            </button>
            <button
              onClick={() => setActiveTab("revenda")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === "revenda"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <HardDrive size={16} /> Revenda
            </button>
          </div>

          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8 pb-20">
        
        {/* --- INVESTIGAÇÃO TAB --- */}
        {activeTab === "investigacao" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                <Users className="text-emerald-500" /> Dados Pessoais
              </h2>
              <Button onClick={() => addToast("Dados salvos localmente", "success")} variant="primary">
                <Save size={18} className="mr-2" /> Salvar Dados
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Nome Completo" value={pessoalForm.nome} onChange={e => setPessoalForm({...pessoalForm, nome: e.target.value})} placeholder="Ex: João da Silva" />
                  <Input label="CPF / Documento" value={pessoalForm.contato} onChange={e => setPessoalForm({...pessoalForm, contato: e.target.value})} placeholder="000.000.000-00" />
                  <Input label="CEP" value={pessoalForm.cep} onChange={e => setPessoalForm({...pessoalForm, cep: e.target.value})} placeholder="00000-000" />
                  <Input label="Endereço Completo" value={pessoalForm.endereco} onChange={e => setPessoalForm({...pessoalForm, endereco: e.target.value})} placeholder="Rua, Número, Bairro" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Input label="Contato Alternativo" value={pessoalForm.familiar} onChange={e => setPessoalForm({...pessoalForm, familiar: e.target.value})} placeholder="(00) 00000-0000" />
                  <Input label="Foto / URL" value={pessoalForm.foto} onChange={e => setPessoalForm({...pessoalForm, foto: e.target.value})} placeholder="https://..." />
                </div>

                <Textarea label="Observações da Investigação" value={pessoalForm.observacoes} onChange={e => setPessoalForm({...pessoalForm, observacoes: e.target.value})} placeholder="Detalhes adicionais..." />
              </Card>

              <Card className="p-6 bg-slate-900/80 border-dashed border-2 border-slate-800 flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center overflow-hidden">
                  {pessoalForm.foto ? (
                    <img src={pessoalForm.foto} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "https://placehold.co/100x100/334155/ffffff?text=Img")} />
                  ) : (
                    <span className="text-3xl font-bold text-slate-600">?</span>
                  )}
                </div>
                <p className="text-sm text-slate-400">Preview da foto do alvo</p>
              </Card>
            </div>
          </div>
        )}

        {/* --- REVENDA TAB --- */}
        {activeTab === "revenda" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Sub Navigation */}
            <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-2">
              <button
                onClick={() => setRevendaSubTab("streamings")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  revendaSubTab === "streamings" 
                    ? "border-emerald-500 text-emerald-400" 
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Catálogo de Streamings
              </button>
              <button
                onClick={() => setRevendaSubTab("clientes")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  revendaSubTab === "clientes" 
                    ? "border-emerald-500 text-emerald-400" 
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Base de Clientes
              </button>
            </div>

            {revendaSubTab === "streamings" ? (
              <>
                {/* Streaming Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="Buscar streaming..." 
                      value={searchStreaming}
                      onChange={(e) => setSearchStreaming(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <Button 
                    onClick={() => {
                      handleCancelEdit();
                      // Focus on form could be handled via refs, but simple scroll to top is enough for now
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }} 
                    variant="primary"
                  >
                    <Plus size={18} className="mr-2" /> Novo Produto
                  </Button>
                </div>

                {/* Form Area */}
                <Card className="mb-8 p-6 border-emerald-500/20 bg-emerald-950/10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                      {editingStreamingId ? "Editando Produto" : "Adicionar Novo Streaming/APK"}
                    </h3>
                    {editingStreamingId && (
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                        <X size={16} className="mr-2" /> Cancelar Edição
                      </Button>
                    )}
                  </div>
                  
                  <form onSubmit={handleSaveStreaming} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input 
                      label="Nome do Serviço" 
                      value={stForm.nome} 
                      onChange={e => setStForm({...stForm, nome: e.target.value})} 
                      placeholder="Ex: Netflix 4K" 
                      className="md:col-span-2"
                    />
                    <Input 
                      label="URL da Imagem" 
                      value={stForm.foto} 
                      onChange={e => setStForm({...stForm, foto: e.target.value})} 
                      placeholder="https://..." 
                    />
                    <Input 
                      label="Vencimento" 
                      type="date"
                      value={stForm.vencimento} 
                      onChange={e => setStForm({...stForm, vencimento: e.target.value})} 
                    />
                    <Input 
                      label="Usuário / Login" 
                      value={stForm.usuario} 
                      onChange={e => setStForm({...stForm, usuario: e.target.value})} 
                      placeholder="seu@email.com" 
                    />
                    <Input 
                      label="Senha / Token" 
                      value={stForm.senha} 
                      onChange={e => setStForm({...stForm, senha: e.target.value})} 
                      placeholder="••••••••" 
                    />
                    <Input 
                      label="Link APK / Download" 
                      value={stForm.apkUrl} 
                      onChange={e => setStForm({...stForm, apkUrl: e.target.value})} 
                      placeholder="https://..." 
                    />
                    
                    <div className="md:col-span-3 flex justify-end gap-3 mt-2">
                      <Button variant="secondary" onClick={handleCancelEdit}>Limpar</Button>
                      <Button type="submit" variant="primary">
                        {editingStreamingId ? "Atualizar" : "Salvar Produto"}
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* List */}
                <div className="space-y-4">
                  {filteredStreamings.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <HardDrive size={48} className="mx-auto mb-4 opacity-20" />
                      <p>Nenhum streaming encontrado.</p>
                    </div>
                  ) : (
                    filteredStreamings.map((st) => (
                      <Card key={st.id} className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4 group hover:border-emerald-500/30 transition-colors">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                           <img 
                            src={st.foto} 
                            alt={st.nome} 
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.src = "https://placehold.co/100x100/1e293b/ffffff?text=IMG")}
                           />
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-200 truncate">{st.nome}</h4>
                            <Badge status={st.vendido} />
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><UserIcon size={12}/> {st.usuario}</span>
                            <span className="flex items-center gap-1"><CalendarIcon size={12}/> {new Date(st.vencimento).toLocaleDateString()}</span>
                          </div>
                          <div className="text-xs text-slate-500 truncate max-w-md">
                            <span className="font-mono bg-slate-950 px-1 rounded">{st.senha}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0">
                          <Button size="sm" variant="secondary" onClick={() => toggleVendido(st.id)} className={st.vendido ? "text-emerald-400 border-emerald-500/30" : ""}>
                            {st.vendido ? "Liberar Estoque" : "Marcar Vendido"}
                          </Button>
                          <div className="h-6 w-px bg-slate-700 mx-1 hidden md:block"></div>
                          <Button size="sm" variant="ghost" onClick={() => handleEditStreaming(st)}>
                            <Edit2 size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteStreaming(st.id)} className="text-red-400 hover:text-red-300 hover:bg-red-950/30">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </>
            ) : (
              /* --- CLIENTES SUB-TAB --- */
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="Buscar cliente..." 
                      value={searchCliente}
                      onChange={(e) => setSearchCliente(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <Button onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })} variant="primary">
                    <Plus size={18} className="mr-2" /> Novo Cliente
                  </Button>
                </div>

                <Card className="p-6 mb-8 border-slate-800">
                   <form onSubmit={addCliente} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <Input 
                      label="Nome do Cliente" 
                      value={cliForm.nome} 
                      onChange={e => setCliForm({...cliForm, nome: e.target.value})} 
                      placeholder="Nome Completo" 
                    />
                    <Input 
                      label="Contato (Email/Telef)" 
                      value={cliForm.contato} 
                      onChange={e => setCliForm({...cliForm, contato: e.target.value})} 
                      placeholder="Contato" 
                    />
                    <Input 
                      label="Plano" 
                      value={cliForm.plano} 
                      onChange={e => setCliForm({...cliForm, plano: e.target.value})} 
                      placeholder="Ex: Netflix" 
                    />
                    <div className="flex gap-2">
                      <Button type="submit" variant="primary" className="flex-1">Adicionar</Button>
                    </div>
                  </form>
                </Card>

                <div className="grid gap-4">
                  {filteredClientes.map((c) => (
                    <Card key={c.id} className="p-4 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                          {c.nome.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-200">{c.nome}</h4>
                          <p className="text-xs text-slate-400">{c.plano} • Vence: {new Date(c.validade).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-xs text-slate-500 mr-2 hidden md:inline">{c.contato}</span>
                         <Button size="sm" variant="ghost" onClick={() => deleteCliente(c.id)} className="text-red-400 hover:bg-red-950/30">
                            <Trash2 size={16} />
                          </Button>
                      </div>
                    </Card>
                  ))}
                  {filteredClientes.length === 0 && (
                     <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        <p>Nenhum cliente encontrado.</p>
                     </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {renderToast()}
    </div>
  );
}

// Small Helper Icons used inside components
const UserIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const CalendarIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>