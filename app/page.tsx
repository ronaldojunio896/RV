"use client";

import React, { useState, useMemo } from "react";
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
  FolderPlus,
  Boxes
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

// --- Componentes Reutilizáveis ---
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
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ 
  label, value, onChange, placeholder, type = "text", className = ""
}: { 
  label?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string; className?: string;
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
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
      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none text-sm"
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
  const [activeTab, setActiveTab] = useState<"investigacao" | "revenda" | "modulo3" | "modulo4">("investigacao");
  const [revendaSubTab, setRevendaSubTab] = useState<"streamings" | "clientes">("streamings");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Estados - Investigação
  const [pessoalForm, setPessoalForm] = useState<PessoalData>({
    nome: "", foto: "", cep: "", endereco: "", familiar: "", contato: "", observacoes: ""
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

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
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

  const filteredClientes = useMemo(() => 
    clientes.filter(c => c.nome.toLowerCase().includes(searchCliente.toLowerCase())), [clientes, searchCliente]
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

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 flex-wrap justify-center">
            <button
              onClick={() => setActiveTab("investigacao")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                activeTab === "investigacao" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText size={14} /> Investigação
            </button>
            <button
              onClick={() => setActiveTab("revenda")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                activeTab === "revenda" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <HardDrive size={14} /> Revenda & APKs
            </button>
            <button
              onClick={() => setActiveTab("modulo3")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                activeTab === "modulo3" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Boxes size={14} /> Módulo 3
            </button>
            <button
              onClick={() => setActiveTab("modulo4")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                activeTab === "modulo4" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
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
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                <Users className="text-emerald-500" /> Investigação e Mapeamento
              </h2>
              <Button onClick={() => addToast("Dados salvos!", "success")} variant="primary">
                <Save size={16} className="mr-2" /> Salvar Cadastro
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Nome Completo" value={pessoalForm.nome} onChange={e => setPessoalForm({...pessoalForm, nome: e.target.value})} placeholder="Nome do investigado" />
                  <Input label="Contato / Documento" value={pessoalForm.contato} onChange={e => setPessoalForm({...pessoalForm, contato: e.target.value})} placeholder="Telefone ou CPF" />
                  <Input label="CEP" value={pessoalForm.cep} onChange={e => setPessoalForm({...pessoalForm, cep: e.target.value})} placeholder="00000-000" />
                  <Input label="Endereço" value={pessoalForm.endereco} onChange={e => setPessoalForm({...pessoalForm, endereco: e.target.value})} placeholder="Rua, Número, Bairro" />
                </div>
                <Input label="Familiar Relacionado" value={pessoalForm.familiar} onChange={e => setPessoalForm({...pessoalForm, familiar: e.target.value})} placeholder="Nome do familiar" />
                <Textarea label="Observações e Informações" value={pessoalForm.observacoes} onChange={e => setPessoalForm({...pessoalForm, observacoes: e.target.value})} placeholder="Notas adicionais sobre o alvo..." />
              </Card>

              <Card className="p-6 bg-slate-900/80 border-dashed border-2 border-slate-800 flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center overflow-hidden">
                  {pessoalForm.foto ? (
                    <img src={pessoalForm.foto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-slate-600">FOTO</span>
                  )}
                </div>
                <Input label="URL da Imagem" value={pessoalForm.foto} onChange={e => setPessoalForm({...pessoalForm, foto: e.target.value})} placeholder="https://..." />
              </Card>
            </div>
          </div>
        )}

        {/* ABA 2: REVENDA & APKS */}
        {activeTab === "revenda" && (
          <div className="space-y-6">
            <div className="flex gap-4 border-b border-slate-800 pb-2">
              <button
                onClick={() => setRevendaSubTab("streamings")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                  revendaSubTab === "streamings" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400"
                }`}
              >
                Streamings & APKs
              </button>
              <button
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
                    <Input label="URL Imagem" value={stForm.foto} onChange={e => setStForm({...stForm, foto: e.target.value})} placeholder="Link do logo" />
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
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-200">{st.nome}</h4>
                        <Badge status={st.vendido} />
                      </div>
                      <p className="text-xs text-slate-400">Usuário: {st.usuario} | Senha: {st.senha}</p>
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

        {/* ABA 3: MÓDULO FUTURO 1 */}
        {activeTab === "modulo3" && (
          <Card className="p-12 text-center border-dashed border-2 border-slate-800 my-12">
            <Boxes className="mx-auto text-emerald-500 mb-4 opacity-40" size={48} />
            <h3 className="text-xl font-bold text-slate-200">Módulo 3 - Reservado</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Esta aba está limpa e preparada para receber novas funcionalidades personalizadas no futuro.
            </p>
          </Card>
        )}

        {/* ABA 4: MÓDULO FUTURO 2 */}
        {activeTab === "modulo4" && (
          <Card className="p-12 text-center border-dashed border-2 border-slate-800 my-12">
            <FolderPlus className="mx-auto text-emerald-500 mb-4 opacity-40" size={48} />
            <h3 className="text-xl font-bold text-slate-200">Módulo 4 - Reservado</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Esta aba está limpa e preparada para receber novas funcionalidades personalizadas no futuro.
            </p>
          </Card>
        )}
      </main>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            {toast.type === "success" ? <CheckCircle size={16} className="text-emerald-400" /> : <Activity size={16} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}