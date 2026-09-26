import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Cow, AppLanguage } from '../../types';
import { THEME } from '../../constants/theme';
import { RiskBadge } from '../../components/RiskBadge';
import { TRANSLATIONS } from '../../constants/i18n';

interface HerdScreenProps {
  cows: Cow[];
  language: AppLanguage;
  onSelectCow: (cow: Cow) => void;
  onNavigateToCmt: () => void;
}

export const HerdScreen: React.FC<HerdScreenProps> = ({
  cows,
  language,
  onSelectCow,
  onNavigateToCmt,
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedBreed, setSelectedBreed] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'risk_desc' | 'tag_asc'>('risk_desc');

  const riskFilters = ['All', 'HIGH', 'MODERATE', 'LOW', 'HEALTHY'];
  const breedFilters = ['All', 'Sahiwal', 'Gir', 'Murrah', 'HF Cross', 'Jersey Cross'];

  const filteredCows = cows
    .filter(c => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toString().includes(searchQuery);

      const matchRisk = selectedRisk === 'All' || c.riskLevel === selectedRisk;
      const matchBreed = selectedBreed === 'All' || c.breed === selectedBreed;

      return matchSearch && matchRisk && matchBreed;
    })
    .sort((a, b) => {
      if (sortBy === 'risk_desc') return b.riskScore - a.riskScore;
      return a.id - b.id;
    });

  const renderCowItem = ({ item }: { item: Cow }) => {
    return (
      <TouchableOpacity
        style={styles.cowRow}
        activeOpacity={0.8}
        onPress={() => onSelectCow(item)}
      >
        <View style={styles.avatarBlock}>
          <View style={[styles.avatar, item.riskScore >= 70 ? styles.avatarDanger : styles.avatarNormal]}>
            <Text style={[styles.avatarText, item.riskScore >= 70 && styles.avatarTextDanger]}>
              {item.name[0]}
            </Text>
          </View>
        </View>

        <View style={styles.mainInfo}>
          <View style={styles.topInfoRow}>
            <Text style={styles.cowName}>#{item.id} · {item.name}</Text>
            <RiskBadge score={item.riskScore} level={item.riskLevel} size="small" />
          </View>
          <Text style={styles.breedText}>
            {item.breed} · Lactation Day {item.lactationDay} · Parity {item.parity}
          </Text>

          <View style={styles.indicatorsRow}>
            <View style={styles.indItem}>
              <Text style={styles.indLabel}>QUARTER</Text>
              <Text style={[styles.indVal, item.primaryQuarter !== 'None' && { color: THEME.colors.riskHighText, fontWeight: '800' }]}>
                {item.primaryQuarter}
              </Text>
            </View>
            <View style={styles.indItem}>
              <Text style={styles.indLabel}>TUBE HEAT</Text>
              <Text style={[styles.indVal, item.tubeTempDiff >= 1.0 && { color: THEME.colors.riskHighText }]}>
                {item.tubeTempDiff >= 0 ? `+${item.tubeTempDiff}°C` : `${item.tubeTempDiff}°C`}
              </Text>
            </View>
            <View style={styles.indItem}>
              <Text style={styles.indLabel}>SCC BAND</Text>
              <Text style={styles.indVal}>{item.sccBand}</Text>
            </View>
            <View style={styles.indItem}>
              <Text style={styles.indLabel}>RUMINATION</Text>
              <Text style={[styles.indVal, item.ruminationDropPct > 10 && { color: THEME.colors.riskHighText }]}>
                {item.ruminationDropPct > 0 ? `-${item.ruminationDropPct}%` : 'Normal'}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.rowChevron}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Search & Filter Bar */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t.searchCow}
            placeholderTextColor={THEME.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick CMT Paddle action */}
        <TouchableOpacity style={styles.cmtBtn} onPress={onNavigateToCmt}>
          <Text style={styles.cmtBtnText}>+ CMT Scan</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips - Risk */}
      <View style={styles.filterSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={riskFilters}
          keyExtractor={item => item}
          contentContainerStyle={styles.chipsScroll}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, selectedRisk === item && styles.filterChipActive]}
              onPress={() => setSelectedRisk(item)}
            >
              <Text style={[styles.chipText, selectedRisk === item && styles.chipTextActive]}>
                {item === 'All' ? 'All Risks' : item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Filter Chips - Breed */}
      <View style={styles.filterSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={breedFilters}
          keyExtractor={item => item}
          contentContainerStyle={styles.chipsScroll}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChipBreed, selectedBreed === item && styles.filterChipBreedActive]}
              onPress={() => setSelectedBreed(item)}
            >
              <Text style={[styles.chipBreedText, selectedBreed === item && styles.chipBreedTextActive]}>
                {item === 'All' ? 'All Breeds' : item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Herd Count & Sorting Bar */}
      <View style={styles.metaBar}>
        <Text style={styles.metaCount}>
          Showing <Text style={{ fontWeight: '800' }}>{filteredCows.length}</Text> of {cows.length} animals
        </Text>
        <TouchableOpacity
          style={styles.sortToggle}
          onPress={() => setSortBy(sortBy === 'risk_desc' ? 'tag_asc' : 'risk_desc')}
        >
          <Text style={styles.sortText}>
            Sort: {sortBy === 'risk_desc' ? 'Highest Risk First ▾' : 'Tag Number ▾'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cow List */}
      <FlatList
        data={filteredCows}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCowItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No cows match current filters</Text>
            <Text style={styles.emptySub}>Try clearing your search query or changing risk filters.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.creamBase,
  },
  searchHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    ...THEME.shadows.card,
  },
  searchIcon: {
    fontSize: 16,
    color: THEME.colors.textMuted,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
  },
  clearSearch: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    padding: 4,
  },
  cmtBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: THEME.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cmtBtnText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  filterSection: {
    marginTop: 10,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.creamCard,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
  },
  filterChipActive: {
    backgroundColor: THEME.colors.primaryDark,
    borderColor: THEME.colors.primaryDark,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFF',
  },
  filterChipBreed: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
  },
  filterChipBreedActive: {
    backgroundColor: THEME.colors.primarySurface,
    borderColor: THEME.colors.primaryBorder,
  },
  chipBreedText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  chipBreedTextActive: {
    color: THEME.colors.primaryDark,
    fontWeight: '800',
  },
  metaBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  metaCount: {
    fontSize: 11.5,
    color: THEME.colors.textSecondary,
  },
  sortToggle: {
    paddingVertical: 2,
  },
  sortText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: THEME.colors.primaryMedium,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
    gap: 14,
  },
  cowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.creamCard,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    gap: 12,
    ...THEME.shadows.card,
  },
  avatarBlock: {
    justifyContent: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: THEME.colors.creamCardSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.creamBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDanger: {
    backgroundColor: THEME.colors.riskHighBg,
    borderColor: THEME.colors.riskHighBorder,
  },
  avatarNormal: {
    backgroundColor: THEME.colors.primarySurface,
    borderColor: THEME.colors.primaryBorder,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.colors.primaryDark,
  },
  avatarTextDanger: {
    color: THEME.colors.riskHighText,
  },
  mainInfo: {
    flex: 1,
  },
  topInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  cowName: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  breedText: {
    fontSize: 11.5,
    color: THEME.colors.textMuted,
    marginBottom: 8,
  },
  indicatorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.creamCardSubtle,
    padding: 8,
    borderRadius: 10,
  },
  indItem: {
    alignItems: 'flex-start',
  },
  indLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    letterSpacing: 0.4,
  },
  indVal: {
    fontSize: 11.5,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  rowChevron: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  emptySub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
});
