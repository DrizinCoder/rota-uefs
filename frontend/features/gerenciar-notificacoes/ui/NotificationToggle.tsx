"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff } from "lucide-react";
import {
  registerServiceWorker,
  getSubscription,
  subscribeUser,
  unsubscribeUser,
  checkNotificationPermission
} from "../services/pushManager";
import { toast } from "react-toastify";

export function NotificationToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await registerServiceWorker();
      const subscription = await getSubscription();
      setIsEnabled(!!subscription);
      setIsLoading(false);
    }
    init();
  }, []);

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      if (checked) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          await subscribeUser();
          setIsEnabled(true);
          toast.success("Notificações ativadas com sucesso!");
        } else {
          toast.error("Permissão de notificação negada.");
          setIsEnabled(false);
        }
      } else {
        await unsubscribeUser();
        setIsEnabled(false);
        toast.info("Notificações desativadas.");
      }
    } catch (error: any) {
      console.error("Error toggling notifications:", error);
      const errorMessage = error.message || "Erro desconhecido";
      toast.error(`Erro ao configurar notificações: ${errorMessage}. Verifique se o VAPID_PUBLIC_KEY está configurado corretamente.`);
      setIsEnabled(!checked);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-white/50 p-2 rounded-lg border border-[#103173]/10">
      {isEnabled ? (
        <Bell className="h-4 w-4 text-[#103173]" />
      ) : (
        <BellOff className="h-4 w-4 text-gray-400" />
      )}
      <Switch
        id="notifications-toggle"
        checked={isEnabled}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
    </div>
  );
}
