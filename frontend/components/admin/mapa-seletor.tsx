"use client";

import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Map, MapMarker, MarkerContent, MapControls, useMap } from "@/components/ui/map";

interface MapaSeletorProps {
  boarding_latitude: string;
  boarding_longitude: string;
  drop_off_latitude: string;
  drop_off_longitude: string;
  selectingPoint: "boarding" | "drop_off";
  onSelectCoordinate: (pointType: "boarding" | "drop_off", lat: number, lng: number) => void;
}

// Subcomponente para capturar os cliques no mapa
function MapClickListener({ selectingPoint, onSelectCoordinate }: { 
  selectingPoint: "boarding" | "drop_off";
  onSelectCoordinate: (pointType: "boarding" | "drop_off", lat: number, lng: number) => void;
}) {
  const { map } = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    const handleClick = (e: any) => {
      onSelectCoordinate(selectingPoint, e.lngLat.lat, e.lngLat.lng);
    };
    
    map.on("click", handleClick);
    
    // Adiciona o cursor de pointer para indicar que é clicável
    if (map.getCanvas()) {
      map.getCanvas().style.cursor = "crosshair";
    }
    
    return () => {
      map.off("click", handleClick);
      if (map.getCanvas()) {
        map.getCanvas().style.cursor = "";
      }
    };
  }, [map, selectingPoint, onSelectCoordinate]);

  return null;
}

// Subcomponente de barra de pesquisa
function MapSearchBox({ selectingPoint, onSelectCoordinate }: { 
  selectingPoint: "boarding" | "drop_off";
  onSelectCoordinate: (pointType: "boarding" | "drop_off", lat: number, lng: number) => void;
}) {
  const { map } = useMap();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || !map) return;
    
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`, {
        headers: { "Accept-Language": "pt-BR,pt;q=0.9" }
      });
      const data = await res.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        
        // Move o mapa para o local
        map.flyTo({ center: [lon, lat], zoom: 16 });
        
        // Marca o ponto de interesse automaticamente (estilo Google Maps)
        onSelectCoordinate(selectingPoint, lat, lon);
      } else {
        alert("Local não encontrado. Tente buscar pelo nome da cidade junto ao local.");
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      alert("Erro ao buscar local.");
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-80 z-10">
      <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pesquisar local (Ex: UEFS)"
          className="flex-1 px-4 py-3 text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
        />
        <button 
          type="button" 
          onClick={handleSearch}
          disabled={searching}
          className="p-3 bg-[#103173] text-white hover:bg-[#103B73] transition-colors flex items-center justify-center disabled:opacity-70"
        >
          {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

export default function MapaSeletor({
  boarding_latitude,
  boarding_longitude,
  drop_off_latitude,
  drop_off_longitude,
  selectingPoint,
  onSelectCoordinate
}: MapaSeletorProps) {
  // Centro inicial: Se houver embarque, centra nele. Senão, centra no desembarque. Senão, centra no centro da Bahia (-12.97, -38.50)
  const initialLat = boarding_latitude ? parseFloat(boarding_latitude) : (drop_off_latitude ? parseFloat(drop_off_latitude) : -12.9714);
  const initialLng = boarding_longitude ? parseFloat(boarding_longitude) : (drop_off_longitude ? parseFloat(drop_off_longitude) : -38.5014);

  return (
    <div className="h-full w-full relative">
      <Map
        center={[initialLng, initialLat]}
        zoom={boarding_latitude || drop_off_latitude ? 12 : 6}
        theme="light"
      >
        <MapSearchBox 
          selectingPoint={selectingPoint}
          onSelectCoordinate={onSelectCoordinate}
        />
        
        <MapClickListener 
          selectingPoint={selectingPoint} 
          onSelectCoordinate={onSelectCoordinate} 
        />

        {/* Marcador de Embarque */}
        {boarding_latitude && boarding_longitude && !isNaN(parseFloat(boarding_latitude)) && !isNaN(parseFloat(boarding_longitude)) && (
          <MapMarker 
            latitude={parseFloat(boarding_latitude)} 
            longitude={parseFloat(boarding_longitude)}
          >
            <MarkerContent>
              <div className="w-5 h-5 rounded-full bg-[#0891B2] border-[3px] border-[#103173] shadow-md flex items-center justify-center text-[10px] text-white font-bold">
                E
              </div>
            </MarkerContent>
          </MapMarker>
        )}

        {/* Marcador de Desembarque */}
        {drop_off_latitude && drop_off_longitude && !isNaN(parseFloat(drop_off_latitude)) && !isNaN(parseFloat(drop_off_longitude)) && (
          <MapMarker 
            latitude={parseFloat(drop_off_latitude)} 
            longitude={parseFloat(drop_off_longitude)}
          >
            <MarkerContent>
              <div className="w-5 h-5 rounded-full bg-[#103173] border-[3px] border-[#0891B2] shadow-md flex items-center justify-center text-[10px] text-white font-bold">
                D
              </div>
            </MarkerContent>
          </MapMarker>
        )}

        <MapControls position="bottom-right" showZoom />
      </Map>
    </div>
  );
}
