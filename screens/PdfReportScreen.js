import React, { useState } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import FileViewer from 'react-native-file-viewer'; // ensure installed

export default function PdfReportScreen({ route }) {
  const { reportData, patientName = 'Patient' } = route.params;
  const [loading, setLoading] = useState(false);

  const reportDate = new Date().toLocaleDateString();

  const createPDF = async () => {
    if (!reportData || reportData.length === 0) {
      Alert.alert('No data', 'No report data available to generate PDF');
      return null;
    }

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #2e7d32; margin-bottom: 0; }
            h3 { text-align: center; margin-top: 4px; color: #555; font-weight: normal; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            td b {
              color: #1565c0;
            }
          </style>
        </head>
        <body>
          <h1>Patient Health Report</h1>
          <h3>Patient: ${patientName} | Date: ${reportDate}</h3>
          <table>
            <tr>
              <th>Vital Type</th>
              <th>Value</th>
              <th>Timestamp</th>
            </tr>
            ${reportData
              .map(
                (item) => `
              <tr>
                <td><b>${item.type}</b></td>
                <td>${item.value}</td>
                <td>${new Date(item.timestamp).toLocaleString()}</td>
              </tr>`
              )
              .join('')}
          </table>
        </body>
      </html>
    `;

    try {
      const options = {
        html: htmlContent,
        fileName: 'Health_Report',
        directory: 'Documents',
      };
      const file = await RNHTMLtoPDF.convert(options);
      const filePath = Platform.OS === 'android' ? `file://${file.filePath}` : file.filePath;

      return filePath;
    } catch (err) {
      console.error('PDF generation error:', err);
      Alert.alert('Error', err.message || 'PDF generation failed');
      return null;
    }
  };

  const handleShare = async () => {
    setLoading(true);
    const filePath = await createPDF();
    if (!filePath) {
      setLoading(false);
      return;
    }

    try {
      await Share.open({
        title: 'Share Health Report',
        url: filePath,
        type: 'application/pdf',
        failOnCancel: false,
      });
    } catch (err) {
      if (err?.message !== 'User did not share') {
        Alert.alert('Sharing failed', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    setLoading(true);
    const filePath = await createPDF();
    if (!filePath) {
      setLoading(false);
      return;
    }

    try {
      if (!FileViewer || typeof FileViewer.open !== 'function') {
        Alert.alert('Unsupported', 'File preview not supported on this device.');
        return;
      }

      await FileViewer.open(filePath);
    } catch (err) {
      console.error('Preview error:', err);
      Alert.alert('Preview Failed', 'Unable to open PDF file. Try sharing instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handlePreview}>
            <Text style={styles.buttonText}>👁️ Preview PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#28a745' }]}
            onPress={handleShare}
          >
            <Text style={styles.buttonText}>📤 Generate & Share PDF Report</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


