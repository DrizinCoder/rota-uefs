import api from './api';

export interface PushSubscriptionDTO {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export const notificationService = {
  subscribe: async (subscription: PushSubscriptionDTO) => {
    const response = await api.post('/web-push/subscribe', subscription);
    return response.data;
  },

  unsubscribe: async (endpoint: string) => {
    const response = await api.delete('/web-push/unsubscribe', {
      data: { endpoint }
    });
    return response.data;
  }
};
