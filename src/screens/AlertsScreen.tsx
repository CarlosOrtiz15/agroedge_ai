import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AlertEvent, getAlertas, suscribirAlertas } from './Alerts';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const dos = (n: number) => String(n).padStart(2, '0');

function formatFecha(f: Date): string {
  const hora = `${dos(f.getHours())}:${dos(f.getMinutes())}`;
  const hoy = new Date();
  const ayer = new Date();
  ayer.setDate(hoy.getDate() - 1);

  const mismoDia = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (mismoDia(f, hoy)) return `Hoy, ${hora}`;
  if (mismoDia(f, ayer)) return `Ayer, ${hora}`;
  return `${f.getDate()} ${MESES[f.getMonth()]}, ${hora}`;
}

const getAlertInfo = (estado: number) => {
  switch (estado) {
    case 0:
      return { titulo: 'Óptimo', mensaje: 'Todo en orden.', color: colors.secondary, bg: 'rgba(95, 98, 39, 0.08)', icon: 'check-circle' as const };
    case 1:
      return { titulo: 'Riego', mensaje: 'Se activó el riego.', color: '#b87c00', bg: 'rgba(184, 124, 0, 0.08)', icon: 'water-drop' as const };
    default:
      return { titulo: 'Anomalía', mensaje: 'Comportamiento anómalo.', color: colors.error, bg: 'rgba(186, 26, 26, 0.08)', icon: 'error' as const };
  }
};

export default function AlertsScreen() {
  const [alertas, setAlertas] = useState<AlertEvent[]>(getAlertas());

  useEffect(() => {
    setAlertas(getAlertas());
    return suscribirAlertas(() => setAlertas(getAlertas()));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Eventos Edge AI</Text>
          <Text style={styles.subtitle}>Historial de detecciones locales</Text>
        </View>

        {alertas.length === 0 && (
          <Text style={styles.empty}>Aún no hay eventos. Aparecerán cuando el sensor envíe datos.</Text>
        )}

        {alertas.map((alert) => {
          const info = getAlertInfo(alert.estado);

          return (
            <TouchableOpacity key={alert.id} activeOpacity={0.8} style={styles.alertCard}>
              <View style={[styles.iconContainer, { backgroundColor: info.bg }]}>
                <MaterialIcons name={info.icon} size={35} color={info.color} />
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.alertHeader}>
                  <Text style={[styles.nodeName, { color: info.color }]}>{info.titulo}</Text>
                  <Text style={styles.timestamp}>{formatFecha(alert.fecha)}</Text>
                </View>
                <Text style={styles.message}>{info.mensaje}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 16 },
  header: { marginBottom: 24, marginTop: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.primary },
  subtitle: { fontSize: 14, color: colors.textMuted },
  empty: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: 40 },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#2d3b2d',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsContainer: { flex: 1 },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nodeName: { fontSize: 16, fontWeight: 'bold' },
  timestamp: { fontSize: 12, color: colors.textMuted },
  message: { fontSize: 14, color: colors.textMain, lineHeight: 20 },
});