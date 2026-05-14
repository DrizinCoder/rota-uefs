import { api } from "./api";

export interface Reservation {
    reservation_id: string;
    user_id: string;
    name: string;
    profile: string;
    is_invited: boolean;
    timestamp: string;
}

export interface Stats {
    capacity: number;
    total_reservations: number;
    waitlist_count: number;
}

export interface PassengerListResponse {
    valid_reservations: Reservation[];
    waitlist_reservations: Reservation[];
    route_name: string;
    trip_id: string;
    boarding_point: string;
    drop_off_point: string;
    stats: Stats;
}

export const driverService = {
    async listarPassageiros(trip_id: string): Promise<PassengerListResponse> {
        const response = await api.get(`/users/trip/${trip_id}/subscribers`);
        return response.data.data;
    },
}