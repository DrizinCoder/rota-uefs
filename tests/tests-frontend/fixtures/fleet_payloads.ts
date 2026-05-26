// @ts-nocheck

export interface BusFormValues {
  plate: string;
  capacity: string;
  status: string;
}

export interface TripFormValues {
  routeId: string;
  busPlate: string;
  driverId: string;
  tripDate: string;
  departureTime: string;
  recurrence: string;
  tripType: 'ida' | 'ida_volta';
}

export interface RouteOption {
  name: string;
  route_id: string;
  boarding_point: string;
  drop_off_point: string;
}

export interface DriverOption {
  user_id: string;
  full_name: string;
  registration_id: string;
  phone: string;
  email: string;
  registration_status: string;
}

export interface BusOption {
  bus_plate: string;
  capacity: number;
  bus_status: string;
}

export const ADMIN_TEST_TOKEN = 'playwright-admin-token';

export const BUS_SUCCESS_VALUES: BusFormValues = {
  plate: 'ABC-1234',
  capacity: '44',
  status: 'Active',
};

export const BUS_DUPLICATE_VALUES: BusFormValues = {
  plate: 'ABC-1234',
  capacity: '44',
  status: 'Active',
};

export const BUS_CREATED_RESPONSE = {
  data: {
    bus_plate: BUS_SUCCESS_VALUES.plate,
    capacity: Number(BUS_SUCCESS_VALUES.capacity),
    bus_status: BUS_SUCCESS_VALUES.status,
  },
};

export const BUS_DUPLICATE_ERROR_RESPONSE = {
  message: 'Placa já cadastrada',
};

export const ROUTE_SUCCESS_VALUES: TripFormValues = {
  routeId: 'route-salvador-feira',
  busPlate: 'ABC-1234',
  driverId: 'driver-carlos-silva',
  tripDate: '2026-05-20',
  departureTime: '06:00',
  recurrence: 'Single',
  tripType: 'ida',
};

export const ROUTE_FAILURE_VALUES: TripFormValues = {
  routeId: 'route-salvador-feira',
  busPlate: 'ABC-1234',
  driverId: 'driver-carlos-silva',
  tripDate: '2026-05-20',
  departureTime: '06:00',
  recurrence: 'Single',
  tripType: 'ida',
};

export const ROUTE_CREATED_RESPONSE = {
  data: {
    trip_id: 'trip-001',
  },
};

export const TRIP_INVALID_SCHEDULE_ERROR_RESPONSE = {
  message: 'Horário inválido',
};

export const ADMIN_HOME_RESPONSE = {
  data: {
    summary: {
      total_buses: 1,
      active_buses: 1,
      total_trips_today: 0,
    },
    buses: [
      {
        plate: BUS_SUCCESS_VALUES.plate,
        capacity: Number(BUS_SUCCESS_VALUES.capacity),
        status: BUS_SUCCESS_VALUES.status,
        trips_today: 0,
      },
    ],
  },
};

export const DRIVER_OPTIONS: DriverOption[] = [
  {
    user_id: 'driver-carlos-silva',
    full_name: 'Carlos Silva',
    registration_id: '20240001',
    phone: '(75) 99999-0001',
    email: 'carlos.silva@uefs.br',
    registration_status: 'Active',
  },
];

export const ROUTE_OPTIONS: RouteOption[] = [
  {
    name: 'Salvador para Feira de Santana',
    route_id: 'route-salvador-feira',
    boarding_point: 'Terminal Rodoviário de Salvador',
    drop_off_point: 'Campus UEFS',
  },
];

export const BUS_OPTIONS: BusOption[] = [
  {
    bus_plate: BUS_SUCCESS_VALUES.plate,
    capacity: Number(BUS_SUCCESS_VALUES.capacity),
    bus_status: BUS_SUCCESS_VALUES.status,
  },
];