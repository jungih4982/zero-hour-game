import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  FIRST_DEATH_ID,
  LOCATION_1F_LOBBY,
  SCENE_LOBBY_2200,
  prologueScenes,
} from '../content/prologue';
import {
  LOOP_START_TIME,
  applyEffects,
  getAvailableChoices,
  resetLoop,
} from '../engine';
import type {
  GameTime,
  NarrativeChoice,
  NarrativeEngineState,
} from '../engine';

function createInitialState(): NarrativeEngineState {
  return {
    persistent: {
      loopCount: 1,
      clueIds: [],
      deductionIds: [],
      memories: [],
      deathIntel: [],
      deathRecords: [],
      flags: {},
    },
    volatile: {
      time: LOOP_START_TIME,
      currentSceneId: SCENE_LOBBY_2200,
      currentLocationId: LOCATION_1F_LOBBY,
      visitedSceneIds: [],
      itemIds: [],
      flags: {},
    },
  };
}

function formatGameTime(time: GameTime): string {
  const minutesInDay = 24 * 60;
  const absoluteMinutes = (22 * 60 + time) % minutesInDay;
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function NarrativeDebugPlayer() {
  const [state, setState] = useState<NarrativeEngineState>(createInitialState);
  const scene = prologueScenes[state.volatile.currentSceneId];
  const choices = getAvailableChoices(scene, state);
  const isDead = state.volatile.deathId !== undefined;
  const deathIntel = state.persistent.deathIntel.find(
    (intel) => intel.deathId === state.volatile.deathId,
  );

  const selectChoice = (choice: NarrativeChoice) => {
    setState((currentState) => {
      const afterChoice = applyEffects(currentState, choice.effects);
      const nextScene = prologueScenes[afterChoice.volatile.currentSceneId];
      return applyEffects(afterChoice, nextScene.onEnter ?? []);
    });
  };

  const returnToLoopStart = () => {
    setState((currentState) =>
      resetLoop(currentState, SCENE_LOBBY_2200, LOCATION_1F_LOBBY),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.debugLabel}>NARRATIVE DEBUG PLAYER</Text>

        <View style={styles.statusPanel}>
          <Text style={styles.statusText}>LOOP {state.persistent.loopCount}</Text>
          <Text style={styles.statusText}>TIME {formatGameTime(state.volatile.time)}</Text>
          <Text style={styles.statusText}>
            LOCATION {state.volatile.currentLocationId}
          </Text>
          <Text style={styles.sceneId}>SCENE {state.volatile.currentSceneId}</Text>
        </View>

        <View style={styles.scenePanel}>
          <Text style={styles.sceneTitle}>{scene.title}</Text>
          <Text style={styles.sceneBody}>{scene.body}</Text>
        </View>

        {isDead ? (
          <View style={styles.deathPanel}>
            <Text style={styles.deathTitle}>YOU DIED</Text>
            <Text style={styles.deathText}>
              사망 원인: {deathIntel?.description ?? FIRST_DEATH_ID}
            </Text>
            <Text style={styles.memoryHeading}>획득한 기억</Text>
            {state.persistent.memories.map((memory) => (
              <Text key={memory.id} style={styles.memoryText}>
                ◈ {memory.title}: {memory.description}
              </Text>
            ))}
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.resetButton}
              onPress={returnToLoopStart}
            >
              <Text style={styles.resetButtonText}>22:00으로 돌아간다</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.choicePanel}>
            <Text style={styles.choiceHeading}>선택지</Text>
            {choices.map((choice) => {
              const isForeknowledge = choice.kind === 'foreknowledge';
              return (
                <TouchableOpacity
                  accessibilityRole="button"
                  key={choice.id}
                  style={[
                    styles.choiceButton,
                    isForeknowledge && styles.foreknowledgeButton,
                  ]}
                  onPress={() => selectChoice(choice)}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      isForeknowledge && styles.foreknowledgeText,
                    ]}
                  >
                    {isForeknowledge ? '◈ ' : ''}
                    {choice.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#080a0f',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 18,
  },
  debugLabel: {
    color: '#697386',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  statusPanel: {
    borderColor: '#29303d',
    borderWidth: 1,
    padding: 14,
    gap: 5,
  },
  statusText: {
    color: '#c9d1dc',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  sceneId: {
    color: '#778298',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  scenePanel: {
    paddingVertical: 22,
    gap: 14,
  },
  sceneTitle: {
    color: '#f0f3f8',
    fontSize: 24,
    fontWeight: '700',
  },
  sceneBody: {
    color: '#c3cad5',
    fontSize: 17,
    lineHeight: 27,
  },
  choicePanel: {
    gap: 12,
  },
  choiceHeading: {
    color: '#8993a5',
    fontSize: 13,
    fontWeight: '700',
  },
  choiceButton: {
    backgroundColor: '#151922',
    borderColor: '#343c4b',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  foreknowledgeButton: {
    backgroundColor: '#18142a',
    borderColor: '#8f72d9',
  },
  choiceText: {
    color: '#e2e7ef',
    fontSize: 16,
    lineHeight: 23,
  },
  foreknowledgeText: {
    color: '#c7afff',
    fontWeight: '700',
  },
  deathPanel: {
    backgroundColor: '#190b0e',
    borderColor: '#722631',
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  deathTitle: {
    color: '#ff596d',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 2,
  },
  deathText: {
    color: '#efb5bc',
    fontSize: 15,
    lineHeight: 22,
  },
  memoryHeading: {
    color: '#a695cf',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  memoryText: {
    color: '#c7afff',
    fontSize: 14,
    lineHeight: 21,
  },
  resetButton: {
    backgroundColor: '#e7e9ee',
    marginTop: 8,
    padding: 15,
  },
  resetButtonText: {
    color: '#11141a',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
});
