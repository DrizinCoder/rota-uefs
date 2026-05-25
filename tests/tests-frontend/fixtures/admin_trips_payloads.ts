// @ts-nocheck

export interface RouteFormValues {
  name: string;
  boardingPoint: string;
  dropOffPoint: string;
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

export const ADMIN_TRIPS_TEST_TOKEN = 'playwright-admin-trips-token';

export const DEFAULT_ROUTE_OPTION: RouteOption = {
  name: 'Salvador para Feira de Santana',
  route_id: 'route-salvador-feira',
  boarding_point: 'Terminal Rodoviário de Salvador',
  drop_off_point: 'Campus UEFS',
};

export const CREATED_ROUTE_FORM_VALUES: RouteFormValues = {
  name: 'Feira de Santana para Salvador',
  boardingPoint: 'Campus UEFS',
  dropOffPoint: 'Terminal Rodoviário de Salvador',
};

export const CREATED_ROUTE_OPTION: RouteOption = {
  name: CREATED_ROUTE_FORM_VALUES.name,
  route_id: 'route-feira-salvador',
  boarding_point: CREATED_ROUTE_FORM_VALUES.boardingPoint,
  drop_off_point: CREATED_ROUTE_FORM_VALUES.dropOffPoint,
};

export const ROUTE_CREATE_SUCCESS_RESPONSE = {
  data: CREATED_ROUTE_OPTION,
};

export const ROUTE_CREATE_FAILURE_RESPONSE = {
  detail: 'Rota já registrada',
  message: 'Rota já registrada',
};

export const ROUTE_OPTIONS_FOR_TRIP: RouteOption[] = [
  DEFAULT_ROUTE_OPTION,
  CREATED_ROUTE_OPTION,
];

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

export const BUS_OPTIONS: BusOption[] = [
  {
    bus_plate: 'ABC-1234',
    capacity: 44,
    bus_status: 'Active',
  },
];

export const TRIP_SUCCESS_VALUES: TripFormValues = {
  routeId: DEFAULT_ROUTE_OPTION.route_id,
  busPlate: BUS_OPTIONS[0].bus_plate,
  driverId: DRIVER_OPTIONS[0].user_id,
  tripDate: '2026-05-20',
  departureTime: '06:00',
  recurrence: 'Single',
  tripType: 'ida',
};

export const TRIP_FAILURE_VALUES: TripFormValues = {
  routeId: DEFAULT_ROUTE_OPTION.route_id,
  busPlate: BUS_OPTIONS[0].bus_plate,
  driverId: DRIVER_OPTIONS[0].user_id,
  tripDate: '2026-05-20',
  departureTime: '06:00',
  recurrence: 'Single',
  tripType: 'ida',
};

export const TRIP_CREATE_SUCCESS_RESPONSE = {
  data: {
    trip_id: 'trip-001',
    bus_license_plate: TRIP_SUCCESS_VALUES.busPlate,
    driver_id: TRIP_SUCCESS_VALUES.driverId,
    route_id: TRIP_SUCCESS_VALUES.routeId,
    trip_date: TRIP_SUCCESS_VALUES.tripDate,
    departure_time: '06:00:00',
    status: 'Pending',
  },
};

export const TRIP_CREATE_FAILURE_RESPONSE = {
  message: 'Ônibus indisponível no momento',
  detail: 'Ônibus indisponível no momento',
};