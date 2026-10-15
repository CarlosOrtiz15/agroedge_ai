import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Huerto } from '../screens/DashBoardScreen'; 


export default function NodeCard(status: Partial<Huerto>) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.nodeName}>Sensor</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.sensorBox}>
          <MaterialIcons name="thermostat" size={24} color={colors.textMuted} />
          <View>
            <Text style={styles.sensorValue}>{status.temperatura}°C</Text>
            <Text style={styles.sensorLabel}>Temperatura</Text>
          </View>
        </View>

        <View style={styles.sensorBox}>
          <MaterialIcons name="opacity" size={24} color={colors.textMuted} />
          <View>
            <Text style={styles.sensorValue}>{status.humedadTierra}%</Text>
            <Text style={styles.sensorLabel}>Humedad en tierra</Text>
          </View>
        </View>
      </View>
      <View style={styles.sensorBox}>
          <MaterialIcons name="opacity" size={24} color={colors.textMuted} />
          <View>
            <Text style={styles.sensorValue}>{status.humedad}%</Text>
            <Text style={styles.sensorLabel}>Humedad en aire</Text>
          </View>
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderColor: '#2d3b2d',
    padding: 12,
    backgroundColor: '#f6f3ea', // surface-container-low del HTML
    borderRadius: 4,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nodeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  nodeId: {
    fontSize: 12,
    color: colors.textMuted,
    opacity: 0.7,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  batteryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  sensorBox: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#2d3b2d',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
  },
  sensorValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  sensorLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  predictionBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: 10,
    borderRadius: 2,
  },
  predictionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  predictionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#2d3b2d',
    opacity: 0.1,
    marginVertical: 6,
  },
  estadoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: colors.textMain,
  },
});