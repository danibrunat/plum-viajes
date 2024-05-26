import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  heading: {
    fontSize: 20,
    color: "pink",
  },
});

// Create Document Component
export const PDFDocument = ({ destination, departureDate }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Plum Viajes</Text>
          <Text>Destino: {destination}</Text>
        </View>
        <View style={styles.section}>
          <Text>Salida: {departureDate}</Text>
        </View>
      </Page>
    </Document>
  );
};
