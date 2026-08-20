// components/MapModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useGameStore } from '../store/useGameStore';

interface MapModalProps {
  visible: boolean;
  onClose: () => void;
  currentLocationName: string;
}

const BLUEPRINT = [
  {
    floor: '1F (지상 구역)',
    grid: [
      [{ name: '1F 원무과 내부' }, { name: '1F 접수처 데스크' }, { name: null }, { name: null }],
      [{ name: '1F 대기실 소파' }, { name: '1F 텅 빈 로비' }, { name: '1F 메인 복도' }, { name: '1F 린넨실' }],
      [{ name: null }, { name: '1F 지상 로비 입구' }, { name: '1F 메인 엘리베이터' }, { name: null }],
      [{ name: null }, { name: '1F 로비 ➔ 정전 발발' }, { name: null }, { name: null }]
    ]
  },
  {
    floor: 'B1 (지하 관리 구역)',
    grid: [
      [{ name: 'B1 비밀 카지노' }, { name: 'B1 보일러실 지하통로' }, { name: null }, { name: null }]
    ]
  },
  {
    floor: 'B2 (특수 격리 구역)',
    grid: [
      [{ name: null }, { name: 'B2 특수 격리병동' }, { name: 'B2 붉은 신경가스 캡슐' }, { name: null }]
    ]
  },
  {
    floor: 'B3 (심층 연구동)',
    grid: [
      [{ name: null }, { name: 'B3 원무과 서버실' }, { name: 'B3 이카루스 핵심 연구실' }, { name: null }]
    ]
  }
];

export const MapModal: React.FC<MapModalProps> = ({ visible, onClose, currentLocationName }) => {
  const visitedLocations = useGameStore((state) => state.visitedLocations || []);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🗺️ 백야 요양원 설계도 (BLUEPRINT)</Text>
          </View>

          <ScrollView style={styles.mapScroll} showsVerticalScrollIndicator={false}>
            {BLUEPRINT.map((floorData, fIdx) => (
              <View key={fIdx} style={styles.floorSection}>
                <Text style={styles.floorTitle}>{floorData.floor}</Text>
                
                <View style={styles.blueprintGrid}>
                  {floorData.grid.map((row, rIdx) => (
                    <View key={rIdx} style={styles.row}>
                      {row.map((cell, cIdx) => {
                        // ⭐️ 빈 공간도 룸이랑 똑같은 크기(23.5%)를 강제로 차지하게 만듦
                        if (!cell.name) return <View key={cIdx} style={styles.emptyCell} />;

                        const isVisited = visitedLocations.includes(cell.name);
                        const isCurrent = cell.name === currentLocationName;
                        const displayName = cell.name.replace(/^(1F|B1|B2|B3) /, '');

                        return (
                          <View 
                            key={cIdx} 
                            style={[
                              styles.roomNode,
                              isVisited ? styles.visitedNode : styles.unknownNode,
                              isCurrent && styles.currentNode
                            ]}
                          >
                            {isCurrent && <View style={styles.currentPing} />}
                            <Text 
                              style={[
                                styles.roomText,
                                isVisited ? styles.visitedText : styles.unknownText,
                                isCurrent && styles.currentText
                              ]}
                              numberOfLines={2}
                            >
                              {isVisited || isCurrent ? displayName : '???'}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>지도 닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0, 0.85)', justifyContent: 'center', alignItems: 'center', padding: 10 },
  modalContent: { width: '100%', maxWidth: 500, maxHeight: '90%', backgroundColor: '#091524', borderRadius: 12, padding: 16, borderWidth: 2, borderColor: '#1E3A5F' },
  header: { borderBottomWidth: 1, borderColor: '#1E3A5F', paddingBottom: 12, marginBottom: 16 },
  headerTitle: { color: '#63B3ED', fontSize: 16, fontWeight: 'bold', textAlign: 'center', letterSpacing: 2 },
  
  mapScroll: { marginBottom: 10 },
  floorSection: { marginBottom: 24 },
  floorTitle: { color: '#90CDF4', fontSize: 14, fontWeight: 'bold', marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#63B3ED', paddingLeft: 8 },
  
  blueprintGrid: { backgroundColor: '#060D17', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#14273E', borderStyle: 'dashed' },
  
  // ⭐️ 핵심 수정: 가로 정렬을 꽉 채우고 빈 공간을 균등하게 배분
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  
  // ⭐️ 빈 셀과 룸 노드의 가로/세로 규격을 '완벽하게' 일치시킴
  emptyCell: { width: '23.5%', height: 64 },
  
  roomNode: { 
    width: '23.5%', 
    height: 64, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 4, 
    borderWidth: 1,
    padding: 2 
  },
  
  roomText: { textAlign: 'center', fontSize: 10, fontWeight: 'bold' },
  
  unknownNode: { backgroundColor: 'transparent', borderColor: '#14273E', borderStyle: 'dotted' },
  unknownText: { color: '#2C496A' },
  
  visitedNode: { backgroundColor: '#10233B', borderColor: '#2B6CB0', borderStyle: 'solid' },
  visitedText: { color: '#90CDF4' },
  
  currentNode: { backgroundColor: '#1A365D', borderColor: '#00E5FF', borderWidth: 2, shadowColor: '#00E5FF', shadowOpacity: 0.6, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
  currentText: { color: '#E0FFFF', fontSize: 11 },
  
  currentPing: { position: 'absolute', top: -4, right: -4, width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF4D4D', borderWidth: 1, borderColor: '#FFF' },

  closeBtn: { backgroundColor: '#1A365D', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#2B6CB0' },
  closeBtnText: { color: '#90CDF4', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
});