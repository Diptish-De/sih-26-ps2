import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { UserRole, AppLanguage, Cow, AlertNotification, VetCase, DistrictHotspot } from './src/types';
import { THEME } from './src/constants/theme';
import { mockApiService } from './src/services/mockApiService';
import { Header } from './src/components/Header';
import { BottomNav, ScreenTab } from './src/components/BottomNav';
import { DemoStoryModal } from './src/components/DemoStoryModal';

// Farmer screens
import { FarmerDashboardScreen } from './src/screens/farmer/FarmerDashboardScreen';
import { HerdScreen } from './src/screens/farmer/HerdScreen';
import { CowDetailScreen } from './src/screens/farmer/CowDetailScreen';
import { ShapExplainScreen } from './src/screens/farmer/ShapExplainScreen';
import { ActionPlanScreen } from './src/screens/farmer/ActionPlanScreen';
import { CmtCameraScreen } from './src/screens/farmer/CmtCameraScreen';
import { AlertsScreen } from './src/screens/farmer/AlertsScreen';
import { AnalyticsScreen } from './src/screens/farmer/AnalyticsScreen';
import { SettingsScreen } from './src/screens/farmer/SettingsScreen';

// Vet screens
import { VetDashboardScreen } from './src/screens/vet/VetDashboardScreen';
import { VetTriageScreen } from './src/screens/vet/VetTriageScreen';

// Cooperative screens
import { CoopDashboardScreen } from './src/screens/coop/CoopDashboardScreen';
import { GisHotspotScreen } from './src/screens/coop/GisHotspotScreen';

export default function App() {
  const [role, setRole] = useState<UserRole>(mockApiService.getRole());
  const [language, setLanguage] = useState<AppLanguage>(mockApiService.getLanguage());
  const [currentTab, setCurrentTab] = useState<ScreenTab>('farmer_dashboard');
  const [activeSubScreen, setActiveSubScreen] = useState<'NONE' | 'COW_DETAIL' | 'SHAP_EXPLAIN' | 'ACTION_PLAN' | 'CMT_CAMERA'>('NONE');
  const [selectedCow, setSelectedCow] = useState<Cow>(mockApiService.getCows()[0]);
  const [demoStoryVisible, setDemoStoryVisible] = useState<boolean>(false);

  // Live state from mock API
  const [cows, setCows] = useState<Cow[]>(mockApiService.getCows());
  const [alerts, setAlerts] = useState<AlertNotification[]>(mockApiService.getAlerts());
  const [vetCases, setVetCases] = useState<VetCase[]>(mockApiService.getVetCases());
  const [hotspots, setHotspots] = useState<DistrictHotspot[]>(mockApiService.getDistrictHotspots());

  useEffect(() => {
    const unsubscribe = mockApiService.subscribe(() => {
      setCows(mockApiService.getCows());
      setAlerts(mockApiService.getAlerts());
      setVetCases(mockApiService.getVetCases());
      setHotspots(mockApiService.getDistrictHotspots());
      setRole(mockApiService.getRole());
      setLanguage(mockApiService.getLanguage());
    });
    return unsubscribe;
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    mockApiService.setRole(newRole);
    setRole(newRole);
    setActiveSubScreen('NONE');
    if (newRole === 'FARMER') setCurrentTab('farmer_dashboard');
    else if (newRole === 'VET') setCurrentTab('vet_dashboard');
    else setCurrentTab('coop_dashboard');
  };

  const handleLanguageChange = (newLang: AppLanguage) => {
    mockApiService.setLanguage(newLang);
    setLanguage(newLang);
  };

  const handleSelectCow = (cow: Cow) => {
    setSelectedCow(cow);
    setActiveSubScreen('COW_DETAIL');
  };

  const handleSelectTab = (tab: ScreenTab) => {
    setActiveSubScreen('NONE');
    setCurrentTab(tab);
  };

  // Stepper flow for SIH 2026 demo
  const handleNavigateToDemoStep = (stepNumber: number) => {
    const cow42 = cows.find(c => c.id === 42) || cows[0];
    setSelectedCow(cow42);

    switch (stepNumber) {
      case 1: // Dashboard Overview
        handleRoleChange('FARMER');
        setActiveSubScreen('NONE');
        setCurrentTab('farmer_dashboard');
        break;
      case 2: // High-Risk Cow Triage
        handleRoleChange('FARMER');
        setActiveSubScreen('COW_DETAIL');
        break;
      case 3: // SHAP Drivers
        handleRoleChange('FARMER');
        setActiveSubScreen('SHAP_EXPLAIN');
        break;
      case 4: // 14-day Forecast Trajectory
        handleRoleChange('FARMER');
        setActiveSubScreen('COW_DETAIL');
        break;
      case 5: // CMT Camera Scan
        handleRoleChange('FARMER');
        setActiveSubScreen('CMT_CAMERA');
        break;
      case 6: // Action Plan & SMS
        handleRoleChange('FARMER');
        setActiveSubScreen('ACTION_PLAN');
        break;
      case 7: // Vet Confirmation
        handleRoleChange('VET');
        setActiveSubScreen('NONE');
        setCurrentTab('vet_dashboard');
        break;
    }
  };

  // Subscreen navigation
  const renderScreenContent = () => {
    // Check if subscreen is open
    if (activeSubScreen === 'COW_DETAIL') {
      return (
        <CowDetailScreen
          cow={selectedCow}
          language={language}
          onBack={() => setActiveSubScreen('NONE')}
          onOpenShap={() => setActiveSubScreen('SHAP_EXPLAIN')}
          onOpenActionPlan={() => setActiveSubScreen('ACTION_PLAN')}
          onOpenCmtScan={() => setActiveSubScreen('CMT_CAMERA')}
        />
      );
    }

    if (activeSubScreen === 'SHAP_EXPLAIN') {
      return (
        <ShapExplainScreen
          cow={selectedCow}
          language={language}
          onBack={() => setActiveSubScreen('COW_DETAIL')}
          onProceedToActionPlan={() => setActiveSubScreen('ACTION_PLAN')}
        />
      );
    }

    if (activeSubScreen === 'ACTION_PLAN') {
      return (
        <ActionPlanScreen
          cow={selectedCow}
          language={language}
          onBack={() => setActiveSubScreen('COW_DETAIL')}
          onNavigateToVetView={() => {
            handleRoleChange('VET');
            setCurrentTab('vet_dashboard');
          }}
        />
      );
    }

    if (activeSubScreen === 'CMT_CAMERA') {
      return (
        <CmtCameraScreen
          cows={cows}
          language={language}
          onBack={() => setActiveSubScreen('COW_DETAIL')}
          onResultSaved={cowId => {
            const updated = mockApiService.getCowById(cowId);
            if (updated) setSelectedCow(updated);
          }}
        />
      );
    }

    // Role-specific main screens
    if (role === 'FARMER') {
      switch (currentTab) {
        case 'farmer_dashboard':
          return (
            <FarmerDashboardScreen
              cows={cows}
              alerts={alerts}
              language={language}
              onSelectCow={handleSelectCow}
              onNavigate={tab => handleSelectTab(tab as ScreenTab)}
              onStartDemoFlow={() => setDemoStoryVisible(true)}
            />
          );
        case 'farmer_herd':
          return (
            <HerdScreen
              cows={cows}
              language={language}
              onSelectCow={handleSelectCow}
              onNavigateToCmt={() => setActiveSubScreen('CMT_CAMERA')}
            />
          );
        case 'farmer_cmt':
          return (
            <CmtCameraScreen
              cows={cows}
              language={language}
              onBack={() => setCurrentTab('farmer_dashboard')}
              onResultSaved={cowId => {
                const updated = mockApiService.getCowById(cowId);
                if (updated) setSelectedCow(updated);
              }}
            />
          );
        case 'farmer_alerts':
          return (
            <AlertsScreen
              alerts={alerts}
              language={language}
              onOpenCow={cowId => {
                const cow = cows.find(c => c.id === cowId);
                if (cow) handleSelectCow(cow);
              }}
            />
          );
        case 'farmer_analytics':
          return <AnalyticsScreen />;
        case 'farmer_settings':
          return (
            <SettingsScreen
              language={language}
              currentRole={role}
              onLanguageChange={handleLanguageChange}
              onRoleChange={handleRoleChange}
              onResetDemo={() => mockApiService.resetDemoData()}
            />
          );
        default:
          return (
            <FarmerDashboardScreen
              cows={cows}
              alerts={alerts}
              language={language}
              onSelectCow={handleSelectCow}
              onNavigate={tab => handleSelectTab(tab as ScreenTab)}
              onStartDemoFlow={() => setDemoStoryVisible(true)}
            />
          );
      }
    }

    if (role === 'VET') {
      switch (currentTab) {
        case 'vet_dashboard':
          return (
            <VetDashboardScreen
              cows={cows}
              vetCases={vetCases}
              language={language}
              onSelectCow={handleSelectCow}
              onNavigateToTriage={() => setCurrentTab('vet_triage')}
              onRefreshCases={() => setVetCases(mockApiService.getVetCases())}
            />
          );
        case 'vet_triage':
          return (
            <VetTriageScreen
              cows={cows}
              vetCases={vetCases}
              language={language}
              onSelectCow={handleSelectCow}
              onRefreshCases={() => setVetCases(mockApiService.getVetCases())}
            />
          );
        case 'vet_alerts':
          return (
            <AlertsScreen
              alerts={alerts}
              language={language}
              onOpenCow={cowId => {
                const cow = cows.find(c => c.id === cowId);
                if (cow) handleSelectCow(cow);
              }}
            />
          );
        case 'vet_analytics':
          return <AnalyticsScreen />;
        default:
          return (
            <VetDashboardScreen
              cows={cows}
              vetCases={vetCases}
              language={language}
              onSelectCow={handleSelectCow}
              onNavigateToTriage={() => setCurrentTab('vet_triage')}
              onRefreshCases={() => setVetCases(mockApiService.getVetCases())}
            />
          );
      }
    }

    if (role === 'COOPERATIVE') {
      switch (currentTab) {
        case 'coop_dashboard':
          return (
            <CoopDashboardScreen
              hotspots={hotspots}
              language={language}
              onNavigateToHotspots={() => setCurrentTab('coop_hotspots')}
            />
          );
        case 'coop_hotspots':
          return <GisHotspotScreen hotspots={hotspots} language={language} />;
        case 'coop_analytics':
          return <AnalyticsScreen />;
        case 'coop_alerts':
          return (
            <AlertsScreen
              alerts={alerts}
              language={language}
              onOpenCow={cowId => {
                const cow = cows.find(c => c.id === cowId);
                if (cow) handleSelectCow(cow);
              }}
            />
          );
        default:
          return (
            <CoopDashboardScreen
              hotspots={hotspots}
              language={language}
              onNavigateToHotspots={() => setCurrentTab('coop_hotspots')}
            />
          );
      }
    }

    return null;
  };

  const unreadAlerts = alerts.filter(a => !a.read).length;

  return (
    <View style={styles.outerBackground}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.primaryDark} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.appShell}>
          {/* Persistent App Header */}
          <Header
            currentRole={role}
            currentLanguage={language}
            onRoleChange={handleRoleChange}
            onLanguageChange={handleLanguageChange}
            onOpenDemoStory={() => setDemoStoryVisible(true)}
          />

          {/* Screen Body */}
          <View style={styles.body}>{renderScreenContent()}</View>

          {/* Bottom Nav Bar (hidden inside camera viewfinder for immersive camera UX) */}
          {activeSubScreen !== 'CMT_CAMERA' && (
            <BottomNav
              currentRole={role}
              currentTab={currentTab}
              onSelectTab={handleSelectTab}
              unreadAlertsCount={unreadAlerts}
            />
          )}

          {/* SIH 2026 Interactive Demo Story Stepper Modal */}
          <DemoStoryModal
            visible={demoStoryVisible}
            onClose={() => setDemoStoryVisible(false)}
            onNavigateToStep={handleNavigateToDemoStep}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerBackground: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#081C15' : THEME.colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  appShell: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 460 : '100%',
    backgroundColor: THEME.colors.creamBase,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          height: '100%',
          maxHeight: 920,
          borderRadius: 24,
          marginVertical: 12,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }
      : {}),
  },
  body: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    backgroundColor: THEME.colors.creamBase,
  },
});
