// components/JobSelectModal.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useGameStore, JobType } from '../store/useGameStore';

interface JobSelectModalProps {
  visible: boolean;
  onClose: () => void;
}

const JOBS: {
  id: JobType;
  title: string;
  emoji: string;
  advantage: string;
  penalty: string;
  route: string;
  color: string;
}[] = [
  {
    id: 'JOURNALIST',
    title: '탐사보도 기자',
    emoji: '📸',
    advantage: '차트/PC 해독 시 AP 0 소모, 심리 유도 대화지 활성화',
    penalty: '도주 및 몸싸움 성공률 극하, 피격 시 즉사 확률 대폭 증가',
    route: '원장실 및 행정 PC를 조기 해킹해 비리를 폭로하는 고발 루트',
    color: '#00E5FF',
  },
  {
    id: 'GAMBLER',
    title: '전직 타짜 (사채 추심원)',
    emoji: '🃏',
    advantage: 'B1 도박장 승률/배당 보정, 기습 피격 시 1회 반격 기절',
    penalty: '의학/전자기기 문서 판독 불가, 고급 약물 조합 불가',
    route: '지하 도박장을 털어 무전기를 탈취하고 무력 돌파하는 루트',
    color: '#E53E3E',
  },
  {
    id: 'RESEARCHER',
    title: '임상병리사 (화학 연구원)',
    emoji: '🧪',
    advantage: '약물 조합/시야 버프 획득, 신경가스/환각 상태 완전 면역',
    penalty: 'NPC 친화력 최하(대화 경계), 도박장에서 사기 간파 불가',
    route: '약제실을 해킹해 가스를 역살포하고 시스템을 마비시키는 루트',
    color: '#68D391',
  },
];

export const JobSelectModal: React.FC<JobSelectModalProps> = ({
  visible,
  onClose,
}) => {
  const selectedJob = useGameStore((state) => state.selectedJob);
  const setJob = useGameStore((state) => state.setJob);

  const handleSelectJob = (jobId: JobType) => {
    setJob(jobId);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>👤 직업 프로필 선택</Text>
            <Text style={styles.headerSub}>루프가 반복되어도 직업 특성은 영구 유지됩니다.</Text>
          </View>

          <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
            {JOBS.map((job) => {
              const isCurrent = selectedJob === job.id;

              return (
                <TouchableOpacity
                  key={job.id}
                  style={[
                    styles.jobCard,
                    { borderColor: isCurrent ? job.color : '#1E2638' },
                    isCurrent && styles.activeJobCard,
                  ]}
                  onPress={() => handleSelectJob(job.id)}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.emoji}>{job.emoji}</Text>
                    <View style={styles.titleBox}>
                      <Text style={[styles.jobTitle, { color: job.color }]}>
                        {job.title}
                      </Text>
                      {isCurrent && <Text style={styles.activeBadge}>선택됨</Text>}
                    </View>
                  </View>

                  <View style={styles.descBox}>
                    <Text style={styles.advantageText}>✨ 장점: {job.advantage}</Text>
                    <Text style={styles.penaltyText}>⚠️ 단점: {job.penalty}</Text>
                    <Text style={styles.routeText}>🎯 특화: {job.route}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>창 닫기</Text>
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
    maxWidth: 540,
    maxHeight: '85%',
    backgroundColor: '#0F131C',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2D3748',
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
  headerSub: {
    color: '#718096',
    fontSize: 12,
    marginTop: 4,
  },
  scrollList: {
    marginBottom: 12,
  },
  jobCard: {
    backgroundColor: '#151922',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
  },
  activeJobCard: {
    backgroundColor: '#1A2333',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 28,
    marginRight: 10,
  },
  titleBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  activeBadge: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: '#0A2533',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  descBox: {
    gap: 4,
  },
  advantageText: {
    color: '#90CDF4',
    fontSize: 12,
    lineHeight: 16,
  },
  penaltyText: {
    color: '#FEB2B2',
    fontSize: 12,
    lineHeight: 16,
  },
  routeText: {
    color: '#ECC94B',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
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