import { KeyboardAvoidingView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Common/Header";
import WelcomeTitle from "../components/Common/WelcomeTitle";
import Icon from "react-native-vector-icons/Ionicons";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { getEventData } from "../utils/getEventData";
import Payment from "../components/EventScreenComponents/PaymentPart/Payment";
import Expense from "../components/EventScreenComponents/ExpensePart/Expense";

export default function EventScreen({ route, navigation }) {
  const { eventId } = route.params;
  const user = useSelector((state) => state.user.value);
  const isFocused = useIsFocused();
  const [event, setEvent] = useState({});
  const [selectedComponent, setSelectedComponent] = useState("expenses");
  const [hasPaid, setHasPaid] = useState(false);

  const handlePaymentStatusChange = () => {
    setHasPaid(true);
  };

  useEffect(() => {
    (async () => {
      const eventData = await getEventData(eventId);
      setEvent(eventData);
    })();
  }, [isFocused, hasPaid]);

  const renderSelectedComponent = () => {
    if (selectedComponent === "expenses") {
      return <Expense user={user} event={event} />;
    }
    return (
      <Payment
        user={user}
        event={event}
        navigation={navigation}
        onPaymentStatusChange={handlePaymentStatusChange}
      />
    );
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={["white", "#CAD1E0"]}
      start={[0.2, 0.2]}
      end={[0.8, 0.8]}
    >
      <Header />
      <WelcomeTitle />

      <TouchableOpacity
        style={styles.goback}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Mes événements")}
      >
        <Icon name="arrow-back" size={35} color="#4E3CBB"></Icon>
        <Text style={styles.textGoBack}>{event.name}</Text>
      </TouchableOpacity>

      <View style={styles.toggleSelection}>
        <Pressable
          style={[
            styles.button,
            selectedComponent === "expenses" && styles.selectedButton,
          ]}
          onPress={() => setSelectedComponent("expenses")}
        >
          <Text style={styles.textButton}>Toutes les dépenses</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            selectedComponent === "payments" && styles.selectedButton,
          ]}
          onPress={() => setSelectedComponent("payments")}
        >
          <Text style={styles.textButton}>Tous les paiements</Text>
        </Pressable>
      </View>
      <View style={{ flex: 1 }}>{renderSelectedComponent()}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  goback: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 15,
    marginBottom: 20,
  },
  toggleSelection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4E3CBB33",
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    paddingHorizontal: 10,
    width: "50%",
  },
  selectedButton: {
    backgroundColor: "#4E3CBB",
    borderRadius: 5,
  },

  textGoBack: {
    fontFamily: "CodecPro-ExtraBold",
    color: "#4E3CBB",
    fontSize: 20,
    marginLeft: 20,
  },
  textButton: {
    color: "#FFFFFF",
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 16,
    textAlign: "center",
  },
});
