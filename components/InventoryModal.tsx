// components/InventoryModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useGameStore } from '../store/useGameStore';

interface InventoryModalProps {
  visible: boolean;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ visible, onClose }) => {
  const inventory = useGameStore((state) => state.inventory || []);

  const getItemDetails = (name: string) => {
    if (name.includes('사진')) return { icon: '📸', desc: '뒷면에 "사랑하는 오빠에게"라고 적혀 있다. 마음의 안정을 준다.' };
    if (name.includes('마스터키')) return { icon: '🔑', desc: '1F 린넨실 환풍구 등 잠긴 문을 열 수 있는 만능 열쇠.' };
    if (name.includes('무전기')) return { icon: '📻', desc: '경비대의 통신을 도청하여 동선을 파악할 수 있다.' };
    if (name.includes('진정제')) return { icon: '💊', desc: '세아의 끔찍한 발작을 멈추게 할 수 있는 화학 약물.' };
    if (name.includes('키카드')) return { icon: '💳', desc: 'B2 특수 격리병동으로 내려가는 보안 카드.' };
    return { icon: '📦', desc: '알 수 없는 물건.' };
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🎒 인벤토리 (소지품)</Text>
          </View>

          <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
            {inventory.length === 0 ? (
              <Text style={styles.emptyText}>가방이 비어있습니다.</Text>
            ) : (
              inventory.map((item, index) => {
                const details = getItemDetails(item);
                return (
                  <View key={index} style={styles.itemCard}>
                    <Text style={styles.itemIcon}>{details.icon}</Text>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item}</Text>
                      <Text style={styles.itemDesc}>{details.desc}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>가방 닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    backgroundColor: '#0F131C',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#4A5568',
  },
  header: {
    borderBottomWidth: 1,
    borderColor: '#2D3748',
    paddingBottom: 10,
    marginBottom: 12,
  },
  headerTitle: {
    color: '#EDF2F7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollList: {
    marginBottom: 12,
  },
  emptyText: {
    color: '#718096',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#1A202C',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2D3748',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#90CDF4',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDesc: {
    color: '#CBD5E0',
    fontSize: 12,
    lineHeight: 16,
  },
  closeBtn: {
    backgroundColor: '#2D3748',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#EDF2F7',
    fontWeight: 'bold',
    fontSize: 13,
  },
});