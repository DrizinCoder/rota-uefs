export const MOCK_TRIP_FEED_PAYLOAD = {
  data: {
    reference_weekday: 'Segunda',
    start_date: '2025-10-06',
    end_date: '2025-10-10',
    trips: [
      {
        trip_id: 'trip-123',
        route_id: 'route-1',
        weekday: 'Segunda',
        departure_time: '08:00:00',
        boarding_point: 'Terminal Central',
        drop_off_point: 'UEFS',
        bus_capacity: 40,
        student_count: 5,
        staff_count: 2,
        total_enrolled: 7,
        bus_license_plate: 'ABC-1234'
      }
    ]
  }
};

export const MOCK_TRIP_DETAILS_PAYLOAD = {
  data: {
    trip_id: 'trip-123',
    route_id: 'route-1',
    boarding_point: 'Terminal Central',
    drop_off_point: 'UEFS',
    departure_time: '08:00:00',
    trip_date: '2025-10-06',
    total_enrolled: 7,
    student_count: 5,
    staff_count: 2,
    placa: 'ABC-1234'
  }
};

export const MOCK_ROUTE_PAYLOAD = {
  data: {
    route_id: 'route-1',
    boarding_point: 'Terminal Central',
    drop_off_point: 'UEFS',
    name: 'Rota Principal'
  }
};

export const MOCK_TRIP_ME_EMPTY_PAYLOAD = {
  data: []
};

export const MOCK_TRIP_ME_SUBSCRIBED_PAYLOAD = {
  data: [
    {
      trip_id: 'trip-123',
      trip_date: '2025-10-06',
      departure_time: '08:00:00',
      status: 'Pending',
      boarding_point: 'Terminal Central',
      drop_off_point: 'UEFS',
      reservations: [
        {
          reservation_id: 'res-123',
          boarding_confirmation: 'Pending',
          extra_passenger_name: null,
          boarding_timestamp: null
        }
      ]
    }
  ]
};

export const MOCK_SUBSCRIBED_TRIP_FEED_PAYLOAD = {
  data: {
    reference_weekday: 'Segunda',
    start_date: '2025-10-06',
    end_date: '2025-10-10',
    trips: [
      {
        trip_id: 'trip-123',
        route_id: 'route-1',
        weekday: 'Segunda',
        departure_time: '08:00:00',
        boarding_point: 'Terminal Central',
        drop_off_point: 'UEFS',
        bus_capacity: 40,
        student_count: 6,
        staff_count: 2,
        total_enrolled: 8,
        bus_license_plate: 'ABC-1234',
        user_is_subscribed: true
      }
    ]
  }
};
