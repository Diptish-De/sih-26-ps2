# KSHEER-RAKSHAK — SIH26109
### AI-Based Predictive Modelling for Early Forecasting of Bovine Mastitis in Indian Dairy Farms

> **Smart India Hackathon 2026** · Hardware Category · Theme: Agriculture, FoodTech & Rural Development  
> **Team:** Dropouts (Team ID: 134847) · **Problem Statement:** SIH26109

---

## 🌟 Overview & Problem Context

Bovine mastitis causes an estimated **₹7,165 crore loss annually** to the Indian dairy economy (ICAR-NIVEDI Krishnamoorthy et al., 2021). Over **45% of Indian dairy cows carry subclinical mastitis** with zero visible swelling or milk abnormalities. By the time clinical symptoms appear, the quarter is damaged, requiring blanket antibiotic treatments that drive **Antimicrobial Resistance (AMR)** and force discarded milk batches. Conventional somatic cell counters cost ₹10 lakh—completely out of reach for smallholder farmers who typically own 2–5 cows.

**KSHEER-RAKSHAK** delivers an affordable, end-to-end early forecasting system operating on the core engineering pipeline:
```
Sense ➔ Edge ➔ Learn ➔ Forecast ➔ Explain ➔ Act
```

### 🔬 Scientific Innovations & Edge:
1. **Cow's Own Healthy Baseline:** 14-day individualized z-score drift tracking vs. each cow's historical 30-day mean, detecting subclinical inflammation days before visible swelling.
2. **Milk-Tube (Not Udder) Thermal Sensing:** MLX90640 far-IR array positioned directly at the milk tube. Bypasses hair, dung, and ambient humidity interference (+1.11°C subclinical, +2.04°C clinical; Gayathri et al., 2023).
3. **CMT-Camera SCC On-Device AI:** Turn a ₹3 California Mastitis Test (CMT) gel reaction into an SCC risk band on an edge neural net (TFLite).
4. **Explainable AI (XAI) via SHAP:** Rather than black-box scores, SHAP names the exact physical drivers (SCC rise, tube heat, rumination drop, milk EC slope) in plain farmer language.
5. **Proven 7–14 Day Lead-Time Window:** Validated against ICAR-NDRI Karnal research (Satheesan et al., 2024), where thermography flagged infection in Sahiwal cattle from **Day −10 (r = 0.84)**.
6. **Economics:** Pays back inside **ONE lactation** (₹375 sensor unit vs. ₹1,390 loss per cow per lactation).

---

## 📱 Technology Stack

- **Framework:** React Native + Expo + TypeScript
- **Target Platform:** Android-First (Native mobile APK & Hermes bytecode export supported)
- **UI & Design System:** Custom rural-health palette (Deep Dairy Green `#0F382A`, Rich Cream `#FAF7F0`, SIH Gold `#C99726`)
- **Visualizations:** `react-native-svg` 14-day forecast trajectory curves, 4-quarter udder thermal heatmap, SHAP waterfall bars, and regional GIS hotspot map
- **Edge Simulation:** ESP32-C3 over BLE/LoRa, MQTT + SD-card buffer, GSM/SMS automated fallback

---

## 🚀 Quick Start & Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Expo Development Server
```bash
npx expo start
```
- Press `a` in the terminal to launch on an **Android emulator/device**.
- Press `w` to open in a **web browser**.
- Scan the displayed QR code with the **Expo Go** app on your Android phone.

### 3. Build & Export Production Bundles
- **Android Hermes Bundle:**
  ```bash
  npm run build:android
  ```
  Generates `_expo/static/js/android/index-...hbc` bytecode bundle.
- **Web Export:**
  ```bash
  npm run build:web
  ```

---

## 🎬 Live SIH 2026 Demo Story Flow

To demonstrate the full end-to-end journey to the judges, tap the **"★ Demo"** button on the top-right header or follow this 7-step sequence:

| Step | Screen | Action / What to Observe |
|---|---|---|
| **1. Overview** | **Farmer Dashboard** | View 20 monitored cows, Herd Health Index (84), and 2 High-Risk alerts. Notice ESP32-C3 gateway status. |
| **2. High-Risk Cow** | **Cow Details** | Click **Cow #42 Ganga** (Sahiwal). Observe the 4-quarter udder heatmap highlighting a **+1.8°C thermal spike in the Left Rear (LR) quarter**. |
| **3. Explainability** | **SHAP Drivers** | Tap **"Why is this cow at risk?"**. Review the ranked SHAP waterfall: SCC elevation (+38%), tube heat (+31%), rumination drop (-18%), milk EC slope (+12%). |
| **4. Early Lead Time** | **14-Day Trajectory** | Inspect the XGBoost forecast curve demonstrating that infection was flagged at **Day −10** before clinical mastitis. |
| **5. Edge AI Test** | **CMT Camera Scan** | Tap **"Run CMT Camera Scan"**. View the 4-well paddle viewfinder, capture the gel reaction, and observe the simulated edge CNN classification (**SCC Band 2+, 1.85M cells/mL, 93.6% confidence**). Save result. |
| **6. Action Plan** | **Do Today** | Review actionable hygiene steps (milk LR last, separate container, 0.5% chlorhexidine teat dip, call vet). Tap **"Send SMS Alert"** to test simulated GSM fallback. |
| **7. Close the Loop** | **Veterinarian Command** | Switch role to **Veterinarian (Dr. Meera Roy)**. Open Priority Triage, click **"Confirm Diagnosis"**, prescribe targeted single-quarter cloxacillin (combating AMR), and submit the outcome label to MLflow for continuous model retraining! |

---

## 👥 Stakeholder Roles & Modules

### 1. 👨‍🌾 Farmer Role (Smallholder)
- **Home Dashboard:** Large glanceable numbers, herd health index, today's alerts, ESP32-C3 battery/solar status, and offline toggle.
- **Herd List:** 20+ realistic cattle (Sahiwal, Gir, Murrah buffalo, HF Cross), search, filter by risk/breed, and sort by 14-day drift.
- **Cow Details:** Tag number, lactation day, 4-quarter MLX90640 thermal & EC heatmap, 14-day forecast chart, and rumination metrics.
- **Explainable AI (SHAP):** Driver waterfall bars with plain-language explanations in English, Hindi (हिन्दी), and Bengali (বাংলা).
- **Action Plan:** Step-by-step guidance, teat dipping instructions, one-tap vet calling, and GSM/SMS fallback preview.
- **CMT Camera:** 4-well camera overlay with AI gel viscosity detection.
- **Settings & Offline Sync:** Language switcher (EN/HI/BN), SD card sync queue manager, SMS fallback configuration, and demo reset.

### 2. 🩺 Veterinarian Role (Command Center)
- **Clinical Command Dashboard:** Dr. Meera Roy's triage center, active case count, and MLflow label contribution counter.
- **Ranked Herd Triage:** Prioritized case queue based on calibrated risk and drift slopes.
- **Clinical Investigation:** Inspection of 4-quarter sensor differentials and previous treatment regimens.
- **Outcome Confirmation Modal:** Diagnostic confirmation (subclinical/clinical/false positive), pathogen record, selective therapy prescription, milk withholding days, and ground-truth label logging into MLflow.

### 3. 🏛️ Cooperative / DAHD Role (Regional Federation)
- **Regional Dashboard:** South Bengal Milk Union overview, district Herd Risk Index (0–100), farms reporting, and bulk tank SCC tracking.
- **GIS Hotspot Map:** Interactive spatial lag model (T3 target) identifying disease clusters in Nadia, Hooghly, Howrah, North 24 Parganas, Karnal, and Anand without exposing individual farm identities.
- **Milk Quality & AMR Protection:** Bulk tank SCC monitoring preventing antibiotic milk contamination into collection chilling centers.
- **Proactive Veterinary Dispatch:** Direct mobile veterinary units to high-risk clusters before clinical outbreaks.

---

## 📡 Hardware & Edge Architecture

- **Microcontroller:** ESP32-C3 RISC-V 160MHz
- **Thermal Sensing:** MLX90640 32×24 Far-IR thermal array mounted on milk tube
- **Conductivity Probe:** Temperature-compensated 4-pole EC sensor
- **Comms:** BLE / LoRaWAN + MQTT
- **Resilience:** SD-card local buffering during network outages + automated GSM/SMS alerts in Hindi, Bengali, and English
- **Power:** LiFePO4 battery with solar harvesting (6–12 months autonomous field operation)

---

## 🏆 SIH Team & Problem Details

- **Problem Statement ID:** SIH26109
- **Problem Statement Title:** AI-Based Predictive Modelling for Early Forecasting of Bovine Mastitis in Indian Dairy Farms
- **Theme:** Agriculture, FoodTech & Rural Development
- **Category:** Hardware
- **Team Name:** Dropouts
- **Team ID:** 134847
