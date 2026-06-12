"use client";

import { useEffect, useState } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MapRoute,
  MapControls,
} from "@/components/ui/map";

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

export default function MapaTrajeto({
  coordOrigem,
  coordDestino,
  origemLabel = "Origem",
  destinoLabel = "Destino",
}: MapaTrajetoProps) {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    []
  );
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);

  // Calcula centro entre os dois pontos
  const centerLng = (coordOrigem.lng + coordDestino.lng) / 2;
  const centerLat = (coordOrigem.lat + coordDestino.lat) / 2;

  // Busca a rota real pelo OSRM (gratuito, sem API key)
  useEffect(() => {
    async function fetchRoute() {
      setIsLoadingRoute(true);
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordOrigem.lng},${coordOrigem.lat};${coordDestino.lng},${coordDestino.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.routes?.length > 0) {
          setRouteCoordinates(data.routes[0].geometry.coordinates);
        }
      } catch (error) {
        console.error("Erro ao buscar rota OSRM:", error);
        // Fallback: linha reta entre os dois pontos
        setRouteCoordinates([
          [coordOrigem.lng, coordOrigem.lat],
          [coordDestino.lng, coordDestino.lat],
        ]);
      } finally {
        setIsLoadingRoute(false);
      }
    }

    fetchRoute();
  }, [coordOrigem.lng, coordOrigem.lat, coordDestino.lng, coordDestino.lat]);

  return (
    <div className="h-full w-full">
      <Map
        center={[centerLng, centerLat]}
        zoom={9}
        theme="light"
        loading={isLoadingRoute}
      >
        {/* Rota tracejada */}
        {routeCoordinates.length > 0 && (
          <MapRoute
            coordinates={routeCoordinates}
            color="#103173"
            width={4}
            opacity={0.8}
            dashArray={[6, 4]}
            interactive={false}
          />
        )}

        {/* Marcador de Origem */}
        <MapMarker longitude={coordOrigem.lng} latitude={coordOrigem.lat}>
          <MarkerContent>
            <div className="relative">
              <div className="w-5 h-5 rounded-full bg-[#F2D022] border-[3px] border-[#103173] shadow-[0_0_10px_rgba(242,208,34,0.6)]" />
              <div className="absolute inset-0 w-5 h-5 rounded-full bg-[#F2D022]/40 animate-ping" />
            </div>
          </MarkerContent>
          <MarkerLabel position="bottom" className="text-[#103173] font-bold text-[11px] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
            {origemLabel}
          </MarkerLabel>
        </MapMarker>

        {/* Marcador de Destino */}
        <MapMarker longitude={coordDestino.lng} latitude={coordDestino.lat}>
          <MarkerContent>
            <div className="w-5 h-5 rounded-full bg-[#103173] border-[3px] border-[#F2D022] shadow-[0_0_10px_rgba(16,49,115,0.6)]" />
          </MarkerContent>
          <MarkerLabel position="bottom" className="text-[#103173] font-bold text-[11px] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
            {destinoLabel}
          </MarkerLabel>
        </MapMarker>

        {/* Controles do mapa */}
        <MapControls position="bottom-right" showZoom />
      </Map>
    </div>
  );
}
