"use client";

import React, { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

interface PessoalData {
  id?: number;
  nome: string;
  endereco: string;
  lat?: number;
  lng?: number;
  contato: string;
}

interface MapaGlobalProps {
  investigados: PessoalData[];
  mapsLoaded: boolean;
}

export default function MapaGlobal({ investigados, mapsLoaded }: MapaGlobalProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current && mapsLoaded && window.google) {
      const defaultCenter = { lat: -19.9322, lng: -43.9317 };
      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 5,
        gestureHandling: "greedy",
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
  }, [mapsLoaded, investigados]);

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-bold text-slate-100 flex items-center gap-2">
          <MapPin className="text-emerald-400" size={18} /> Rastreamento e Mapeamento Global
        </h3>
        <span className="text-xs text-slate-400">
          Pontos no Mapa: {investigados.filter(i => i.lat && i.lng).length}
        </span>
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
    </div>
  );
}