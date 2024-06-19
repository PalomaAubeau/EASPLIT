import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { getUserEvents } from "../utils/getUserEvents"; // import fonction pour le fetch
import EventCard from "./EventCard";
import { Text } from "react-native";
import { StyleSheet } from "react-native";

const EventsList = ({ children, user, isSlice = false }) => {
  // children: si dans composant parent, le composant enfant englobe autre autre chose, cet autre chose est le children et s'affiche uniquement dans le composant parent en question
  //isSlice est par défaut à false, si la props est dans le composant parent, alors il overwrite et passe à true
  const [eventsList, setEventsList] = useState([]);
  const isFocused = useIsFocused();

  const sliceList = (list) => {
    return list.slice(0, 2);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getUserEvents(user.token);
      const revertedEvents = [...events].reverse(); // Pour éviter les effets de bords avec la méthode .reverse(), bien garder [...events], plutôt que juste events.reverse()
      setEventsList(isSlice ? sliceList(revertedEvents) : revertedEvents);
    };

    fetchEvents();
  }, [isFocused]);

  // On pourrait avoir:
  // useEffect (() => {
  //     (async () => {
  //       const events = await getUserEvents(user.token);
  //       const revertedEvents = [...events].reverse();
  //       setEventsList(isSlice ? sliceList(revertedEvents) : revertedEvents);
  //     })();
  //   }, [isFocused]);

  return eventsList.length === 0 ? (
    <Text style={styles.message}>
      Aucun évènement à afficher pour le moment
    </Text>
  ) : (
    <>
      {eventsList.map((data) => (
        <EventCard key={data._id} event={data} />
      ))}
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  message: {
    fontFamily: "CodecPro-Regular",
    color: "#EB1194",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});

export default EventsList;
