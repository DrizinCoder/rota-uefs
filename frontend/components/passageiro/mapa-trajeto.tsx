"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Coordenadas {
  lat: number;
  lng: number;
}

interface MapaTrajetoProps {
  coordOrigem: Coordenadas;
  coordDestino: Coordenadas;
  origemLabel?: string;
  destinoLabel?: string;
}

// Ícone customizado para a origem (bolinha amarela)
function criarIconeOrigem() {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 20px; height: 20px;
        background: #F2D022;
        border: 3px solid #103173;
        border-radius: 50%;
        box-shadow: 0 0 8px rgba(242, 208, 34, 0.6);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -14],
  });
}

// Ícone customizado para o destino (bolinha azul)
function criarIconeDestino() {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 20px; height: 20px;
        background: #103173;
        border: 3px solid #F2D022;
        border-radius: 50%;
        box-shadow: 0 0 8px rgba(16, 49, 115, 0.6);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -14],
  });
}

export default function MapaTrajeto({
  coordOrigem,
  coordDestino,
  origemLabel = "Origem",
  destinoLabel = "Destino",
}: MapaTrajetoProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Calcula o centro entre os dois pontos
    const centerLat = (coordOrigem.lat + coordDestino.lat) / 2;
    const centerLng = (coordOrigem.lng + coordDestino.lng) / 2;

    // Cria o mapa
    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 10,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: true,
    });

    // Tiles do OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Controle de zoom no canto inferior direito
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Attribution pequena no canto inferior esquerdo
    L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);

    // Marcador de origem
    L.marker([coordOrigem.lat, coordOrigem.lng], { icon: criarIconeOrigem() })
      .bindPopup(`<strong>${origemLabel}</strong>`)
      .addTo(map);

    // Marcador de destino
    L.marker([coordDestino.lat, coordDestino.lng], { icon: criarIconeDestino() })
      .bindPopup(`<strong>${destinoLabel}</strong>`)
      .addTo(map);

    // Linha tracejada conectando origem e destino
    L.polyline(
      [
        [coordOrigem.lat, coordOrigem.lng],
        [coordDestino.lat, coordDestino.lng],
      ],
      {
        color: "#103173",
        weight: 3,
        dashArray: "8, 8",
        opacity: 0.7,
      }
    ).addTo(map);

    // Ajustar o zoom para caber os dois pontos
    const bounds = L.latLngBounds(
      [coordOrigem.lat, coordOrigem.lng],
      [coordDestino.lat, coordDestino.lng]
    );
    map.fitBounds(bounds, { padding: [40, 40] });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [coordOrigem, coordDestino, origemLabel, destinoLabel]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100%", borderRadius: "inherit" }}
    />
  );
}
