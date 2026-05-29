import { notificationService } from "@/services/notificationService";

function urlBase64ToUint8Array(base64String: string) {
  // Caso a chave venha em formato HEX (130 caracteres), converte para Uint8Array
  if (/^[0-9a-fA-F]{130}$/.test(base64String)) {
    const bytes = new Uint8Array(base64String.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(base64String.substr(i * 2, 2), 16);
    }
    return bytes;
  }

  // Caso contrário, trata como Base64 URL-safe
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  }
  return null;
}

export async function getSubscription() {
  const registration = await navigator.serviceWorker.ready;
  return await registration.pushManager.getSubscription();
}

export async function subscribeUser() {
  const registration = await navigator.serviceWorker.ready;
  
  const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  
  console.log("VAPID_PUBLIC_KEY configurada:", VAPID_PUBLIC_KEY);

  if (!VAPID_PUBLIC_KEY) {
    throw new Error("VAPID_PUBLIC_KEY não está definida nas variáveis de ambiente");
  }

  // Limpa inscrição existente para evitar conflitos de chave
  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    await existingSubscription.unsubscribe();
  }

  const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
  
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });

    const subJSON = subscription.toJSON();
    
    if (!subJSON.endpoint || !subJSON.keys?.p256dh || !subJSON.keys?.auth) {
      throw new Error("Objeto de inscrição inválido retornado pelo navegador");
    }

    await notificationService.subscribe({
      endpoint: subJSON.endpoint,
      p256dh: subJSON.keys.p256dh,
      auth: subJSON.keys.auth,
    });

    return subscription;
  } catch (err: any) {
    if (err.name === 'NotAllowedError') {
      throw new Error("Permissão de notificação negada pelo usuário");
    }
    throw err;
  }
}

export async function unsubscribeUser() {
  const subscription = await getSubscription();
  if (subscription) {
    await notificationService.unsubscribe(subscription.endpoint);
    await subscription.unsubscribe();
  }
}

export async function checkNotificationPermission() {
  if (!("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return "denied";
  }
  return await Notification.permission;
}
