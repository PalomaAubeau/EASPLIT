import { ScrollView, View } from "react-native";
import TitleList from "../../Common/TitleList";
import RecapPayment from "./RecapPayment";
import GuestsPayment from "./GuestsPayment";

export default function Payment({
  user,
  event,
  navigation,
  onPaymentStatusChange,
}) {
  const currentUser = event.guests.find(
    (guest) =>
      guest.userId.email === user.email &&
      guest.userId.firstName === user.firstName
  );

  const otherGuests = event.guests.filter(
    (guest) =>
      guest.userId.email !== user.email &&
      guest.userId.firstName !== user.firstName
  );

  return (
    <View>
      <TitleList title="RÉCAPITULATIF DES FONDS" />
      <RecapPayment user={currentUser} event={event} />
      <TitleList title="STATUT DES RÉGLEMENTS" />
      <View style={{ height: 280 }}>
        <ScrollView showsVerticalScrollIndicator={true}>
          <GuestsPayment
            user={user}
            currentUser={currentUser}
            otherGuests={otherGuests}
            navigation={navigation}
            event={event}
            onPaymentStatusChange={onPaymentStatusChange}
          />
        </ScrollView>
      </View>
    </View>
  );
}
