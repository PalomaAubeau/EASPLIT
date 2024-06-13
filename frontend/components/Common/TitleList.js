import { Text } from "react-native";
import { StyleSheet } from "react-native";

const TitleList = ({ title }) => {
  return <Text style={styles.titleList}>{title}</Text>;
};

const styles = StyleSheet.create({
  titleList: {
    fontFamily: "CodecPro-ExtraBold",
    marginTop: 10,
    marginLeft: 10,
    color: "#4E3CBB",
    fontSize: 20,
  },
});

export default TitleList;
