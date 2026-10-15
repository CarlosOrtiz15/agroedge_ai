import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import { colors } from '../theme/colors';
import NodeCard from '../components/NodeCard';
import { client, etapas, vegetales, suelos } from '../mqtt';

export interface Huerto {
  vegetal: string;
  suelo: string;
  etapa: string;
  humedadTierra: number;
  humedad: number;
  temperatura: number;
  estado: number;
}

function getStatus(status: number): string {
  if(status === 0) return 'Optimo';
  if(status === 1) return 'Riego';
  return 'Anomalía';
}

export default function DashboardScreen() {

  const [huerto, setHuerto] = useState<Huerto>({
   vegetal: '',
   suelo: '',
   etapa: '',
    humedadTierra: 0,
    humedad: 0,  
    temperatura: 0,
    estado: 0,
  });

  const configVegetal = (value: string) => {
    setHuerto({...huerto, vegetal: value})
    client.publish('huerto/config/vegetal', vegetales[value].toString());
  }
  const configSuelo = (value: string) => {
    setHuerto({...huerto, suelo: value})
    client.publish('huerto/config/suelo', suelos[value].toString());
  }
  const configEtapa = (value: string) => {
    setHuerto({...huerto, etapa: value})
    client.publish('huerto/config/etapa', etapas[value].toString());
  }

  useEffect(() => {
    const onMessage = (topic: string, message: Buffer) => {
      if (topic !== 'huerto/estado') return;
      try {
        const d = JSON.parse(message.toString());
        setHuerto({  
          vegetal: Object.keys(vegetales).find(k => vegetales[k] == d.vegetal) ?? '',
          suelo: Object.keys(suelos).find(k => suelos[k] == d.suelo) ?? '',
          etapa: Object.keys(etapas).find(k => etapas[k] == d.etapa) ?? '', 
          humedadTierra: d.humedadTierra,
          humedad: d.humedad,
          temperatura: d.temperatura,
          estado: d.estado
        })
      } catch (e) {
        console.log('JSON inválido', e);
      }
    };

    client.on('message', onMessage);
    return () => { client.off('message', onMessage); };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>AgroEdge AI</Text>
          <Text style={styles.subtitle}>Panel de Control Local</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>
            Estado del Huerto: {getStatus(huerto.estado)}
          </Text>
        </View>

        <NodeCard  temperatura={huerto.temperatura} humedad={huerto.humedad} humedadTierra={huerto.humedadTierra}  />

        {/* CONFIGURACIÓN DEL HUERTO */}
        <Text style={styles.sectionTitle}>
          Configuración del Huerto
        </Text>

        <View style={styles.configBox}>

          {/* Vegetal */}
          <Text style={styles.label}>Cultivo</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={huerto.vegetal}
              onValueChange={configVegetal}
            >
              <Picker.Item label="Jitomate" value="jitomate" />
              <Picker.Item label="Zanahoria" value="zanahoria" />
              <Picker.Item label="Trigo" value="trigo" />
              <Picker.Item label="Chile" value="chile" />
              <Picker.Item label="Papa" value="papa" />
            </Picker>
          </View>

          {/* Tipo de suelo */}
          <Text style={styles.label}>Tipo de suelo</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={huerto.suelo}
              onValueChange={configSuelo}
            >
              <Picker.Item
                label="Suelo negro"
                value="suelo negro"
              />
              <Picker.Item
                label="Suelo Aluvial"
                value="suelo aluvial"
              />
              <Picker.Item
                label="Suelo Calcareo"
                value="suelo calcareo"
              />
              <Picker.Item
                label="Suelo Arcilloso"
                value="suelo arcilloso"
              />
              <Picker.Item
                label="Suelo Franco"
                value="suelo franco"
              />
              <Picker.Item
                label="Suelo Rojo"
                value="suelo rojo"
              />
              <Picker.Item
                label="Suelo Arenoso"
                value="suelo arenoso"
              />
            </Picker>
          </View>

          {/* Etapa */}
          <Text style={styles.label}>Etapa de la planta</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={huerto.etapa}
              onValueChange={configEtapa}
            >
              <Picker.Item
                label="Floración"
                value="floracion"
              />
              <Picker.Item
                label="Formación del fruto"
                value="formacion"
              />
              
              <Picker.Item
                label="Germinación"
                value="germinacion"
              />
              
              <Picker.Item
                label="Cosecha"
                value="cosecha"
              />
              <Picker.Item
                label="Maduración"
                value="maduracion"
              />
              <Picker.Item
                label="Polinización"
                value="polinizacion"
              />
              <Picker.Item
                label="Plantula"
                value="plantula"
              />
              <Picker.Item
                label="Desarrollo de raiz"
                value="desarrollo"
              />
            </Picker>
          </View>

          {/* Resumen */}
          <View style={styles.selectedConfig}>
            <Text style={styles.selectedTitle}>
              Configuración actual
            </Text>

            <Text style={styles.selectedText}>
              Cultivo: {huerto.vegetal}
            </Text>

            <Text style={styles.selectedText}>
              Suelo: {huerto.suelo.replace('_', ' ')}
            </Text>

            <Text style={styles.selectedText}>
              Etapa: {huerto.etapa}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    padding: 16,
  },

  header: {
    marginBottom: 20,
    marginTop: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },

  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },

  summaryBox: {
    borderWidth: 2,
    borderColor: colors.primary,
    padding: 16,
    backgroundColor: colors.background,
    marginBottom: 24,
    alignItems: 'center',
    borderRadius: 12,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    marginTop: 8,
  },

  configBox: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.background,
    padding: 16,
    marginBottom: 24,
    borderRadius: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 6,
    marginTop: 10,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.background,
    marginBottom: 8,
  },

  selectedConfig: {
    marginTop: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.background,
    borderRadius: 8,
  },

  selectedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 6,
  },

  selectedText: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 3,
    textTransform: 'capitalize',
  },
});