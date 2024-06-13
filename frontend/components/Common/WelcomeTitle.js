import { useSelector } from "react-redux";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

const WelcomeTitle = () => {
  const user = useSelector((state) => state.user.value);
  return (
    <MaskedView
      style={{ flexDirection: "row" }}
      maskElement={
        <Text style={styles.titleText}>Bonjour {user.firstName}</Text>
      }
    >
      <LinearGradient
        colors={["#EB1194", "#4E3CBB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.linearGradient}
      />
    </MaskedView>
  );
};
const styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 0,
    height: 40,
    marginTop: 30,
    width: "100%",
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
    color: "white",
    marginTop: 20,
  },
});

export default WelcomeTitle;
