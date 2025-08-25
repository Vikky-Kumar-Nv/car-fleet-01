"use strict";
// Mock all services to avoid database dependencies
jest.mock('../src/api/services', () => ({
    createVehicle: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439020', registrationNumber: 'TEST123' }),
    getVehicles: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 }),
    getVehicleById: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439020', registrationNumber: 'TEST123' }),
    updateVehicle: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439020', registrationNumber: 'UPDATED123' }),
    deleteVehicle: jest.fn().mockResolvedValue(true),
    createCustomer: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439022', name: 'Test Customer' }),
    getCustomers: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 50 }),
    getCustomerById: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439022', name: 'Test Customer' }),
    updateCustomer: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439022', name: 'Updated Customer' }),
    deleteCustomer: jest.fn().mockResolvedValue(true),
    createDriver: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439021', name: 'Test Driver' }),
    getDrivers: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 }),
    getDriverById: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439021', name: 'Test Driver' }),
    updateDriver: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439021', name: 'Updated Driver' }),
    deleteDriver: jest.fn().mockResolvedValue(true),
    addAdvance: jest.fn().mockResolvedValue({ success: true }),
    settleAdvance: jest.fn().mockResolvedValue({ success: true }),
    createPayment: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439024', amount: 1000 }),
    getPayments: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 }),
    getFinanceMetrics: jest.fn().mockResolvedValue({ totalRevenue: 0, totalExpenses: 0 }),
    getDriverPayments: jest.fn().mockResolvedValue({ data: [], total: 0 }),
    getMonthlyEarnings: jest.fn().mockResolvedValue({ data: [] }),
    getDriverPerformance: jest.fn().mockResolvedValue({ data: [] }),
    getVehicleUsage: jest.fn().mockResolvedValue({ data: [] }),
    getExpenseBreakdown: jest.fn().mockResolvedValue({ data: [] }),
    createFuel: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439025', totalAmount: 1000 }),
    listFuel: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 }),
    getFuel: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439025', totalAmount: 1000 }),
    updateFuel: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439025', totalAmount: 1500 }),
    deleteFuel: jest.fn().mockResolvedValue(true),
    createVehicleCategory: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439026', name: 'Test Category' }),
    getVehicleCategories: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 }),
    getVehicleCategoryById: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439026', name: 'Test Category' }),
    updateVehicleCategory: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439026', name: 'Updated Category' }),
    deleteVehicleCategory: jest.fn().mockResolvedValue(true),
    getServicing: jest.fn().mockResolvedValue({ vehicleId: '507f1f77bcf86cd799439020', oilChanges: [] }),
    upsertServicing: jest.fn().mockResolvedValue({ vehicleId: '507f1f77bcf86cd799439020', oilChanges: [] }),
    appendSection: jest.fn().mockResolvedValue({ success: true }),
    listDriverMonthReports: jest.fn().mockResolvedValue({ data: [], total: 0 }),
    upsertDriverReport: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439027', driverId: '507f1f77bcf86cd799439021' }),
    listAllDriverMonthReports: jest.fn().mockResolvedValue({ data: [], total: 0 })
}));
// Mock cloudinary upload
jest.mock('../src/config/cloudinary', () => ({
    uploadToCloudinary: jest.fn().mockResolvedValue({
        url: 'https://test-cloudinary-url.com/test-image.jpg',
        publicId: 'test-public-id'
    })
}));
// Mock validation schemas
jest.mock('../src/api/validation', () => ({
    vehicleSchema: {
        parse: jest.fn().mockImplementation((data) => data)
    },
    updateVehicleSchema: {
        parse: jest.fn().mockImplementation((data) => data)
    },
    customerSchema: {
        parse: jest.fn().mockImplementation((data) => data)
    },
    updateCustomerSchema: {
        parse: jest.fn().mockImplementation((data) => data)
    },
    driverSchema: {
        parse: jest.fn().mockImplementation((data) => data)
    },
    updateDriverSchema: {
        parse: jest.fn().mockImplementation((data) => data)
    },
    paymentSchema: {
        parse: jest.fn().mockImplementation((data) => data)
    },
    fuelSchema: {
        parse: jest.fn().mockImplementation((data) => data)
    },
    vehicleCategorySchema: {
        parse: jest.fn().mockImplementation((data) => data)
    }
}));
// Mock file system operations
jest.mock('fs', () => (Object.assign(Object.assign({}, jest.requireActual('fs')), { existsSync: jest.fn().mockReturnValue(true), mkdirSync: jest.fn(), writeFileSync: jest.fn(), unlinkSync: jest.fn() })));
