import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import { useApp } from '../../context/AppContext';

const { width, height } = Dimensions.get('window');

export default function GovernmentMonitorScreen() {
  const { governmentData } = useApp();
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const [showZones, setShowZones] = useState(true);
  const [showTracks, setShowTracks] = useState(false);

  const initialRegion = {
    latitude: 39.9845,
    longitude: 116.3075,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const activePersonnel = governmentData.personnel.filter(p => 
    p.status === '执勤中' || p.status === '巡检中'
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>实时监管</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.headerButton, showZones && styles.headerButtonActive]}
            onPress={() => setShowZones(!showZones)}
          >
            <Icon name="draw-polygon" size={16} color={showZones ? '#3b82f6' : '#94a3b8'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerButton, showTracks && styles.headerButtonActive]}
            onPress={() => setShowTracks(!showTracks)}
          >
            <Icon name="route" size={16} color={showTracks ? '#3b82f6' : '#94a3b8'} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          mapType={mapType}
        >
          {/* 管控区域 */}
          {showZones && governmentData.controlZones.map(zone => (
            <Circle
              key={zone.id}
              center={{ latitude: zone.latitude, longitude: zone.longitude }}
              radius={zone.radius}
              fillColor={zone.type === 'forbidden' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'}
              strokeColor={zone.type === 'forbidden' ? '#ef4444' : '#3b82f6'}
              strokeWidth={2}
            />
          ))}

          {/* 人员位置标记 */}
          {activePersonnel.map(person => (
            <Marker
              key={person.id}
              coordinate={{ 
                latitude: 39.9845 + (Math.random() - 0.5) * 0.02,
                longitude: 116.3075 + (Math.random() - 0.5) * 0.02,
              }}
              title={person.name}
              description={`${person.position} - ${person.status}`}
              onPress={() => setSelectedPerson(person)}
            >
              <View style={[
                styles.markerContainer,
                { backgroundColor: person.status === '执勤中' ? '#10b981' : '#f59e0b' }
              ]}>
                <Text style={styles.markerText}>{person.name[0]}</Text>
              </View>
            </Marker>
          ))}
        </MapView>

        {/* 地图控制按钮 */}
        <View style={styles.mapControls}>
          <TouchableOpacity 
            style={styles.mapControlButton}
            onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
          >
            <Icon name={mapType === 'standard' ? 'satellite' : 'map'} size={18} color="#f8fafc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapControlButton}>
            <Icon name="location-arrow" size={18} color="#f8fafc" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 底部人员列表 */}
      <View style={styles.bottomPanel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>执勤人员 ({activePersonnel.length})</Text>
          <View style={styles.refreshButton}>
            <Icon name="sync-alt" size={14} color="#3b82f6" />
            <Text style={styles.refreshText}>实时刷新</Text>
          </View>
        </View>

        <View style={styles.personnelList}>
          {activePersonnel.map(person => (
            <TouchableOpacity
              key={person.id}
              style={[
                styles.personnelItem,
                selectedPerson?.id === person.id && styles.personnelItemSelected
              ]}
              onPress={() => setSelectedPerson(person)}
            >
              <View style={[
                styles.personnelAvatar,
                { backgroundColor: person.status === '执勤中' ? '#10b981' : '#f59e0b' }
              ]}>
                <Text style={styles.personnelAvatarText}>{person.name[0]}</Text>
              </View>
              <View style={styles.personnelInfo}>
                <Text style={styles.personnelName}>{person.name}</Text>
                <Text style={styles.personnelPosition}>{person.position}</Text>
              </View>
              <View style={styles.personnelStatus}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: person.status === '执勤中' ? '#10b981' : '#f59e0b' }
                ]} />
                <Text style={styles.statusText}>{person.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {selectedPerson && (
          <View style={styles.selectedPanel}>
            <View style={styles.selectedHeader}>
              <Text style={styles.selectedName}>{selectedPerson.name}</Text>
              <TouchableOpacity onPress={() => setSelectedPerson(null)}>
                <Icon name="times" size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            <View style={styles.selectedDetails}>
              <View style={styles.detailRow}>
                <Icon name="briefcase" size={14} color="#64748b" />
                <Text style={styles.detailText}>{selectedPerson.position}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="phone" size={14} color="#64748b" />
                <Text style={styles.detailText}>{selectedPerson.phone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="map-marker-alt" size={14} color="#64748b" />
                <Text style={styles.detailText}>{selectedPerson.workLocation}</Text>
              </View>
            </View>
            <View style={styles.selectedActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Icon name="phone" size={16} color="#3b82f6" />
                <Text style={styles.actionBtnText}>呼叫</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Icon name="comment" size={16} color="#3b82f6" />
                <Text style={styles.actionBtnText}>消息</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Icon name="history" size={16} color="#3b82f6" />
                <Text style={styles.actionBtnText}>轨迹</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#334155',
    marginLeft: 8,
  },
  headerButtonActive: {
    backgroundColor: '#3b82f620',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: width,
    height: '100%',
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomPanel: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.4,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshText: {
    fontSize: 12,
    color: '#3b82f6',
    marginLeft: 4,
  },
  personnelList: {
    padding: 16,
  },
  personnelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    marginBottom: 8,
  },
  personnelItemSelected: {
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  personnelAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personnelAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  personnelInfo: {
    flex: 1,
    marginLeft: 12,
  },
  personnelName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
  },
  personnelPosition: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  personnelStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  selectedPanel: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  selectedDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 8,
  },
  selectedActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#1e293b',
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 14,
    color: '#3b82f6',
    marginLeft: 6,
  },
});
