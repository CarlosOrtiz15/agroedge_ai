import mqtt from 'mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
  clientId: 'app_huerto_' + Math.random().toString(16).slice(2, 8),
  reconnectPeriod: 3000,
});



client.on('connect', () => {
  console.log('Conectado a MQTT');
  client.subscribe('huerto/estado', (error) => {
    console.log(error ? 'Error al suscribir: ' + error : 'Suscrito al topic');
  });
});

client.on('error', (e) => console.log('Error MQTT:', e));
client.on('close', () => console.log('MQTT desconectado'));


export const vegetales: Record<string, number> = {
    'zanahoria': 0,
    'chile': 1,
    'papa': 2,
    'tomate': 3,
    'trigo': 4,
}

export const suelos: Record<string, number> = {
    'suelo aluvial': 0,
    'suelo negra': 1,
    'suelo calcareo': 2,
    'suelo arcillosa': 3,
    'suelo franco': 4,
    'suelo rojo': 5,
    'suelo arenoso': 6
}

export const etapas: Record<string, number> = {
    'floracion' : 0,
    'formacion': 1,
    'germinacion': 2,
    'cosecha': 3,
    'maduracion': 4,
    'polinizacion': 5,
    'plantula': 6,
    'desarrollo': 7
}