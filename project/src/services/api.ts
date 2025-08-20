// src/services/api.ts
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'accountant' | 'dispatcher' | 'driver' | 'customer';
    phone: string;
    createdAt: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'admin' | 'accountant' | 'dispatcher' | 'driver' | 'customer';
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'admin' | 'accountant' | 'dispatcher' | 'driver' | 'customer';
  createdAt: string;
}

interface RawUser {
  id?: string;
  _id?: string;
  email: string;
  name: string;
  phone: string;
  role: User['role'];
  createdAt?: string | Date;
}

// Company types (reuse existing front-end Company but define raw)
export interface CompanyDTO {
  id: string;
  name: string;
  gst: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  outstandingAmount: number;
  createdAt: string;
}

interface RawCompany {
  _id?: string; id?: string; name: string; gst: string; address: string; contactPerson: string; phone: string; email: string; outstandingAmount?: number; createdAt?: string | Date;
}

interface RawBooking { _id?: string; id?: string; companyId?: string; pickupLocation: string; dropLocation: string; startDate: string; endDate: string; status: string; totalAmount: number; expenses?: { amount: number }[]; }
interface RawPayment { _id?: string; id?: string; amount: number; type: string; date: string; description?: string; entityType: string; entityId: string; }
interface CompanyOverviewResponse { company: RawCompany; metrics: { bookings: number; revenue: number; expenses: number; completed: number; outstanding: number }; bookings: RawBooking[]; payments: RawPayment[] }

// Vehicle raw types
interface RawVehicle { _id?: string; id?: string; registrationNumber: string; category: 'SUV'|'sedan'|'bus'|'mini-bus'; owner: 'owned'|'rented'; insuranceExpiry: string|Date; fitnessExpiry: string|Date; permitExpiry: string|Date; pollutionExpiry: string|Date; status: 'active'|'maintenance'|'inactive'; mileageTrips?: number; mileageKm?: number; createdAt?: string|Date; }
export interface VehicleDTO { id: string; registrationNumber: string; category: 'SUV'|'sedan'|'bus'|'mini-bus'; owner: 'owned'|'rented'; insuranceExpiry: string; fitnessExpiry: string; permitExpiry: string; pollutionExpiry: string; status: 'active'|'maintenance'|'inactive'; mileageTrips?: number; mileageKm?: number; createdAt: string; }

// Driver raw & DTO types
interface RawAdvance { amount: number; date: string|Date; settled?: boolean; description?: string; id?: string; _id?: string; }
interface RawDriver { _id?: string; id?: string; name: string; phone: string; licenseNumber: string; aadhaar: string; vehicleType: 'owned'|'rented'; licenseExpiry: string|Date; policeVerificationExpiry: string|Date; paymentMode: 'per-trip'|'daily'|'monthly'|'fuel-basis'; salary: number; advances?: RawAdvance[]; status: 'active'|'inactive'; createdAt?: string|Date; }
export interface DriverDTO { id: string; name: string; phone: string; licenseNumber: string; aadhaar: string; vehicleType: 'owned'|'rented'; licenseExpiry: string; policeVerificationExpiry: string; paymentMode: 'per-trip'|'daily'|'monthly'|'fuel-basis'; salary: number; advances: { id: string; amount: number; date: string; settled: boolean; description: string }[]; status: 'active'|'inactive'; createdAt: string; }

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Auth API functions
export const authAPI = {
  // Internal helper to normalize mongoose docs
  _normalize(raw: RawUser): User {
    return {
      id: raw.id || raw._id || '',
      email: raw.email,
      name: raw.name,
      phone: raw.phone,
      role: raw.role,
  createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date(raw.createdAt || Date.now()).toISOString(),
    };
  },
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<User> => {
  const response = await api.post('/auth/register', userData);
  return authAPI._normalize(response.data);
  },

  getUsers: async (page = 1, limit = 10): Promise<{ users: User[]; total: number }> => {
  const response = await api.get(`/auth/users?page=${page}&limit=${limit}`);
  const data = response.data as { users: RawUser[]; total: number };
  return { users: data.users.map(u => authAPI._normalize(u)), total: data.total };
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/auth/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
  const response = await api.put(`/auth/users/${id}`, updates);
  return authAPI._normalize(response.data);
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/auth/users/${id}`);
  },
};

// Company API
export const companyAPI = {
  _normalize(raw: RawCompany): CompanyDTO {
    return {
      id: raw.id || raw._id || '',
      name: raw.name,
      gst: raw.gst,
      address: raw.address,
      contactPerson: raw.contactPerson,
      phone: raw.phone,
      email: raw.email,
      outstandingAmount: raw.outstandingAmount ?? 0,
      createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date(raw.createdAt || Date.now()).toISOString(),
    };
  },
  list: async () : Promise<CompanyDTO[]> => {
    const res = await api.get('/companies');
    // backend returns { companies, total } or maybe just array? examine service: getCompanies returns { companies, total }
    const data = res.data as { companies: RawCompany[]; total: number } | RawCompany[];
    if (Array.isArray(data)) return data.map(companyAPI._normalize);
    return data.companies.map(companyAPI._normalize);
  },
  get: async (id: string): Promise<CompanyDTO> => {
    const res = await api.get(`/companies/${id}`);
    return companyAPI._normalize(res.data as RawCompany);
  },
  create: async (payload: Omit<CompanyDTO, 'id' | 'createdAt' | 'outstandingAmount'>): Promise<CompanyDTO> => {
    const res = await api.post('/companies', payload);
    return companyAPI._normalize(res.data as RawCompany);
  },
  update: async (id: string, updates: Partial<Omit<CompanyDTO, 'id'>>): Promise<CompanyDTO> => {
    const res = await api.put(`/companies/${id}`, updates);
    return companyAPI._normalize(res.data as RawCompany);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },
  recordPayment: async (id: string, amount: number, description?: string): Promise<void> => {
    await api.post(`/companies/${id}/payments`, { amount, description });
  },
  overview: async (id: string): Promise<{ company: CompanyDTO; metrics: { bookings: number; revenue: number; expenses: number; completed: number; outstanding: number }; bookings: RawBooking[]; payments: RawPayment[] }> => {
    const res = await api.get(`/companies/${id}/overview`);
    const data = res.data as CompanyOverviewResponse;
    return { ...data, company: companyAPI._normalize(data.company) };
  }
};

// Vehicle API
export const vehicleAPI = {
  _normalize(raw: RawVehicle): VehicleDTO {
    return {
      id: raw.id || raw._id || '',
      registrationNumber: raw.registrationNumber,
      category: raw.category,
      owner: raw.owner,
      insuranceExpiry: typeof raw.insuranceExpiry === 'string' ? raw.insuranceExpiry : new Date(raw.insuranceExpiry).toISOString(),
      fitnessExpiry: typeof raw.fitnessExpiry === 'string' ? raw.fitnessExpiry : new Date(raw.fitnessExpiry).toISOString(),
      permitExpiry: typeof raw.permitExpiry === 'string' ? raw.permitExpiry : new Date(raw.permitExpiry).toISOString(),
      pollutionExpiry: typeof raw.pollutionExpiry === 'string' ? raw.pollutionExpiry : new Date(raw.pollutionExpiry).toISOString(),
      status: raw.status,
      mileageTrips: raw.mileageTrips,
      mileageKm: raw.mileageKm,
      createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date(raw.createdAt || Date.now()).toISOString(),
    };
  },
  list: async (): Promise<VehicleDTO[]> => {
    const res = await api.get('/vehicles');
    const data = res.data as { vehicles: RawVehicle[]; total: number } | RawVehicle[];
    if (Array.isArray(data)) return data.map(vehicleAPI._normalize);
    return data.vehicles.map(vehicleAPI._normalize);
  },
  get: async (id: string): Promise<VehicleDTO> => {
    const res = await api.get(`/vehicles/${id}`);
    return vehicleAPI._normalize(res.data as RawVehicle);
  },
  create: async (payload: Omit<VehicleDTO,'id'|'createdAt'|'status'> & { status?: VehicleDTO['status'] }): Promise<VehicleDTO> => {
  const res = await api.post('/vehicles', normalizeVehicleDates(payload));
    return vehicleAPI._normalize(res.data as RawVehicle);
  },
  update: async (id: string, updates: Partial<VehicleDTO>): Promise<VehicleDTO> => {
  const res = await api.put(`/vehicles/${id}`, normalizeVehicleDates(updates));
    return vehicleAPI._normalize(res.data as RawVehicle);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  }
};

// Driver API
export const driverAPI = {
  _normalize(raw: RawDriver): DriverDTO {
    return {
      id: raw.id || raw._id || '',
      name: raw.name,
      phone: raw.phone,
      licenseNumber: raw.licenseNumber,
      aadhaar: raw.aadhaar,
      vehicleType: raw.vehicleType,
      licenseExpiry: typeof raw.licenseExpiry === 'string' ? raw.licenseExpiry : new Date(raw.licenseExpiry).toISOString(),
      policeVerificationExpiry: typeof raw.policeVerificationExpiry === 'string' ? raw.policeVerificationExpiry : new Date(raw.policeVerificationExpiry).toISOString(),
      paymentMode: raw.paymentMode,
      salary: raw.salary,
      advances: (raw.advances || []).map(a => ({
  id: a.id || a._id || '',
        amount: a.amount,
        date: typeof a.date === 'string' ? a.date : new Date(a.date).toISOString(),
        settled: a.settled ?? false,
        description: a.description || ''
      })),
      status: raw.status,
      createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date(raw.createdAt || Date.now()).toISOString(),
    };
  },
  list: async (): Promise<DriverDTO[]> => {
    const res = await api.get('/drivers');
    const data = res.data as { drivers: RawDriver[]; total: number } | RawDriver[];
    if (Array.isArray(data)) return data.map(driverAPI._normalize);
    return data.drivers.map(driverAPI._normalize);
  },
  get: async (id: string): Promise<DriverDTO> => {
    const res = await api.get(`/drivers/${id}`);
    return driverAPI._normalize(res.data as RawDriver);
  },
  create: async (payload: Omit<DriverDTO,'id'|'createdAt'|'advances'|'status'> & { status?: DriverDTO['status'] }): Promise<DriverDTO> => {
    const body = normalizeDriverDates(payload);
    const res = await api.post('/drivers', body);
    return driverAPI._normalize(res.data as RawDriver);
  },
  update: async (id: string, updates: Partial<DriverDTO>): Promise<DriverDTO> => {
    const res = await api.put(`/drivers/${id}`, normalizeDriverDates(updates));
    return driverAPI._normalize(res.data as RawDriver);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/drivers/${id}`);
  },
  addAdvance: async (id: string, amount: number, description?: string): Promise<DriverDTO> => {
    const res = await api.post(`/drivers/${id}/advances`, { amount, description });
    return driverAPI._normalize(res.data as RawDriver);
  },
  settleAdvance: async (id: string, advanceId: string): Promise<void> => {
    await api.put(`/drivers/${id}/settle-advance`, { advanceId });
  }
};

// Booking API
interface RawStatusChange { status: 'booked'|'ongoing'|'completed'; timestamp: string|Date; changedBy: string; _id?: string; id?: string; }
interface RawExpense { id?: string; _id?: string; type: 'fuel'|'toll'|'parking'|'other'; amount: number; description: string; }
interface RawDutySlip { id?: string; _id?: string; path?: string; uploadedAt?: string|Date; uploadedBy?: string; description?: string; name?: string; size?: number; data?: string; type?: string; }
type MaybePopulated<T> = T | { _id?: string; id?: string } | undefined;
interface RawFullBooking { _id?: string; id?: string; customerName: string; customerPhone: string; bookingSource: 'company'|'travel-agency'|'individual'; companyId?: MaybePopulated<string>; pickupLocation: string; dropLocation: string; journeyType: 'outstation'|'local'|'one-way'|'round-trip'; startDate: string|Date; endDate: string|Date; vehicleId?: MaybePopulated<string>; driverId?: MaybePopulated<string>; tariffRate: number; totalAmount: number; advanceReceived: number; balance: number; status: 'booked'|'ongoing'|'completed'; expenses: RawExpense[]; billed: boolean; statusHistory: RawStatusChange[]; dutySlips?: RawDutySlip[]; createdAt?: string|Date; }
export interface BookingDTO { id: string; customerName: string; customerPhone: string; bookingSource: 'company'|'travel-agency'|'individual'; companyId?: string; pickupLocation: string; dropLocation: string; journeyType: 'outstation'|'local'|'one-way'|'round-trip'; startDate: string; endDate: string; vehicleId?: string; driverId?: string; tariffRate: number; totalAmount: number; advanceReceived: number; balance: number; status: 'booked'|'ongoing'|'completed'; expenses: { id: string; type: RawExpense['type']; amount: number; description: string }[]; billed: boolean; statusHistory: { id: string; status: BookingDTO['status']; timestamp: string; changedBy: string }[]; dutySlips?: RawDutySlip[]; createdAt: string; }

export const bookingAPI = {
  _normalize(raw: RawFullBooking): BookingDTO {
    return {
      id: raw.id || raw._id || '',
      customerName: raw.customerName,
      customerPhone: raw.customerPhone,
      bookingSource: raw.bookingSource,
  companyId: (typeof raw.companyId === 'object' && raw.companyId?._id ? (raw.companyId._id || raw.companyId.id) : raw.companyId) as string | undefined,
      pickupLocation: raw.pickupLocation,
      dropLocation: raw.dropLocation,
      journeyType: raw.journeyType,
      startDate: typeof raw.startDate === 'string' ? raw.startDate : new Date(raw.startDate).toISOString(),
      endDate: typeof raw.endDate === 'string' ? raw.endDate : new Date(raw.endDate).toISOString(),
  vehicleId: (typeof raw.vehicleId === 'object' && raw.vehicleId?._id ? (raw.vehicleId._id || raw.vehicleId.id) : raw.vehicleId) as string | undefined,
  driverId: (typeof raw.driverId === 'object' && raw.driverId?._id ? (raw.driverId._id || raw.driverId.id) : raw.driverId) as string | undefined,
      tariffRate: raw.tariffRate,
      totalAmount: raw.totalAmount,
      advanceReceived: raw.advanceReceived,
      balance: raw.balance,
      status: raw.status,
      expenses: (raw.expenses||[]).map(e=>({ id: e.id || e._id || '', type: e.type, amount: e.amount, description: e.description })),
      billed: raw.billed,
      statusHistory: (raw.statusHistory||[]).map(s=>({ id: s.id || s._id || '', status: s.status, timestamp: typeof s.timestamp==='string'?s.timestamp:new Date(s.timestamp).toISOString(), changedBy: s.changedBy })),
      dutySlips: raw.dutySlips,
      createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date(raw.createdAt || Date.now()).toISOString(),
    };
  },
  list: async (): Promise<BookingDTO[]> => {
    const res = await api.get('/bookings');
    const data = res.data as { bookings: RawFullBooking[]; total: number } | RawFullBooking[];
    if (Array.isArray(data)) return data.map(bookingAPI._normalize);
    return data.bookings.map(bookingAPI._normalize);
  },
  get: async (id: string): Promise<BookingDTO> => {
    const res = await api.get(`/bookings/${id}`);
    return bookingAPI._normalize(res.data as RawFullBooking);
  },
  create: async (payload: Omit<BookingDTO,'id'|'createdAt'|'expenses'|'statusHistory'|'billed'|'balance'|'status'> & { status?: BookingDTO['status'] }): Promise<BookingDTO> => {
    const body = normalizeBookingDates(payload);
    const res = await api.post('/bookings', body);
    return bookingAPI._normalize(res.data as RawFullBooking);
  },
  update: async (id: string, updates: Partial<BookingDTO>): Promise<BookingDTO> => {
    const res = await api.put(`/bookings/${id}`, normalizeBookingDates(updates));
    return bookingAPI._normalize(res.data as RawFullBooking);
  },
  addExpense: async (id: string, expense: { type: RawExpense['type']; amount: number; description: string }): Promise<BookingDTO> => {
    const res = await api.post(`/bookings/${id}/expenses`, expense);
    return bookingAPI._normalize(res.data as RawFullBooking);
  },
  updateStatus: async (id: string, status: BookingDTO['status'], changedBy: string): Promise<BookingDTO> => {
    const res = await api.put(`/bookings/${id}/status`, { status, changedBy });
    return bookingAPI._normalize(res.data as RawFullBooking);
  },
  toggleBilled: async (id: string, billed: boolean): Promise<BookingDTO> => {
    const res = await api.put(`/bookings/${id}`, { billed });
    return bookingAPI._normalize(res.data as RawFullBooking);
  }
};

// Finance API
export interface FinanceMetricsDTO { totalRevenue: number; totalOutstanding: number; totalExpenses: number; netProfit: number; }
export const financeAPI = {
  getMetrics: async (): Promise<FinanceMetricsDTO> => {
    const res = await api.get('/finance/metrics');
    return res.data as FinanceMetricsDTO;
  },
  getDriverPayments: async (driverId: string) => {
    const res = await api.get(`/finance/drivers/${driverId}/payments`);
    return res.data as { id?: string; _id?: string; amount: number; type: string; date: string; description?: string }[];
  }
};

function normalizeBookingDates<T extends Record<string, unknown>>(obj: T): T {
  const copy: Record<string, unknown> = { ...obj };
  ['startDate','endDate'].forEach(key => {
    const value = copy[key];
    if (typeof value === 'string' && value.length === 16 && value.includes('T')) { // datetime-local (no seconds)
      copy[key] = new Date(value + ':00.000Z').toISOString();
    } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      copy[key] = new Date(value + 'T00:00:00.000Z').toISOString();
    }
  });
  return copy as T;
}

function normalizeDriverDates<T extends Record<string, unknown>>(obj: T): T {
  const copy: Record<string, unknown> = { ...obj };
  ['licenseExpiry','policeVerificationExpiry'].forEach(key => {
    const value = copy[key];
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      copy[key] = new Date(value + 'T00:00:00.000Z').toISOString();
    }
  });
  return copy as T;
}

// Normalize date-only (YYYY-MM-DD) strings to full ISO for backend zod datetime validation
function normalizeVehicleDates<T extends Record<string, unknown>>(obj: T): T {
  const copy: Record<string, unknown> = { ...obj };
  ['insuranceExpiry','fitnessExpiry','permitExpiry','pollutionExpiry'].forEach(key => {
    const value = copy[key];
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      copy[key] = new Date(value + 'T00:00:00.000Z').toISOString();
    }
  });
  return copy as T;
}

export default api;
