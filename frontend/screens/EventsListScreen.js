import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { StyleSheet } from "react-native";
import globalStyles from "../styles/globalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import React from "react";
import Header from "../components/Common/Header";
import WelcomeTitle from "../components/Common/WelcomeTitle";
import TitleList from "../components/Common/TitleList";
import EventsList from "../components/EventsList";

export default function EventsListScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);

  return (
    <LinearGradient
      style={styles.container}
      colors={["white", "#CAD1E0"]}
      start={[0.2, 0.2]}
      end={[0.8, 0.8]}
    >
      <Header />
      <WelcomeTitle />
      <TitleList title="MES ÉVÉNEMENTS" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <EventsList user={user} />
      </ScrollView>

      <TouchableOpacity
        style={[styles.cardButton]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Ajouter")}
      >
        <LinearGradient
          colors={["#EB1194", "#4E3CBB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[globalStyles.gradientBackground]}
        >
          <View>
            <Text style={styles.textCardButton}>Ajouter un événenement</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
  },
  scrollView: {
    marginBottom: 20,
  },
  cardButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 50,
    marginHorizontal: 10,
  },
  textCardButton: {
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 16,
    padding: 15,
    color: "#fff",
    width: "100%",
    height: 60,
  },
});
