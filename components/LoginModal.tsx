"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock } from "lucide-react";

interface LoginProps {
  onLoginSuccess: () => void;
  addToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function LoginModal({ onLoginSuccess, addToast }: LoginProps) {
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser === "admin" && loginPass === "4222") {
      localStorage.setItem("painel_auth", "true");
      setLoginError("");
      addToast("Acesso autorizado! Bem-vindo.", "success");
      onLoginSuccess();
    } else {
      setLoginError("Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="w-full max-w-md p-8 space-y-6 border border-slate-800 bg-slate-900/80 rounded-xl shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-emerald-600/10 border border-emerald-500/20 p-3 rounded-2xl text-emerald-400 mb-2">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Acesso ao Painel</h1>
          <p className="text-xs text-slate-400">Insira suas credenciais para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Usuário</label>
            <input
              type="text"
              value={loginUser}
              onChange={e => setLoginUser(e.target.value)}
              placeholder="Digite o usuário"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Senha</label>
            <input
              type="password"
              value={loginPass}
              onChange={e => setLoginPass(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          {loginError && (
            <p className="text-xs text-rose-400 text-center font-medium bg-rose-950/40 p-2 rounded border border-rose-800/50">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition shadow-lg shadow-emerald-900/20 flex items-center justify-center cursor-pointer text-sm"
          >
            <Lock size={16} className="mr-2" /> Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}