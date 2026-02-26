import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useApp } from '../../context/AppContext';
import { predictCommunication, predictEncounter, generateHeatmapData, generateSmartReminders } from '../../utils/aiPrediction';
import { formatRelativeTime } from '../../utils/time';

const PredictionScreen = () => {
  const { contacts, settings } = useApp();
  const [activeTab, setActiveTab] = useState('predictions');
  const [currentLocation] = useState({ latitude: 39.9042, longitude: 116.4074 });

  const communicationPredictions = useMemo(() => predictCommunication(contacts, currentLocation), [contacts, currentLocation]);
  const encounterPredictions = useMemo(() => predictEncounter(contacts, currentLocation), [contacts, currentLocation]);
  const heatmapData = useMemo(() => generateHeatmapData(contacts), [contacts]);
  const reminders = useMemo(() => generateSmartReminders([...communicationPredictions, ...encounterPredictions]), [communicationPredictions, encounterPredictions]);

  if (!settings.ai) {
    return (
      <View style={styles.disabledContainer}>
        <Icon name="robot" size={48} color="#334155" />
        <Text style={styles.disabledTitle}>AI预测已关闭</Text>
        <Text style={styles.disabledText}>请在设置中开启AI智能建议</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {[
          { id: 'predictions', label: '预测', icon: 'brain' },
          { id: 'heatmap', label: '热力图', icon: 'fire' },
          { id: 'reminders', label: '提醒', icon: 'bell' },
        ].map(tab => (
          <TouchableOpacity key={tab.id} style={[styles.tab, activeTab === tab.id && styles.tabActive]} onPress={() => setActiveTab(tab.id)}>
            <Icon name={tab.icon} size={14} color={activeTab === tab.id ? '#fff' : '#94a3b8'} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'predictions' && (
          <View>
            <Text style={styles.sectionTitle}>沟通预测（24小时内）</Text>
            {communicationPredictions.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>暂无沟通预测</Text>
              </View>
            ) : (
              communicationPredictions.map((pred, index) => (
                <View key={index} style={styles.predictionCard}>
                  <View style={styles.predictionHeader}>
                    <View style={styles.predictionAvatar}><Text style={styles.predictionAvatarText}>{pred.contact.name[0]}</Text></View>
                    <View style={styles.predictionInfo}>
                      <Text style={styles.predictionName}>{pred.contact.name}</Text>
                      <Text style={styles.predictionTime}>建议时间：{pred.suggestedTime.date} {pred.suggestedTime.time}</Text>
                    </View>
                    <View style={styles.probabilityBadge}><Text style={styles.probabilityText}>{Math.round(pred.probability * 100)}%</Text></View>
                  </View>
                  <View style={styles.predictionFactors}>
                    {pred.factors.map((factor, i) => (
                      <View key={i} style={styles.factorChip}><Text style={styles.factorText}>{factor}</Text></View>
                    ))}
                  </View>
                </View>
              ))
            )}

            <Text style={styles.sectionTitle}>相遇预测（24小时内）</Text>
            {encounterPredictions.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>暂无相遇预测</Text>
              </View>
            ) : (
              encounterPredictions.map((pred, index) => (
                <View key={index} style={styles.predictionCard}>
                  <View style={styles.predictionHeader}>
                    <View style={styles.predictionAvatar}><Text style={styles.predictionAvatarText}>{pred.contact.name[0]}</Text></View>
                    <View style={styles.predictionInfo}>
                      <Text style={styles.predictionName}>{pred.contact.name}</Text>
                      <Text style={styles.predictionTime}>{pred.encounterTime.description} · {pred.encounterLocation.name}</Text>
                    </View>
                    <View style={styles.probabilityBadge}><Text style={styles.probabilityText}>{Math.round(pred.probability * 100)}%</Text></View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'heatmap' && (
          <View>
            <Text style={styles.sectionTitle}>活跃时段分布</Text>
            <View style={styles.heatmapGrid}>
              {heatmapData.map((hour, index) => (
                <View key={index} style={[styles.heatmapCell, { backgroundColor: `rgba(59, 130, 246, ${hour.activity})` }]}>
                  <Text style={styles.heatmapHour}>{hour.hour}</Text>
                </View>
              ))}
            </View>
            <View style={styles.heatmapLegend}>
              <Text style={styles.legendText}>低活跃</Text>
              <View style={styles.legendGradient}>
                {[0.2, 0.4, 0.6, 0.8, 1].map((op, i) => (
                  <View key={i} style={[styles.legendBox, { opacity: op }]} />
                ))}
              </View>
              <Text style={styles.legendText}>高活跃</Text>
            </View>
          </View>
        )}

        {activeTab === 'reminders' && (
          <View>
            <Text style={styles.sectionTitle}>智能提醒</Text>
            {reminders.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>暂无提醒</Text>
              </View>
            ) : (
              reminders.map((reminder, index) => (
                <View key={index} style={[styles.reminderCard, reminder.priority === 'high' && styles.reminderCardHigh]}>
                  <View style={styles.reminderHeader}>
                    <Icon name="lightbulb" size={16} color={reminder.priority === 'high' ? '#ef4444' : '#f59e0b'} />
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                  </View>
                  <Text style={styles.reminderMessage}>{reminder.message}</Text>
                  <TouchableOpacity style={styles.reminderAction}>
                    <Text style={styles.reminderActionText}>{reminder.action}</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  disabledContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  disabledTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginTop: 16 },
  disabledText: { fontSize: 14, color: '#64748b', marginTop: 8 },
  tabBar: { flexDirection: 'row', padding: 16, gap: 12 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 10, gap: 6, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  tabActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  tabText: { fontSize: 13, fontWeight: '500', color: '#94a3b8' },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 12, marginTop: 8 },
  emptyCard: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 12, padding: 24, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#64748b' },
  predictionCard: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  predictionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  predictionAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  predictionAvatarText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  predictionInfo: { flex: 1 },
  predictionName: { fontSize: 15, fontWeight: '600', color: '#fff', marginBottom: 2 },
  predictionTime: { fontSize: 12, color: '#94a3b8' },
  probabilityBadge: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: 12 },
  probabilityText: { fontSize: 13, fontWeight: 'bold', color: '#3b82f6' },
  predictionFactors: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  factorChip: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(100, 116, 139, 0.3)', borderRadius: 12 },
  factorText: { fontSize: 11, color: '#94a3b8' },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'center' },
  heatmapCell: { width: 50, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  heatmapHour: { fontSize: 12, color: '#fff', fontWeight: '600' },
  heatmapLegend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, gap: 8 },
  legendText: { fontSize: 12, color: '#64748b' },
  legendGradient: { flexDirection: 'row', gap: 2 },
  legendBox: { width: 20, height: 12, backgroundColor: '#3b82f6', borderRadius: 2 },
  reminderCard: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  reminderCardHigh: { borderColor: 'rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  reminderHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  reminderTitle: { fontSize: 15, fontWeight: '600', color: '#fff' },
  reminderMessage: { fontSize: 13, color: '#94a3b8', lineHeight: 20, marginBottom: 12 },
  reminderAction: { backgroundColor: '#3b82f6', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  reminderActionText: { fontSize: 13, fontWeight: '600', color: '#fff' },
});

export default PredictionScreen;
