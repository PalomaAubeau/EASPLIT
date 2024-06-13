import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, Platform } from "react-native";
import { StyleSheet } from "react-native";

export default function EventCard({ event }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[
        styles.listCard,
        Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
      ]}
      onPress={() => navigation.navigate("Event", { eventId: event._id })}
    >
      <Text style={styles.textEventCard}>{event.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listCard: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: 5,
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
  textEventCard: {
    fontFamily: "CodecPro-ExtraBold",
    color: "#4E3CBB",
    fontSize: 16,
  },
});
