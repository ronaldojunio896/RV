"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"investigacao" | "revenda">("investigacao");
  const [revendaSubTab, setRevendaSubTab] = useState<"streamings" | "clientes">("streamings");

  // Estados - Investigação
  const [pessoalForm, setPessoalForm] = useState({
    nome: "",
    foto: "",
    cep: "",
    endereco: "",
    familiar: "",
    contato: "",
    observacoes: "",
  });

  // Estados - Revenda (Streamings / APKs)
  const [streamings, setStreamings] = useState([
    {
      id: 1,
      nome: "Netflix Ultra HD",
      foto: "https://via.placeholder.com/150",
      vencimento: "2026-10-10",
      usuario: "user_test",
      senha: "password123",
      apkUrl: "https://mediafire.com/file/exemplo_apk",
      vendido: false,
    },
  ]);

  const [stForm, setStForm] = useState({
    nome: "",
    foto: "",
    vencimento: "",
    usuario: "",
    senha: "",
    apkUrl: "",
  });

  // Estados - Clientes
  const [clientes, setClientes] = useState([
    { id: 1, nome: "João Silva", contato: "joao@email.com", plano: "Netflix Ultra HD", validade: "2026-10-10" },
  ]);

  const [cliForm, setCliForm] = useState({
    nome: "",
    contato: "",
    plano: "",
    validade: "",
  });

  const toggleVendido = (id: number) => {
    setStreamings(
      streamings.map((st) => (st.id === id ? { ...st, vendido: !st.vendido } : st))
    );
  };

  const addStreaming = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stForm.nome) return;
    setStreamings([
      ...streamings,
      { ...stForm, id: Date.now(), vendido: false },
    ]);
    setStForm({ nome: "", foto: "", vencimento: "", usuario: "", senha: "", apkUrl: "" });
  };

  const addCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliForm.nome) return;
    setClientes([...clientes, { ...cliForm, id: Date.now() }]);
    setCliForm({ nome: "", contato: "", plano: "", validade: "" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Topbar / Navegação Principal */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wider text-emerald-400">PAINEL DE CONTROLE</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("investigacao")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "investigacao"
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Investigação
          </button>
          <button
            onClick={() => setActiveTab("revenda")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "revenda"
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Revenda & APKs
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6">
        {activeTab === "investigacao" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Bloco GPS / Mapa */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
              <h2 className="text-lg font-semibold text-emerald-400 mb-3">GPS / Rastreamento em Tempo Real</h2>
              <div className="flex-1 min-h-[350px] bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center text-slate-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                <p className="z-10 text-sm">Mapa interativo (Aguardando coordenadas GPS)</p>
              </div>
            </div>

            {/* Cadastro de Investigação */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-emerald-400 mb-4">Cadastro de Investigado</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={pessoalForm.nome}
                    onChange={(e) => setPessoalForm({ ...pessoalForm, nome: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    placeholder="Nome do alvo"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">URL da Foto</label>
                  <input
                    type="text"
                    value={pessoalForm.foto}
                    onChange={(e) => setPessoalForm({ ...pessoalForm, foto: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    placeholder="Link da imagem"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">CEP</label>
                  <input
                    type="text"
                    value={pessoalForm.cep}
                    onChange={(e) => setPessoalForm({ ...pessoalForm, cep: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    placeholder="00000-000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Endereço</label>
                  <input
                    type="text"
                    value={pessoalForm.endereco}
                    onChange={(e) => setPessoalForm({ ...pessoalForm, endereco: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    placeholder="Rua, Número, Bairro"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Familiar Relacionado</label>
                  <input
                    type="text"
                    value={pessoalForm.familiar}
                    onChange={(e) => setPessoalForm({ ...pessoalForm, familiar: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    placeholder="Nome do familiar"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Contato (Telefone / Email)</label>
                  <input
                    type="text"
                    value={pessoalForm.contato}
                    onChange={(e) => setPessoalForm({ ...pessoalForm, contato: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Informações Adicionais</label>
                  <textarea
                    rows={3}
                    value={pessoalForm.observacoes}
                    onChange={(e) => setPessoalForm({ ...pessoalForm, observacoes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    placeholder="Notas adicionais sobre a pessoa..."
                  />
                </div>
                <button
                  type="button"
                  className="md:col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded transition"
                >
                  Salvar Cadastro
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "revenda" && (
          <div className="space-y-6">
            {/* Navegação Secundária */}
            <div className="flex border-b border-slate-800 gap-4">
              <button
                onClick={() => setRevendaSubTab("streamings")}
                className={`pb-2 font-medium text-sm transition border-b-2 ${
                  revendaSubTab === "streamings"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Streamings & APKs
              </button>
              <button
                onClick={() => setRevendaSubTab("clientes")}
                className={`pb-2 font-medium text-sm transition border-b-2 ${
                  revendaSubTab === "clientes"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Gestão de Clientes
              </button>
            </div>

            {revendaSubTab === "streamings" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form de Cadastro de Streaming */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 h-fit">
                  <h3 className="text-md font-semibold text-emerald-400 mb-3">Novo Streaming / APK</h3>
                  <form onSubmit={addStreaming} className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Nome do Serviço</label>
                      <input
                        type="text"
                        value={stForm.nome}
                        onChange={(e) => setStForm({ ...stForm, nome: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100"
                        placeholder="Ex: Netflix, IPTV"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">URL da Imagem</label>
                      <input
                        type="text"
                        value={stForm.foto}
                        onChange={(e) => setStForm({ ...stForm, foto: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100"
                        placeholder="Link do logo/imagem"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Data de Vencimento</label>
                      <input
                        type="date"
                        value={stForm.vencimento}
                        onChange={(e) => setStForm({ ...stForm, vencimento: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Usuário</label>
                      <input
                        type="text"
                        value={stForm.usuario}
                        onChange={(e) => setStForm({ ...stForm, usuario: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Senha</label>
                      <input
                        type="password"
                        value={stForm.senha}
                        onChange={(e) => setStForm({ ...stForm, senha: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Link para Download do APK (Ex: MediaFire)</label>
                      <input
                        type="text"
                        value={stForm.apkUrl}
                        onChange={(e) => setStForm({ ...stForm, apkUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100"
                        placeholder="https://mediafire.com/file/..."
                      />
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded font-medium text-sm transition">
                      Cadastrar Serviço
                    </button>
                  </form>
                </div>

                {/* Lista de Streamings */}
                <div className="lg:col-span-8 space-y-3">
                  <h3 className="text-md font-semibold text-slate-300">Serviços Cadastrados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {streamings.map((st) => (
                      <div
                        key={st.id}
                        className={`bg-slate-900 border rounded-xl p-4 flex flex-col justify-between transition ${
                          st.vendido ? "border-red-900/40 opacity-60" : "border-slate-800"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-100">{st.nome}</h4>
                            <span
                              className={`text-xs px-2 py-0.5 rounded font-semibold ${
                                st.vendido
                                  ? "bg-red-950 text-red-400 border border-red-800"
                                  : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              }`}
                            >
                              {st.vendido ? "Vendido" : "Disponível"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">Vencimento: {st.vencimento}</p>
                          <div className="mt-3 bg-slate-950 p-2.5 rounded text-xs space-y-1 border border-slate-800">
                            <p><span className="text-slate-500">Usuário:</span> {st.usuario}</p>
                            <p><span className="text-slate-500">Senha:</span> {st.senha}</p>
                            {st.apkUrl && (
                              <p className="truncate">
                                <span className="text-slate-500">APK:</span>{" "}
                                <a href={st.apkUrl} target="_blank" rel="noreferrer" className="text-emerald-400 underline">
                                  Baixar Arquivo
                                </a>
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => toggleVendido(st.id)}
                          className={`mt-4 py-1.5 rounded text-xs font-semibold transition ${
                            st.vendido
                              ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                              : "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-800/50"
                          }`}
                        >
                          {st.vendido ? "Marcar como Disponível" : "Marcar como Vendido"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {revendaSubTab === "clientes" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form Cadastro Cliente */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 h-fit">
                  <h3 className="text-md font-semibold text-emerald-400 mb-3">Vincular Cliente a Plano</h3>
                  <form onSubmit={addCliente} className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Nome do Cliente</label>
                      <input
                        type="text"
                        value={cliForm.nome}
                        onChange={(e) => setCliForm({ ...cliForm, nome: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Contato (E-mail / WhatsApp)</label>
                      <input
                        type="text"
                        value={cliForm.contato}
                        onChange={(e) => setCliForm({ ...cliForm, contato: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Plano Contratado</label>
                      <input
                        type="text"
                        value={cliForm.plano}
                        onChange={(e) => setCliForm({ ...cliForm, plano: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Validade do Plano</label>
                      <input
                        type="date"
                        value={cliForm.validade}
                        onChange={(e) => setCliForm({ ...cliForm, validade: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100"
                      />
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded font-medium text-sm transition">
                      Cadastrar Cliente
                    </button>
                  </form>
                </div>

                {/* Tabela de Clientes */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-md font-semibold text-slate-300 mb-4">Clientes Ativos</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                        <tr>
                          <th className="p-3">Cliente</th>
                          <th className="p-3">Contato</th>
                          <th className="p-3">Plano</th>
                          <th className="p-3">Validade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {clientes.map((cli) => (
                          <tr key={cli.id} className="hover:bg-slate-800/50">
                            <td className="p-3 font-medium text-slate-100">{cli.nome}</td>
                            <td className="p-3">{cli.contato}</td>
                            <td className="p-3">{cli.plano}</td>
                            <td className="p-3">{cli.validade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}