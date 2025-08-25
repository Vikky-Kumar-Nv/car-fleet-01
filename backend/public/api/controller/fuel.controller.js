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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.updateFuel = exports.deleteFuel = exports.getFuel = exports.listFuel = exports.createFuel = void 0;
const service = __importStar(require("../services"));
const validation_1 = require("../validation");
const fuel_service_1 = require("../services/fuel.service");
const createFuel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const parsed = validation_1.fuelEntrySchema.parse(req.body);
        const doc = yield service.createFuelEntry(Object.assign(Object.assign({}, parsed), { fuelFillDate: new Date(parsed.fuelFillDate), includeInFinance: (_a = parsed.includeInFinance) !== null && _a !== void 0 ? _a : true }));
        res.status(201).json(doc);
    }
    catch (e) {
        if (e.name === 'ZodError')
            return res.status(400).json({ message: 'Invalid payload', errors: e.errors });
        res.status(500).json({ message: e.message });
    }
});
exports.createFuel = createFuel;
const listFuel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleId, bookingId } = req.query;
    const docs = yield service.listFuelEntries(vehicleId, bookingId);
    res.json(docs);
});
exports.listFuel = listFuel;
const getFuel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const doc = yield service.getFuelEntry(id);
    if (!doc)
        return res.status(404).json({ message: 'Not found' });
    res.json(doc);
});
exports.getFuel = getFuel;
const deleteFuel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield service.deleteFuelEntry(id);
    res.status(204).end();
});
exports.deleteFuel = deleteFuel;
const updateFuel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updates = Object.assign({}, req.body);
        if (updates.fuelFillDate)
            updates.fuelFillDate = new Date(updates.fuelFillDate);
        const doc = yield (0, fuel_service_1.updateFuelEntry)(id, updates);
        if (!doc)
            return res.status(404).json({ message: 'Not found' });
        res.json(doc);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
});
exports.updateFuel = updateFuel;
