"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Scan, ClipboardList, Loader2 } from "lucide-react";
import { driverService } from "@/services/driverService";
import jsQR from "jsqr";

function EmbarqueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("trip_id");
  const tripLabel = tripId ?? "ROT-0042";

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [routeName, setRouteName] = useState<string | null>(null);
  const [screenLoading, setScreenLoading] = useState(true);
  const [error404, setError404] = useState(false);

  // Área de QrCode
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const requestRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessing = useRef(false);

  const irParaPassageiros = () => {
    const qs = tripId ? `?trip_id=${encodeURIComponent(tripId)}` : "";
    router.push(`/motorista/passageiros${qs}`);
  };

  // Função pra lidar com o QR Code
  const handleQRScanned = async (qrData: string) => {
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoading(true);
    setFeedback(null);

    try {
      const response = await driverService.embarcarQrcode(qrData, tripId!);

      if (response.success) {
        setFeedback({
          type: "success",
          message: "Passageiro Embarcado",
        });
        
        // Espera 2 segundos, aí reseta pra escanear de novo
        timeoutRef.current = setTimeout(() => {
          setScannedData(null);
          setIsScanning(true);
          setFeedback(null);
          timeoutRef.current = null; // Limpa a ref depois
          isProcessing.current = false;
        }, 2000);
      }
    } catch (err: any) {
      // Agora SIM trata os erros
      if (err.response?.status === 403) {
        setFeedback({
          type: "error",
          message: "Passageiro Já Embarcou",
        });
      } else if (err.response?.status === 400) {
        setFeedback({
          type: "error",
          message: "QR Code Inválido",
        });
      } else {
        setFeedback({
          type: "error",
          message: "Erro ao embarcar",
        });
      }

      // Reseta após 2 segundos
      timeoutRef.current = setTimeout(() => {
        setScannedData(null);
        setIsScanning(true);
        setFeedback(null);
        timeoutRef.current = null; // Limpa a ref depois
        isProcessing.current = false;
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  // UseEffect para carregar o nome da rota
  useEffect(() => {
    if (!tripId) {
      setError404(true);
      setScreenLoading(false);
      return;
    }

    const loadRouteInfo = async () => {
      try {
        setScreenLoading(true);
        setError404(false);
        const data = await driverService.getRouteName(tripId);
        
        if (!data || data.length === 0) {
          setError404(true);
        } else {
          setRouteName(data[0].route_name);
        }
      } catch (err: any) {
        console.warn("Erro ao obter nome da rota:", err);
        setError404(true);
      } finally {
        setScreenLoading(false);
      }
    };

    loadRouteInfo();
  }, [tripId]);

  // UseEffect pra pedir permissão da Câmera e conectar com videoRef
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsScanning(true);
        }
      } catch (err) {
        console.error("Erro ao acessar câmera:", err);
        setIsScanning(false);
      }
    };

    startCamera();

    return () => {
      // Parar TODAS as tracks de vídeo
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      // Garante que zera
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;

    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Verifica se o vídeo tá pronto
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        requestRef.current = requestAnimationFrame(processFrame);
        return;
      }

      // Pega o contexto do canvas (pra desenhar)
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Desenha o frame atual do vídeo no canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      // Extrai os pixels do canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Processa com jsQR
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      // Se encontrou QR code
      if (code && !isProcessing.current) {
        setScannedData(code.data);
        setIsScanning(false);
        isProcessing.current = true;
        handleQRScanned(code.data);
      }

      // Loop: processa o próximo frame
      requestRef.current = requestAnimationFrame(processFrame);
    };

    // Inicia o loop
    requestRef.current = requestAnimationFrame(processFrame);

    // Cleanup: para o loop quando sai
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isScanning]);

  if (screenLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#E4F2F1] items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-[#103173] animate-spin" />
          <p className="text-[#103173] font-bold text-lg">Carregando dados da rota...</p>
        </div>
      </div>
    );
  }

  if (error404) {
    return (
      <div className="flex min-h-screen flex-col bg-[#E4F2F1] items-center justify-center p-4">
        <button
          onClick={() => router.back()}
          className="absolute top-8 left-6 flex items-center gap-2 bg-white py-2 px-4 rounded-full shadow-md text-[#103173] font-black uppercase text-sm hover:opacity-70 transition-all z-10"
        >
          <ArrowLeft className="h-5 w-5" /> Voltar
        </button>

        <Card className="w-full max-w-md border-none shadow-2xl bg-white overflow-hidden rounded-[40px] text-center p-10 flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
            <span className="text-3xl font-black text-red-600">404</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#103173] uppercase tracking-tight mb-2">
              Página Não Encontrada
            </h2>
            <p className="text-slate-500 font-medium text-sm sm:text-base px-2">
              A viagem solicitada não foi encontrada ou a rota é inválida. Por favor, verifique os dados e tente novamente.
            </p>
          </div>
          <Button
            onClick={() => router.push("/motorista")}
            className="w-full h-14 rounded-2xl font-black transition-all shadow-lg bg-[#103173] hover:bg-[#0b2251] text-white active:scale-95 uppercase"
          >
            Voltar para o Início
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#E4F2F1] items-center justify-center p-4">
      <button
        onClick={() => router.back()}
        className="absolute top-8 left-6 flex items-center gap-2 bg-white py-2 px-4 rounded-full shadow-md text-[#103173] font-black uppercase text-sm hover:opacity-70 transition-all z-10"
      >
        <ArrowLeft className="h-5 w-5" /> Voltar
      </button>

      <Card className="w-full max-w-md border-none shadow-2xl bg-white overflow-hidden rounded-[40px] mt-12 sm:mt-0">
        <CardHeader className="bg-[#103173] text-white text-center py-10">
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">
            Embarque
          </CardTitle>
          <div className="mt-2 flex flex-col items-center space-y-2">
            <p className="text-[#F2D022] text-sm font-black tracking-widest uppercase">
              {routeName}
            </p>
            <p className="text-[#73AABF] text-sm sm:text-base font-bold uppercase tracking-wider px-4">
              Aponte a câmera para o QR Code do passageiro
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center p-8">
          <div className="relative mb-8 group">
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-[#F2D022] rounded-tl-lg" />
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-[#F2D022] rounded-tr-lg" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-[#F2D022] rounded-bl-lg" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-[#F2D022] rounded-br-lg" />

          <div className="bg-slate-900 w-64 h-64 flex flex-col items-center justify-center rounded-3xl overflow-hidden relative shadow-inner">
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Vídeo da câmera*/}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover rounded-3xl"
            />

            {/* Conteúdo que aparece por cima da câmera */}
            {!isScanning && !scannedData ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-3xl">
                <Scan className="h-20 w-20 text-white/20" />
                <p className="text-white/40 text-[10px] font-bold mt-4 uppercase tracking-widest">
                  Aceite a Permissão à câmera.
                </p>
              </div>
            ) : null}
          </div>
        </div>
        {feedback && (
            <div
              className={`mb-4 p-4 rounded-lg text-center text-sm font-bold w-full ${
                feedback.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <div className="w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[10px] font-black text-[#73AABF] uppercase tracking-widest">
                Ou faça o check-in manual
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <Button
              onClick={irParaPassageiros}
              className="w-full h-14 rounded-2xl font-black transition-all shadow-lg bg-[#23B99A] hover:bg-[#1d9e83] text-white active:scale-95"
            >
              <ClipboardList className="mr-2 h-5 w-5" /> ACESSAR LISTA DE PASSAGEIROS
            </Button>
          </div>

          <p className="pt-8 text-xs text-[#73AABF] font-bold leading-relaxed text-center max-w-[280px] mx-auto">
            Problemas na leitura da câmera? Utilize o botão acima para validar pela lista.
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 flex items-center gap-2 opacity-40">
        <div className="h-1 w-1 bg-[#103173] rounded-full" />
        <p className="text-[#103173] font-black text-[10px] uppercase tracking-widest text-center">
          SIT - Sistema Interno de Transporte
        </p>
        <div className="h-1 w-1 bg-[#103173] rounded-full" />
      </div>
    </div>
  );
}

export function MotoristaEmbarqueScreen() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#E4F2F1] font-bold text-[#103173]">
          Carregando embarque...
        </div>
      }
    >
      <EmbarqueContent />
    </Suspense>
  );
}
