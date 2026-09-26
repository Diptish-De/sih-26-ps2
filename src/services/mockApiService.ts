import { Cow, AlertNotification, VetCase, DistrictHotspot, SensorGatewayStatus, AppLanguage, UserRole } from '../types';
import { INITIAL_COWS, INITIAL_ALERTS, INITIAL_VET_CASES, INITIAL_DISTRICT_HOTSPOTS, INITIAL_GATEWAY_STATUS } from '../constants/mockData';

class MockApiService {
  private cows: Cow[] = JSON.parse(JSON.stringify(INITIAL_COWS));
  private alerts: AlertNotification[] = JSON.parse(JSON.stringify(INITIAL_ALERTS));
  private vetCases: VetCase[] = JSON.parse(JSON.stringify(INITIAL_VET_CASES));
  private hotspots: DistrictHotspot[] = JSON.parse(JSON.stringify(INITIAL_DISTRICT_HOTSPOTS));
  private gateway: SensorGatewayStatus = JSON.parse(JSON.stringify(INITIAL_GATEWAY_STATUS));

  private isOffline: boolean = false;
  private pendingSyncCount: number = 2; // simulated offline buffered records
  private currentLanguage: AppLanguage = 'en';
  private currentRole: UserRole = 'FARMER';
  private demoModeActive: boolean = true;

  // Listeners for reactive updates
  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Language & Role getters/setters
  getLanguage(): AppLanguage {
    return this.currentLanguage;
  }

  setLanguage(lang: AppLanguage) {
    this.currentLanguage = lang;
    this.notify();
  }

  getRole(): UserRole {
    return this.currentRole;
  }

  setRole(role: UserRole) {
    this.currentRole = role;
    this.notify();
  }

  isDemoMode(): boolean {
    return this.demoModeActive;
  }

  setDemoMode(active: boolean) {
    this.demoModeActive = active;
    this.notify();
  }

  // Offline Mode Management
  getOfflineStatus(): { isOffline: boolean; pendingSyncCount: number; lastSync: string } {
    return {
      isOffline: this.isOffline,
      pendingSyncCount: this.pendingSyncCount,
      lastSync: this.gateway.lastSyncTimestamp,
    };
  }

  toggleOfflineMode(): boolean {
    this.isOffline = !this.isOffline;
    if (this.isOffline) {
      this.gateway.isOnline = false;
      this.gateway.protocol = 'GSM Fallback';
    } else {
      this.gateway.isOnline = true;
      this.gateway.protocol = 'BLE / LoRa + MQTT';
      this.gateway.sdCardBufferedPackets = 0;
      this.pendingSyncCount = 0;
      this.gateway.lastSyncTimestamp = 'Just now';
    }
    this.notify();
    return this.isOffline;
  }

  triggerSyncNow(): Promise<{ success: boolean; syncedItems: number }> {
    return new Promise(resolve => {
      setTimeout(() => {
        const count = this.pendingSyncCount;
        this.pendingSyncCount = 0;
        this.gateway.sdCardBufferedPackets = 0;
        this.gateway.lastSyncTimestamp = 'Just now';
        this.notify();
        resolve({ success: true, syncedItems: count });
      }, 700);
    });
  }

  // Gateway status
  getGatewayStatus(): SensorGatewayStatus {
    return { ...this.gateway };
  }

  // Cow Queries
  getCows(): Cow[] {
    return [...this.cows];
  }

  getCowById(id: number): Cow | undefined {
    return this.cows.find(c => c.id === id);
  }

  searchCows(query: string, breedFilter?: string, riskFilter?: string): Cow[] {
    return this.cows.filter(cow => {
      const matchQuery =
        !query ||
        cow.name.toLowerCase().includes(query.toLowerCase()) ||
        cow.tagNumber.toLowerCase().includes(query.toLowerCase()) ||
        cow.id.toString().includes(query);

      const matchBreed = !breedFilter || breedFilter === 'All' || cow.breed === breedFilter;
      const matchRisk = !riskFilter || riskFilter === 'All' || cow.riskLevel === riskFilter;

      return matchQuery && matchBreed && matchRisk;
    });
  }

  // Alert Queries & Actions
  getAlerts(): AlertNotification[] {
    return [...this.alerts];
  }

  markAlertRead(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.read = true;
      this.notify();
    }
  }

  dispatchManualSms(cowId: number, recipientNumber: string = '+91 98301 24590'): boolean {
    const cow = this.getCowById(cowId);
    if (!cow) return false;

    const newAlert: AlertNotification = {
      id: `sms-manual-${Date.now()}`,
      cowId: cow.id,
      tagNumber: cow.tagNumber,
      cowName: cow.name,
      timestamp: 'Just now',
      riskScore: cow.riskScore,
      riskLevel: cow.riskLevel,
      quarter: cow.primaryQuarter === 'None' ? 'LR' : cow.primaryQuarter,
      titleEn: `[SMS] ALERT DISPATCHED: Cow #${cow.id} ${cow.name}`,
      titleHi: `[एसएमएस] अलर्ट भेजा गया: गाय #${cow.id} ${cow.name}`,
      titleBn: `[এসএমএস] সতর্কতা পাঠানো হয়েছে: গরু #${cow.id} ${cow.name}`,
      reasonEn: `High mastitis risk forecast. Sent to ${recipientNumber} via GSM fallback.`,
      reasonHi: `उच्च जोखिम पूर्व सूचना। जीएसएम नेटवर्क द्वारा भेजा गया।`,
      reasonBn: `উচ্চ ঝুঁকির আগাম তথ্য। জিএসএম নেটওয়ার্কের মাধ্যমে পাঠানো হলো।`,
      actionEn: 'Farmer alerted on field phone. Separate pot instructed.',
      actionHi: 'किसान को एसएमएस प्राप्त हुआ। अलग बर्तन का प्रयोग करें।',
      actionBn: 'কৃষকের ফোনে সতর্কবার্তা পৌঁছেছে। আলাদা পাত্র ব্যবহার করুন।',
      read: false,
      smsDispatched: true,
      smsRecipient: recipientNumber,
    };

    this.alerts.unshift(newAlert);
    this.notify();
    return true;
  }

  // CMT Camera Scan AI inference simulation
  simulateCmtInference(cowId: number, quarter: 'LF' | 'RF' | 'LR' | 'RR' = 'LR'): Promise<{
    sccBand: 'Negative' | 'Trace' | '1+' | '2+' | '3+';
    estimatedScc: number;
    confidence: number;
    riskEscalation: boolean;
    reason: string;
  }> {
    return new Promise(resolve => {
      setTimeout(() => {
        // High risk result for demo
        const result = {
          sccBand: '2+' as const,
          estimatedScc: 1850000,
          confidence: 93.6,
          riskEscalation: true,
          reason: 'Gel viscosity index > 0.74. Distinct central precipitation in California Mastitis Test.',
        };

        // Update the cow's record with this latest CMT scan
        const cow = this.cows.find(c => c.id === cowId);
        if (cow) {
          cow.sccBand = result.sccBand;
          cow.sccCellsPerMl = result.estimatedScc;
          if (cow.quarters[quarter]) {
            cow.quarters[quarter].sccBand = result.sccBand;
            cow.quarters[quarter].isAffected = true;
          }
        }

        if (this.isOffline) {
          this.pendingSyncCount += 1;
        }

        this.notify();
        resolve(result);
      }, 1000);
    });
  }

  // Vet Cases Queries & Actions
  getVetCases(): VetCase[] {
    return [...this.vetCases];
  }

  confirmVetDiagnosis(caseId: string, payload: {
    status: 'CONFIRMED_CLINICAL' | 'CONFIRMED_SUBCLINICAL' | 'FALSE_POSITIVE' | 'RESOLVED';
    pathogen: string;
    treatment: string;
    withholdingDays: number;
    vetNotes: string;
  }): boolean {
    const vCase = this.vetCases.find(c => c.id === caseId);
    if (!vCase) return false;

    vCase.status = payload.status;
    vCase.pathogenIsolated = payload.pathogen;
    vCase.treatmentRegimen = payload.treatment;
    vCase.withholdingDays = payload.withholdingDays;
    vCase.vetNotes = payload.vetNotes;
    vCase.labeledForTraining = true; // continuous learning loop!

    this.notify();
    return true;
  }

  // District Hotspots
  getDistrictHotspots(): DistrictHotspot[] {
    return [...this.hotspots];
  }

  // Reset demo data to initial state
  resetDemoData() {
    this.cows = JSON.parse(JSON.stringify(INITIAL_COWS));
    this.alerts = JSON.parse(JSON.stringify(INITIAL_ALERTS));
    this.vetCases = JSON.parse(JSON.stringify(INITIAL_VET_CASES));
    this.hotspots = JSON.parse(JSON.stringify(INITIAL_DISTRICT_HOTSPOTS));
    this.gateway = JSON.parse(JSON.stringify(INITIAL_GATEWAY_STATUS));
    this.isOffline = false;
    this.pendingSyncCount = 0;
    this.notify();
  }
}

export const mockApiService = new MockApiService();
