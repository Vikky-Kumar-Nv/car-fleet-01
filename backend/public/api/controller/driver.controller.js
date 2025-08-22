"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settleAdvance = exports.addAdvance = exports.deleteDriver = exports.updateDriver = exports.getDriverById = exports.getDrivers = exports.createDriver = void 0;
const service = __importStar(require("../services"));
const validation_1 = require("../validation");
const cloudinary_1 = require("../../config/cloudinary");
const createDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // If multipart form-data used, multer (upload middleware) should have run before this controller.
    const data = validation_1.driverSchema.parse(req.body);
    const driverData = Object.assign(Object.assign({}, data), { licenseExpiry: new Date(data.licenseExpiry), policeVerificationExpiry: new Date(data.policeVerificationExpiry), dateOfJoining: new Date(data.dateOfJoining), status: data.status || 'active' });
    // Handle uploaded files if present
    // Expect fields: photo (single), document (single), licenseDocument, policeVerificationDocument
    // When using multer.array('files'), files do not have fieldname mapping unless custom. For simplicity we also allow direct string paths from body.
    const files = req.files;
    if (files) {
        const assign = (field, targetField) => __awaiter(void 0, void 0, void 0, function* () {
            const fArr = files[field];
            if (fArr && fArr[0]) {
                const uploaded = yield (0, cloudinary_1.uploadToCloudinary)(fArr[0].path, 'drivers');
                driverData[targetField] = uploaded.url;
                driverData[`${targetField}PublicId`] = uploaded.publicId;
            }
        });
        yield assign('photo', 'photo');
        yield assign('licenseDocument', 'licenseDocument');
        yield assign('policeVerificationDocument', 'policeVerificationDocument');
        yield assign('document', 'document');
    }
    const driver = yield service.createDriver(driverData);
    res.status(201).json(driver);
});
exports.createDriver = createDriver;
const getDrivers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = { status: req.query.status, paymentMode: req.query.paymentMode };
    const result = yield service.getDrivers(page, limit, filters);
    res.json(result);
});
exports.getDrivers = getDrivers;
const getDriverById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield service.getDriverById(req.params.id);
    if (!driver)
        return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
});
exports.getDriverById = getDriverById;
const updateDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = validation_1.updateDriverSchema.parse(req.body);
    const updateData = Object.assign({}, data);
    // Convert date strings to Date objects
    if (updateData.licenseExpiry)
        updateData.licenseExpiry = new Date(updateData.licenseExpiry);
    if (updateData.policeVerificationExpiry)
        updateData.policeVerificationExpiry = new Date(updateData.policeVerificationExpiry);
    if (updateData.dateOfJoining)
        updateData.dateOfJoining = new Date(updateData.dateOfJoining);
    const ufiles = req.files;
    if (ufiles) {
        const assign = (field, targetField) => __awaiter(void 0, void 0, void 0, function* () {
            const fArr = ufiles[field];
            if (fArr && fArr[0]) {
                const uploaded = yield (0, cloudinary_1.uploadToCloudinary)(fArr[0].path, 'drivers');
                updateData[targetField] = uploaded.url;
                updateData[`${targetField}PublicId`] = uploaded.publicId;
            }
        });
        yield assign('photo', 'photo');
        yield assign('licenseDocument', 'licenseDocument');
        yield assign('policeVerificationDocument', 'policeVerificationDocument');
        yield assign('document', 'document');
    }
    const driver = yield service.updateDriver(req.params.id, updateData);
    if (!driver)
        return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
});
exports.updateDriver = updateDriver;
const deleteDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield service.deleteDriver(req.params.id);
    res.status(204).send();
});
exports.deleteDriver = deleteDriver;
const addAdvance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = validation_1.advanceSchema.parse(req.body);
    const advanceData = Object.assign(Object.assign({}, data), { date: new Date(), settled: false, description: data.description || '' });
    const driver = yield service.addAdvance(req.params.id, advanceData);
    if (!driver)
        return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
});
exports.addAdvance = addAdvance;
const settleAdvance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { advanceId } = req.body;
    yield service.settleAdvance(req.params.id, advanceId);
    res.status(200).json({ message: 'Advance settled' });
});
exports.settleAdvance = settleAdvance;
