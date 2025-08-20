// // src/validation/index.ts
// import { z } from 'zod';

// export const registerSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
//   name: z.string().min(1),
//   phone: z.string().min(10),
//   role: z.enum(['admin', 'accountant', 'dispatcher', 'driver', 'customer']),
// });

// export const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(1),
// });

// export const bookingSchema = z.object({
//   customerName: z.string().min(1),
//   customerPhone: z.string().min(10),
//   bookingSource: z.enum(['company', 'travel-agency', 'individual']),
//   companyId: z.string().optional(),
//   pickupLocation: z.string().min(1),
//   dropLocation: z.string().min(1),
//   journeyType: z.enum(['outstation', 'local', 'one-way', 'round-trip']),
//   startDate: z.string().datetime(),
//   endDate: z.string().datetime(),
//   vehicleId: z.string().optional(),
//   driverId: z.string().optional(),
//   tariffRate: z.number().min(0),
//   totalAmount: z.number().min(0),
//   advanceReceived: z.number().min(0),
// });

// export const updateBookingSchema = bookingSchema.partial().refine(data => Object.keys(data).length > 0, { message: 'At least one field required' });

// export const expenseSchema = z.object({
//   type: z.enum(['fuel', 'toll', 'parking', 'other']),
//   amount: z.number().min(0),
//   description: z.string().min(1),
// });

// export const statusSchema = z.object({
//   status: z.enum(['booked', 'ongoing', 'completed']),
// });

// export const driverSchema = z.object({
//   name: z.string().min(1),
//   phone: z.string().min(10),
//   licenseNumber: z.string().min(1),
//   aadhaar: z.string().min(12),
//   vehicleType: z.enum(['owned', 'rented']),
//   licenseExpiry: z.string().datetime(),
//   policeVerificationExpiry: z.string().datetime(),
//   paymentMode: z.enum(['per-trip', 'daily', 'monthly', 'fuel-basis']),
//   salary: z.number().min(0),
// });

// export const updateDriverSchema = driverSchema.partial();

// export const advanceSchema = z.object({
//   amount: z.number().min(0),
//   description: z.string().optional(),
// });

// export const vehicleSchema = z.object({
//   registrationNumber: z.string().min(1),
//   category: z.enum(['SUV', 'sedan', 'bus', 'mini-bus']),
//   owner: z.enum(['owned', 'rented']),
//   insuranceExpiry: z.string().datetime(),
//   fitnessExpiry: z.string().datetime(),
//   permitExpiry: z.string().datetime(),
//   pollutionExpiry: z.string().datetime(),
// });

// export const updateVehicleSchema = vehicleSchema.partial().extend({
//   status: z.enum(['active', 'maintenance', 'inactive']).optional(),
//   mileageTrips: z.number().optional(),
//   mileageKm: z.number().optional(),
// });

// export const companySchema = z.object({
//   name: z.string().min(1),
//   gst: z.string().min(15),
//   address: z.string().min(1),
//   contactPerson: z.string().min(1),
//   phone: z.string().min(10),
//   email: z.string().email(),
// });

// export const updateCompanySchema = companySchema.partial().extend({
//   outstandingAmount: z.number().min(0).optional(),
// });

// export const paymentSchema = z.object({
//   entityId: z.string(),
//   entityType: z.enum(['customer', 'driver']),
//   amount: z.number().min(0),
//   type: z.enum(['received', 'paid']),
//   description: z.string().optional(),
//   relatedAdvanceId: z.string().optional(),
// });






// src/validation/index.ts
import { z } from 'zod';


// src/validation/index.ts (Update date fields)
const dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }).transform((val) => new Date(val));

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
  name: z.string().min(1, 'Name required'),
  phone: z.string().min(10, 'Invalid phone'),
  role: z.enum(['admin', 'accountant', 'dispatcher', 'driver', 'customer']),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export const updateUserSchema = registerSchema.partial();

export const bookingSchema = z.object({
  customerName: z.string().min(1, 'Customer name required'),
  customerPhone: z.string().min(10, 'Invalid phone'),
  bookingSource: z.enum(['company', 'travel-agency', 'individual']),
  companyId: z.string().optional(),
  pickupLocation: z.string().min(1, 'Pickup required'),
  dropLocation: z.string().min(1, 'Drop required'),
  journeyType: z.enum(['outstation', 'local', 'one-way', 'round-trip']),
  startDate: z.string().datetime('Invalid date'),
  endDate: z.string().datetime('Invalid date'),
  vehicleId: z.string().optional(),
  driverId: z.string().optional(),
  tariffRate: z.number().min(0, 'Positive rate'),
  totalAmount: z.number().min(0, 'Positive amount'),
  advanceReceived: z.number().min(0, 'Positive advance'),
});

export const updateBookingSchema = bookingSchema.partial().extend({
  billed: z.boolean().optional(),
});

export const expenseSchema = z.object({
  type: z.enum(['fuel', 'toll', 'parking', 'other']),
  amount: z.number().min(0),
  description: z.string().min(1),
});

export const statusSchema = z.object({
  status: z.enum(['booked', 'ongoing', 'completed']),
  changedBy: z.string().min(1),
});

export const driverSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10),
  licenseNumber: z.string().min(1),
  aadhaar: z.string().min(12),
  vehicleType: z.enum(['owned', 'rented']),
  licenseExpiry: z.string().datetime(),
  policeVerificationExpiry: z.string().datetime(),
  paymentMode: z.enum(['per-trip', 'daily', 'monthly', 'fuel-basis']),
  salary: z.number().min(0),
});

export const updateDriverSchema = driverSchema.partial();

export const advanceSchema = z.object({
  amount: z.number().min(0),
  description: z.string().optional(),
});

export const vehicleSchema = z.object({
  registrationNumber: z.string().min(1),
  category: z.enum(['SUV', 'sedan', 'bus', 'mini-bus']),
  owner: z.enum(['owned', 'rented']),
  insuranceExpiry: z.string().datetime(),
  fitnessExpiry: z.string().datetime(),
  permitExpiry: z.string().datetime(),
  pollutionExpiry: z.string().datetime(),
});

export const updateVehicleSchema = vehicleSchema.partial().extend({
  status: z.enum(['active', 'maintenance', 'inactive']).optional(),
  mileageTrips: z.number().optional(),
  mileageKm: z.number().optional(),
});

export const companySchema = z.object({
  name: z.string().min(1),
  gst: z.string().min(15),
  address: z.string().min(1),
  contactPerson: z.string().min(1),
  phone: z.string().min(10),
  email: z.string().email(),
});

export const updateCompanySchema = companySchema.partial().extend({
  outstandingAmount: z.number().min(0).optional(),
});

export const paymentSchema = z.object({
  entityId: z.string().uuid(),
  entityType: z.enum(['customer', 'driver']),
  amount: z.number().min(0).positive(),
  type: z.enum(['received', 'paid']),
  description: z.string().optional(),
  relatedAdvanceId: z.string().uuid().optional(),
});