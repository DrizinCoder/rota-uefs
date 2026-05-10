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
}

export interface Home {
  reference_date: string;
  reference_weekday: string;
  start_date: string;
  end_date: string;
  trips: CardViagemFeed[];
}

export const passengerService = {
    async getHome(): Promise<Home> {
        const response = await api.get('/trip/feed/trips');
        return response.data.data;
    },
    async getTripById(tripId: string) {
        const response = await api.get(`/trip/${tripId}`);
        console.log(response.data.data)
        return response.data.data;
    },
    async getRouteById(routeId: string) {
        const response = await api.get(`/routes/routes/${routeId}`);
        return response.data.data;
    },
}
    