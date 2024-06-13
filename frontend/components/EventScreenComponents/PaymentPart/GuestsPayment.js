import { StyleSheet } from "react-native";
import globalStyles from "../../../styles/globalStyles";
import Icon from "react-native-vector-icons/Ionicons";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { PATH } from "../../../utils/path";
import { downBalance } from "../../../reducers/user";
import ReloadModal from "./ReloadModal";

const GuestsPayment = ({
  user,
  currentUser,
  otherGuests,
  navigation,
  event,
  onPaymentStatusChange,
}) => {
  const dispatch = useDispatch();
  const [errorMessage, seterrorMessage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setModalVisible(true);
    }
  }, [errorMessage]);

  const handlePayment = async () => {
    const paymentResponse = await fetch(`${PATH}/transactions/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "payment",
        token: user.token,
        eventId: event._id,
      }),
    });
    const paymentData = await paymentResponse.json();
    if (!paymentData.result) {
      seterrorMessage(paymentData.error);
    } else {
      dispatch(downBalance(paymentData.transactionSaved.amount));
      onPaymentStatusChange();
    }
  };

  return (
    <View>
      {currentUser && (
        <View
          style={[
            styles.listCard,
            Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
            styles.currentUserCard,
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.personIconContainer}>
              <Icon name="person" size={20} color="#4E3CBB"></Icon>
            </View>
            <Text style={[styles.textCurrentListCard, styles.currentUserText]}>
              MOI
            </Text>
          </View>

          {currentUser.hasPaid ? (
            <Icon name="checkmark-circle" size={25} color="#EB1194" />
          ) : (
            <View>
              <TouchableOpacity
                onPress={() => handlePayment()}
                style={styles.paymentCTAContainer}
                activeOpacity={0.8}
              >
                <View>
                  <Text style={globalStyles.buttonText}>Participer</Text>
                </View>
              </TouchableOpacity>
              {errorMessage && (
                <ReloadModal
                  navigation={navigation}
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                  errorMessage={errorMessage}
                  setErrorMessage={seterrorMessage}
                />
              )}
            </View>
          )}
        </View>
      )}

      {otherGuests.map((guest, i) => (
        <View
          key={i}
          style={[
            styles.listCard,
            Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.personIconContainer}>
              <Icon name="person" size={20} color="#4E3CBB"></Icon>
            </View>
            <View>
              <Text style={styles.textCurrentListCard}>
                {guest.userId.firstName}
              </Text>
              <Text style={styles.textSmallCurrentListCard}>
                {guest.userId.email}
              </Text>
            </View>
          </View>

          {guest.hasPaid ? (
            <Icon name="checkmark-circle" size={25} color="#EB1194" />
          ) : (
            <Icon name="checkmark-circle" size={25} color="#4E3CBB33" />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listCard: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    height: 60,
    marginHorizontal: 10,
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
  leftPartInsideCard: {
    flexDirection: "row",
    alignItems: "center",
  },

  // TEXTES
  textButton: {
    color: "#FFFFFF",
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 16,
    textAlign: "center",
  },
  textCurrentListCard: {
    fontFamily: "CodecPro-Regular",
    color: "#4E3CBB",
    fontSize: 16,
  },
  textAddingCard: {
    fontFamily: "CodecPro-ExtraBold",
    color: "#EB1194",
    fontSize: 16,
  },
  currentUserText: {
    fontFamily: "CodecPro-ExtraBold",
    color: "#4E3CBB",
    fontSize: 20,
  },
  textSmallCurrentListCard: {
    fontFamily: "CodecPro-Regular",
    color: "#4E3CBB",
    fontSize: 12,
  },
  // AUTRES
  personIconContainer: {
    backgroundColor: "#4E3CBB33",
    padding: 5,
    borderRadius: 50,
    marginRight: 10,
  },
  paymentCTAContainer: {
    backgroundColor: "#EB1194",
    paddingHorizontal: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GuestsPayment;

// const handlePayment = () => {
//   fetch(`${PATH}/transactions/payment`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       type: "payment",
//       token: user.token,
//       eventId: event._id,
//     }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (!data.result) {
//         seterrorMessage(data.error);
//       } else {
//         dispatch(downBalance(data.transactionSaved.amount));
//         updateStatus();
//         fetch(`${PATH}/events/${event._id}`)
//           .then((response) => response.json())
//           .then((data) => {
//             if (data.result) {
//               updateEvent(data.event);
//             }
//           });
//       }
//     });
// };
