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
exports.appendSection = exports.upsertServicing = exports.getServicing = void 0;
const validation_1 = require("../validation");
const service = __importStar(require("../services"));
const getServicing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleId } = req.params;
    const doc = yield service.getVehicleServicing(vehicleId);
    if (!doc)
        return res.json({ vehicleId, oilChanges: [], partsReplacements: [], tyres: [], installments: [], insurances: [], legalPapers: [] });
    res.json(doc);
});
exports.getServicing = getServicing;
const upsertServicing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleId } = req.params;
    const data = validation_1.updateVehicleServicingSchema.parse(Object.assign(Object.assign({}, req.body), { vehicleId }));
    const doc = yield service.upsertVehicleServicing(vehicleId, data);
    res.status(200).json(doc);
});
exports.upsertServicing = upsertServicing;
const appendSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleId, section } = req.params;
    const allowed = ['oilChanges', 'partsReplacements', 'tyres', 'installments', 'insurances', 'legalPapers'];
    if (!allowed.includes(section))
        return res.status(400).json({ message: 'Invalid section' });
    const entries = Array.isArray(req.body) ? req.body : [req.body];
    const doc = yield service.addServicingEntries(vehicleId, section, entries);
    res.json(doc);
});
exports.appendSection = appendSection;
