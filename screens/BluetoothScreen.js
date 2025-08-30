// BluetoothScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Button,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

export default function BluetoothScreen({ navigation }) {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    return () => {
      manager.destroy();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return (
        granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted' &&
        granted['android.permission.BLUETOOTH_SCAN'] === 'granted' &&
        granted['android.permission.BLUETOOTH_CONNECT'] === 'granted'
      );
    }
    return true;
  };

  const scanAndFetchVitals = async () => {
    const permission = await requestPermissions();
    if (!permission) {
      Alert.alert('Permission required', 'Please allow Bluetooth permissions');
      return;
    }

    setDevices([]);
    setScanning(true);

    manager.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        Alert.alert('Error', 'Failed to scan for devices');
        setScanning(false);
        return;
      }

      if (device && device.name && !devices.find((d) => d.id === device.id)) {
        console.log('Discovered:', device.name);
        setDevices((prev) => [...prev, device]);
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 10000);
  };

  const connectToDevice = async (device) => {
    try {
      setScanning(true);
      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();

      const services = await connected.services();

      for (let service of services) {
        const characteristics = await service.characteristics();

        for (let char of characteristics) {
          if (char.isReadable) {
            const data = await char.read();
            const value = Buffer.from(data.value, 'base64').toString('utf8');

            Alert.alert('Vitals Read', `Value from ${device.name}: ${value}`);
            await connected.cancelConnection();
            setScanning(false);
            return;
          }
        }
      }

      Alert.alert('No readable data', 'Could not find readable characteristics.');
      await connected.cancelConnection();
    } catch (err) {
      console.error('Connection error:', err);
      Alert.alert('Error', 'Failed to connect to device');
    } finally {
      setScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📱 Bluetooth Vitals Reader</Text>

      <TouchableOpacity style={styles.scanButton} onPress={scanAndFetchVitals} disabled={scanning}>
        <Text style={styles.scanText}>{scanning ? 'Scanning...' : 'Scan for Devices'}</Text>
      </TouchableOpacity>

      {scanning && <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 10 }} />}

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.deviceCard} onPress={() => connectToDevice(item)}>
            <Text style={styles.deviceName}>{item.name || 'Unnamed Device'}</Text>
            <Text style={styles.deviceId}>{item.id}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff',
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deviceCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceId: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});
