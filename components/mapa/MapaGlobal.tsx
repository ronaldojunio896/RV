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
  foto?: string;
}

interface MapaGlobalProps {
  investigados: PessoalData[];
  mapsLoaded: boolean;
}

export default function MapaGlobal({ investigados, mapsLoaded }: MapaGlobalProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current && mapsLoaded && window.google && window.google.maps) {
      // Posição padrão (Belo Horizonte)
      const defaultCenter = { lat: -19.9322, lng: -43.9317 };

      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
        gestureHandling: "greedy",
        styles: [
          { elementType: "geometry", stylers: [{ color: "#1e293b" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#334155" }] }
        ],
      });

      const bounds = new window.google.maps.LatLngBounds();
      let hasValidCoords = false;

      investigados.forEach(inv => {
        const latNum = Number(inv.lat);
        const lngNum = Number(inv.lng);

        if (latNum && lngNum && !isNaN(latNum) && !isNaN(lngNum)) {
          hasValidCoords = true;
          const pos = { lat: latNum, lng: lngNum };
          bounds.extend(pos);

          const marker = new window.google.maps.Marker({
            position: pos,
            map: map,
            title: inv.nome,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="color: #0f172a; font-family: sans-serif; font-size: 12px; padding: 6px; max-width: 200px;">
                ${inv.foto ? `<img src="${inv.foto}" style="width:100%; height:80px; object-fit:cover; border-radius:6px; margin-bottom:6px;"/>` : ""}
                <strong style="font-size: 14px; color: #0284c7;">${inv.nome}</strong><br/>
                <span style="color: #475569;">${inv.endereco || "Endereço não informado"}</span><br/>
                <small style="color: #059669; font-weight: bold;">Contato: ${inv.contato || "N/A"}</small>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        }
      });

      if (hasValidCoords) {
        map.fitBounds(bounds);
      }
    }
  }, [mapsLoaded, investigados]);

  const validos = investigados.filter(i => i.lat && i.lng && !isNaN(Number(i.lat)) && !isNaN(Number(i.lng))).length;

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-bold text-slate-100 flex items-center gap-2">
          <MapPin className="text-emerald-400" size={18} /> Rastreamento e Mapeamento Global
        </h3>
        <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
          Pontos no Mapa: <strong className="text-emerald-400">{validos}</strong> de {investigados.length} investigados
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