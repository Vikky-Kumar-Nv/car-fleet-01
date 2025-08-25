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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertDriverReport = exports.listAllDriverMonthReports = exports.listDriverMonthReports = void 0;
const service = __importStar(require("../services"));
const listDriverMonthReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverId } = req.params;
    const year = parseInt(req.query.year, 10);
    const month = parseInt(req.query.month, 10);
    if (isNaN(year) || isNaN(month))
        return res.status(400).json({ message: 'year and month required' });
    const docs = yield service.listDriverReportsForMonth(driverId, year, month);
    res.json(docs);
});
exports.listDriverMonthReports = listDriverMonthReports;
const listAllDriverMonthReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const year = parseInt(req.query.year, 10);
    const month = parseInt(req.query.month, 10);
    if (isNaN(year) || isNaN(month))
        return res.status(400).json({ message: 'year and month required' });
    const docs = yield service.listAllDriversReportsForMonth(year, month);
    res.json(docs);
});
exports.listAllDriverMonthReports = listAllDriverMonthReports;
const upsertDriverReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverId } = req.params;
    const _a = req.body, { date } = _a, rest = __rest(_a, ["date"]);
    if (!date)
        return res.status(400).json({ message: 'date required' });
    const entryDate = new Date(date);
    const doc = yield service.upsertDriverReportEntry(driverId, entryDate, rest);
    res.status(200).json(doc);
});
exports.upsertDriverReport = upsertDriverReport;
