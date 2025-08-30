import { BleManager } from "react-native-ble-plx";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { Buffer } from "buffer"; // npm install buffer

const manager = new BleManager();

export const scanAndFetchVitals = async (onSuccess) => {
  try {
    // Ask Bluetooth permissions on Android
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      if (
        granted["android.permission.ACCESS_FINE_LOCATION"] !== "granted" ||
        granted["android.permission.BLUETOOTH_SCAN"] !== "granted" ||
        granted["android.permission.BLUETOOTH_CONNECT"] !== "granted"
      ) {
        Alert.alert("Permission denied", "Bluetooth permissions are required.");
        return;
      }
    }

    // Start scanning for devices
    manager.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        console.error("Scan error:", error);
        Alert.alert("Scan failed", error.message);
        return;
      }

      if (device?.name && device.name.toLowerCase().includes("bp")) {
        manager.stopDeviceScan();
        const connected = await device.connect();
        await connected.discoverAllServicesAndCharacteristics();
        const services = await connected.services();

        for (let service of services) {
          const characteristics = await service.characteristics();
          for (let char of characteristics) {
            if (char.isReadable) {
              const data = await char.read();
              const decoded = Buffer.from(data.value, "base64").toString(
                "utf-8"
              );
              await connected.cancelConnection();
              onSuccess(decoded); // Send value back to caller
              return;
            }
          }
        }
        await connected.cancelConnection();
        Alert.alert("No data", "Could not read vitals from device.");
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
    
  } catch (e) {
    console.error("Bluetooth error:", e);
    Alert.alert("Bluetooth Error", e.message);
  }
};
