import { api } from "./api";

export interface CardViagemFeed {
  trip_id: string;
  weekday: string;
  boarding_point: string;
  drop_off_point: string;
  departure_time: string;
  student_count: number;
  staff_count: number;
  bus_capacity: number;
  total_enrolled: number;
  status?: string;
  /** Quando o backend enviar, indica se o usuário já está inscrito nesta viagem */
  jaInscrito?: boolean;
}

export interface Home {
  reference_date: string;
  reference_weekday: string;
  start_date: string;
  end_date: string;
  trips: CardViagemFeed[];
}

export interface Reservation {
  reservation_id: string;
  boarding_confirmation: string;
  extra_passenger_name: string | null;
  boarding_timestamp: string | null;
}

export interface UserTrip {
  trip_id: string;
  trip_date: string;
  departure_time: string;
  status: string;
  boarding_point: string;
  drop_off_point: string;
  reservations: Reservation[];
}

export const passengerService = {
    async getHome(): Promise<Home> {
        const response = await api.get('/trip/feed');
        return response.data.data;
    },
    async getTripById(tripId: string) {
        const response = await api.get(`/trip/${tripId}`);
        return response.data.data;
    },
    async getRouteById(routeId: string) {
        const response = await api.get(`/routes/routes/${routeId}`);
        return response.data.data;
    },
    async subscribeUser(tripId: string, extraPassengerName?: string | null) {
        const response = await api.post(`/users/trip/${tripId}/subscribe`, {
            extra_passenger_name: extraPassengerName || null
        });
        return response.data;
    },
    async getUserTrips(userId: string): Promise<UserTrip[]> {
        const response = await api.get(`/trip/me/${userId}`);
        return response.data.data;
    },
    async cancelSubscription(reservationId: string) {
        const response = await api.delete(`/users/driver/reservations/${reservationId}/delete-staff-generic`);
        return response.data;
    },
}