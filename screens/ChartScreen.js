import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

export default function ChartScreen({ route }) {
  const userId = route?.params?.userId;
  const [bpData, setBpData] = useState([]);
  const [sugarData, setSugarData] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      Alert.alert('Missing User ID', 'User ID is not provided for chart view.');
      setLoading(false);
      return;
    }

    const fetchVitals = async () => {
      try {
        const res = await axios.get(`http://192.168.0.130:8080/api/vitals/${userId}`);
        const allVitals = res.data;

        const bp = [];
        const sugar = [];
        const weight = [];

        allVitals.forEach((vital) => {
          const date = new Date(vital.timestamp).toLocaleDateString();
          const value = vital.value;

          if (vital.type.toLowerCase() === 'bp') {
            const systolic = parseInt(value.split('/')[0]);
            if (!isNaN(systolic)) bp.push({ date, value: systolic });
          } else if (vital.type.toLowerCase() === 'sugar') {
            sugar.push({ date, value: parseInt(value) });
          } else if (vital.type.toLowerCase() === 'weight') {
            weight.push({ date, value: parseInt(value) });
          }
        });

        const sortByDate = (a, b) => new Date(a.date) - new Date(b.date);

        setBpData(bp.sort(sortByDate));
        setSugarData(sugar.sort(sortByDate));
        setWeightData(weight.sort(sortByDate));
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch vitals data');
      } finally {
        setLoading(false);
      }
    };

    fetchVitals();
  }, [userId]);

  const renderGraph = (title, data, color) => {
    if (data.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={{ textAlign: 'center', color: '#999' }}>No data available</Text>
        </View>
      );
    }

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.title}>{title}</Text>
        <LineChart
          data={{
            labels: data.map((d) => d.date),
            datasets: [{ data: data.map((d) => d.value) }],
          }}
          width={screenWidth - 20}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: () => color,
            labelColor: () => '#333',
            propsForDots: {
              r: '4',
              strokeWidth: '1',
              stroke: color,
            },
          }}
          style={styles.chart}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading charts...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {renderGraph('Blood Pressure (Systolic)', bpData, '#ff5252')}
      {renderGraph('Sugar Level', sugarData, '#00bcd4')}
      {renderGraph('Weight', weightData, '#4caf50')}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fefefe',
    flex: 1,
  },
  chartContainer: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#444',
    textAlign: 'center',
  },
  chart: {
    borderRadius: 10,
  },
});

