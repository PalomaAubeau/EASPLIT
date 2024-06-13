import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import globalStyles from "../styles/globalStyles";
import Header from "../components/Common/Header";
import WelcomeTitle from "../components/Common/WelcomeTitle";
import TitleList from "../components/Common/TitleList";
import ReloadModal from "../components/HomeScreenComponents/ReloadModal";
import LastTransactions from "../components/HomeScreenComponents/LastTransaction";
import EventsList from "../components/EventsList";
import { useSelector, useDispatch } from "react-redux";
import { addBalance } from "../reducers/user";
import React, { useState } from "react";

export default function HomeScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  // Mise en place de props pour la modal de rechargement
  const handleBalance = (amount) => {
    dispatch(addBalance(amount));
  };

  //RETURN FINAL
  return (
    <LinearGradient
      style={styles.container}
      colors={["white", "#CAD1E0"]}
      start={[0.2, 0.2]}
      end={[0.8, 0.8]}
    >
      <Header />
      <WelcomeTitle />
      <ScrollView showsVerticalScrollIndicator={true}>
        <TitleList title="MON SOLDE" />
        <View
          style={[
            styles.balanceContainer,
            Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
          ]}
        >
          <Text style={styles.textBalanceContainer}>
            {user.balance > 0 ? user.balance.toFixed(2) : "0.00"}€
          </Text>
        </View>
        <View style={styles.reloadButton}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={globalStyles.buttonContainer}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#EB1194", "#4E3CBB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={globalStyles.gradientBackground}
            >
              <Text style={styles.reloadbuttonText}>Recharger</Text>
              <ReloadModal
                user={user}
                addBalance={handleBalance}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <TitleList title="MES DERNIÈRES TRANSACTIONS" />
        <LastTransactions user={user} />
        <TitleList title="MES DERNIERS ÉVÉNEMENTS" />
        <View>
          <EventsList user={user} isSlice>
            <TouchableOpacity
              style={[
                styles.seeMoreContainer,
                Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
              ]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Mes événements")}
            >
              <Text style={styles.textSeeMore}>voir plus</Text>
            </TouchableOpacity>
          </EventsList>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
  },
  balanceContainer: {
    backgroundColor: "#FFFFFF",
    color: "#4E3CBB",
    fontFamily: "CodecPro-Regular",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    height: 60,
  },
  reloadButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    marginTop: 10,
    marginRight: 10,
  },
  linearGradient: {
    borderRadius: 0,
    height: 40,
    marginTop: 30,
    width: "100%",
  },
  reloadbuttonText: {
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  seeMoreContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 10,
    height: 55,
  },
  shadowAndroid: {
    elevation: 6,
  },
  shadowIOS: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  textBalanceContainer: {
    color: "#4E3CBB",
    fontFamily: "CodecPro-ExtraBold",
    textAlign: "center",
    fontSize: 28,
  },
  textSeeMore: {
    color: "#EB1194",
    fontWeight: "bold",
  },
});
