export type RiskLevel = 'HEALTHY' | 'LOW' | 'MODERATE' | 'HIGH';

export type QuarterCode = 'LF' | 'RF' | 'LR' | 'RR';

export interface QuarterData {
  code: QuarterCode;
  name: string;
  tubeTempDiff: number; // e.g. +1.8 °C
  ecValue: number;      // mS/cm
  sccBand: 'Negative' | 'Trace' | '1+' | '2+' | '3+';
  isAffected: boolean;
  statusText: string;
}

export interface ShapDriver {
  id: string;
  featureKey: string;
  name: string;
  nameHi: string;
  nameBn: string;
  impactWeight: number; // e.g. 0.38
  deltaValue: string;   // e.g. "+34%" or "+1.8°C"
  baselineValue: string; // e.g. "36.2°C"
  currentValue: string;  // e.g. "38.0°C"
  explanation: string;
  direction: 'increase_risk' | 'decrease_risk';
}

export interface Cow {
  id: number;
  tagNumber: string;
  name: string;
  breed: 'Sahiwal' | 'Gir' | 'Murrah' | 'HF Cross' | 'Jersey Cross';
  ageYears: number;
  parity: number;
  lactationDay: number;
  currentMilkYield: number; // L/day
  avgMilkYield: number;     // L/day
  riskScore: number;        // 0 - 100 calibrated %
  riskLevel: RiskLevel;
  primaryQuarter: QuarterCode | 'None';
  sccCellsPerMl: number;    // e.g. 1,450,000
  sccBand: 'Negative' | 'Trace' | '1+' | '2+' | '3+';
  tubeTempDiff: number;     // MLX90640 differential
  milkEc: number;           // mS/cm (temp compensated)
  ruminationMin: number;    // min/day
  ruminationDropPct: number;// % vs 30d baseline
  activitySteps: number;    // steps/min
  activityDropPct: number;
  thiIndex: number;         // Temperature-Humidity Index
  sensorStatus: 'ONLINE' | 'BUFFERED_SD' | 'OFFLINE';
  lastMilkedTime: string;
  forecast14Days: number[]; // 14 daily risk % points
  quarters: Record<QuarterCode, QuarterData>;
  shapDrivers: ShapDriver[];
  actionPlan: {
    stepsEn: string[];
    stepsHi: string[];
    stepsBn: string[];
    urgency: 'HIGH' | 'MODERATE' | 'ROUTINE';
    vetRecommended: boolean;
  };
}

export interface AlertNotification {
  id: string;
  cowId: number;
  tagNumber: string;
  cowName: string;
  timestamp: string;
  riskScore: number;
  riskLevel: RiskLevel;
  quarter: QuarterCode | 'ALL';
  titleEn: string;
  titleHi: string;
  titleBn: string;
  reasonEn: string;
  reasonHi: string;
  reasonBn: string;
  actionEn: string;
  actionHi: string;
  actionBn: string;
  read: boolean;
  smsDispatched: boolean;
  smsRecipient: string;
}

export interface VetCase {
  id: string;
  cowId: number;
  cowName: string;
  tagNumber: string;
  farmName: string;
  district: string;
  riskScore: number;
  affectedQuarter: QuarterCode;
  submittedAt: string;
  status: 'PENDING_REVIEW' | 'CONFIRMED_CLINICAL' | 'CONFIRMED_SUBCLINICAL' | 'FALSE_POSITIVE' | 'RESOLVED';
  pathogenIsolated?: string;
  treatmentRegimen?: string;
  withholdingDays?: number;
  vetNotes?: string;
  labeledForTraining: boolean;
}

export interface DistrictHotspot {
  id: string;
  districtName: string;
  state: string;
  farmsCount: number;
  cowsMonitored: number;
  herdRiskIndex: number; // 0 - 100
  highRiskAlerts: number;
  moderateRiskAlerts: number;
  bulkTankScc: number;   // cells/mL
  milkQualityGrade: 'A' | 'B' | 'C';
  status: 'ALERT_HOTSPOT' | 'MONITOR' | 'NORMAL';
  coordinates: { x: number; y: number }; // relative grid coordinates
}

export type UserRole = 'FARMER' | 'VET' | 'COOPERATIVE';

export type AppLanguage = 'en' | 'hi' | 'bn';

export interface SensorGatewayStatus {
  gatewayId: string;
  protocol: 'BLE / LoRa + MQTT' | 'GSM Fallback';
  firmwareVersion: string;
  batteryPercent: number;
  solarCharging: boolean;
  sdCardBufferedPackets: number;
  lastSyncTimestamp: string;
  isOnline: boolean;
  packetLossRate: number;
}
