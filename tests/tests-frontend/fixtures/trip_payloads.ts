export interface TripPayload {
  id: string;
  route_name: string;
  departure_time: string;
  status: 'scheduled' | 'in_progress' | 'finished';
}

export const TRIP_SAMPLE: TripPayload = {
  id: 'trip-001',
  route_name: 'Feira de Santana -> Salvador',
  departure_time: '06:00',
  status: 'scheduled',
};
