import AsyncStorage from '@react-native-async-storage/async-storage';
import { client } from '../mqtt';

export interface AlertEvent {
  id: string;
  fecha: Date;
  estado: number; // 0 óptimo, 1 riego, 2 anomalía
}

const KEY = 'alertas_v1';
const MAX = 100;

let alertas: AlertEvent[] = [];
let ultimoEstado: number | null = null;
const listeners = new Set<() => void>();

const notificar = () => listeners.forEach(l => l());

const guardar = async () => {
  try {
    // Date se guarda como número (ms) para evitar problemas al reconstruirlo
    const plano = alertas.map(a => ({ id: a.id, t: a.fecha.getTime(), estado: a.estado }));
    await AsyncStorage.setItem(KEY, JSON.stringify(plano));
  } catch (e) {
    console.log('Error guardando alertas', e);
  }
};

const cargar = async () => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return;
    const plano: { id: string; t: number; estado: number }[] = JSON.parse(raw);
    const cargadas = plano.map(p => ({ id: p.id, fecha: new Date(p.t), estado: p.estado }));

    // Mezclar con las que pudieron llegar por MQTT mientras se leía el disco
    const ids = new Set(alertas.map(a => a.id));
    alertas = [...alertas, ...cargadas.filter(c => !ids.has(c.id))]
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
      .slice(0, MAX);

    // Retomar el último estado conocido para no duplicar la primera lectura
    if (ultimoEstado === null && alertas.length > 0) ultimoEstado = alertas[0].estado;
    notificar();
  } catch (e) {
    console.log('Error cargando alertas', e);
  }
};

cargar();

client.on('message', (topic, message) => {
  if (topic !== 'huerto/estado') return;
  try {
    const d = JSON.parse(message.toString());
    const estado = Number(d.estado);
    if (![0, 1, 2].includes(estado)) return;

    if (estado === ultimoEstado) return;
    ultimoEstado = estado;

    const fecha = new Date();
    alertas = [{ id: String(fecha.getTime()), fecha, estado }, ...alertas].slice(0, MAX);
    notificar();
    guardar();
  } catch (e) {
    console.log('JSON inválido en alertas', e);
  }
});

export const getAlertas = () => alertas;

export const suscribirAlertas = (l: () => void) => {
  listeners.add(l);
  return () => { listeners.delete(l); };
};

export const borrarAlertas = async () => {
  alertas = [];
  ultimoEstado = null;
  notificar();
  try { await AsyncStorage.removeItem(KEY); } catch {}
};