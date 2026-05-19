import { api } from "./api";

export interface Reservation {
    reservation_id: string;
    user_id: string;
    name: string;
    profile: string;
    is_invited: boolean;
    onboard: boolean;
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
    async adicionarAvulso(trip_id: string) {
        const response = await api.post(`/users/driver/trips/${trip_id}/subscribe-staff-generic`);
        return { success: response.status >= 200 && response.status < 300 };
    },
    async removerAvulso(reservation_id: string) {
        const response = await api.delete(`/users/driver/reservations/${reservation_id}/delete-staff-generic`);
        return { success: response.status >= 200 && response.status < 300 };
    },
    async embarcar(user_id: string, reservation_id: string, trip_id: string) {
        const response = await api.post(`/checkin/manual`, {
            user_id,
            reservation_id,
            trip_id
        });
        return { success: response.status >= 200 && response.status < 300 };
    }
}
