export const MOCK_DRIVER_PASSENGER_LIST_PAYLOAD = (onboardStatus: boolean = false) => ({
  data: {
    valid_reservations: [
      {
        reservation_id: 'res-123',
        user_id: 'student-123',
        name: 'Student Name',
        profile: 'Student',
        is_invited: false,
        onboard: onboardStatus,
        timestamp: '2025-10-06T08:00:00Z'
      }
    ],
    waitlist_reservations: [],
    route_name: 'Rota Principal',
    trip_id: 'trip-123',
    boarding_point: 'Terminal Central',
    drop_off_point: 'UEFS',
    stats: {
      capacity: 40,
      total_reservations: 1,
      total_onboarded: onboardStatus ? 1 : 0,
      waitlist_count: 0
    }
  }
});
