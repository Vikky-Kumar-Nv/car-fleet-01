"use strict";
// // src/validation/index.ts
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = exports.updateCompanySchema = exports.companySchema = exports.updateVehicleSchema = exports.vehicleSchema = exports.advanceSchema = exports.updateDriverSchema = exports.driverSchema = exports.statusSchema = exports.expenseSchema = exports.updateBookingSchema = exports.bookingSchema = exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
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
const zod_1 = require("zod");
// src/validation/index.ts (Update date fields)
const dateSchema = zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }).transform((val) => new Date(val));
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email'),
    password: zod_1.z.string().min(6, 'Password too short'),
    name: zod_1.z.string().min(1, 'Name required'),
    phone: zod_1.z.string().min(10, 'Invalid phone'),
    role: zod_1.z.enum(['admin', 'accountant', 'dispatcher', 'driver', 'customer']),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email'),
    password: zod_1.z.string().min(1, 'Password required'),
});
exports.updateUserSchema = exports.registerSchema.partial();
exports.bookingSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(1, 'Customer name required'),
    customerPhone: zod_1.z.string().min(10, 'Invalid phone'),
    bookingSource: zod_1.z.enum(['company', 'travel-agency', 'individual']),
    companyId: zod_1.z.string().optional(),
    pickupLocation: zod_1.z.string().min(1, 'Pickup required'),
    dropLocation: zod_1.z.string().min(1, 'Drop required'),
    journeyType: zod_1.z.enum(['outstation', 'local', 'one-way', 'round-trip']),
    startDate: zod_1.z.string().datetime('Invalid date'),
    endDate: zod_1.z.string().datetime('Invalid date'),
    vehicleId: zod_1.z.string().optional(),
    driverId: zod_1.z.string().optional(),
    tariffRate: zod_1.z.number().min(0, 'Positive rate'),
    totalAmount: zod_1.z.number().min(0, 'Positive amount'),
    advanceReceived: zod_1.z.number().min(0, 'Positive advance'),
});
exports.updateBookingSchema = exports.bookingSchema.partial().extend({
    billed: zod_1.z.boolean().optional(),
});
exports.expenseSchema = zod_1.z.object({
    type: zod_1.z.enum(['fuel', 'toll', 'parking', 'other']),
    amount: zod_1.z.number().min(0),
    description: zod_1.z.string().min(1),
});
exports.statusSchema = zod_1.z.object({
    status: zod_1.z.enum(['booked', 'ongoing', 'completed']),
    changedBy: zod_1.z.string().min(1),
});
exports.driverSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(10),
    licenseNumber: zod_1.z.string().min(1),
    aadhaar: zod_1.z.string().min(12),
    vehicleType: zod_1.z.enum(['owned', 'rented']),
    licenseExpiry: zod_1.z.string().datetime(),
    policeVerificationExpiry: zod_1.z.string().datetime(),
    paymentMode: zod_1.z.enum(['per-trip', 'daily', 'monthly', 'fuel-basis']),
    salary: zod_1.z.number().min(0),
});
exports.updateDriverSchema = exports.driverSchema.partial();
exports.advanceSchema = zod_1.z.object({
    amount: zod_1.z.number().min(0),
    description: zod_1.z.string().optional(),
});
exports.vehicleSchema = zod_1.z.object({
    registrationNumber: zod_1.z.string().min(1),
    category: zod_1.z.enum(['SUV', 'sedan', 'bus', 'mini-bus']),
    owner: zod_1.z.enum(['owned', 'rented']),
    insuranceExpiry: zod_1.z.string().datetime(),
    fitnessExpiry: zod_1.z.string().datetime(),
    permitExpiry: zod_1.z.string().datetime(),
    pollutionExpiry: zod_1.z.string().datetime(),
});
exports.updateVehicleSchema = exports.vehicleSchema.partial().extend({
    status: zod_1.z.enum(['active', 'maintenance', 'inactive']).optional(),
    mileageTrips: zod_1.z.number().optional(),
    mileageKm: zod_1.z.number().optional(),
});
exports.companySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    gst: zod_1.z.string().min(15),
    address: zod_1.z.string().min(1),
    contactPerson: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(10),
    email: zod_1.z.string().email(),
});
exports.updateCompanySchema = exports.companySchema.partial().extend({
    outstandingAmount: zod_1.z.number().min(0).optional(),
});
exports.paymentSchema = zod_1.z.object({
    entityId: zod_1.z.string().uuid(),
    entityType: zod_1.z.enum(['customer', 'driver']),
    amount: zod_1.z.number().min(0).positive(),
    type: zod_1.z.enum(['received', 'paid']),
    description: zod_1.z.string().optional(),
    relatedAdvanceId: zod_1.z.string().uuid().optional(),
});
