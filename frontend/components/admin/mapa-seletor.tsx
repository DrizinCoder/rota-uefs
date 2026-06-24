"use client";

import { useEffect } from "react";
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
