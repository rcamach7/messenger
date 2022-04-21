import { useState, useEffect } from "react";
import MenuBar from "../components/MenuBar";
import MessagesViewport from "../components/MessagesViewport";
import axios from "axios";

function Home({ toggleTheme, setStoredJwt }) {
  // User friend information
  const [friends, setFriends] = useState([]);
  const [receivedFriendRequests, setReceivedFriendRequests] = useState([]);
  const [sentFriendRequests, setSentFriendRequests] = useState([]);
  const [myFriends, setMyFriends] = useState({
    friends: [],
    receivedFriendRequests: [],
    sentFriendRequests: [],
  });

  // App functions
  const [mobileSwapSection, setMobileSwapSection] = useState(false);
  const [activeFriendChat, setActiveFriendChat] = useState({
    friendUsername: "",
    fullName: "",
    messages: [],
  });
  const [roomSocket, setRoomSocket] = useState(null);

  // Whenever we turn to our MenuBar displaying our friends, we will request another update to display the latest message.
  // Only while on mobile view since we swap display of components.
  useEffect(() => {
    if (!mobileSwapSection) {
      refreshFriendsInformation();
    }
  }, [mobileSwapSection]);

  // Get user specific friend info. Called on mount and when user receives a request or sends one out - to have UI reflect any changes visually.
  const refreshFriendsInformation = async () => {
    try {
      // De-construct specific fields we will receive when we get our response.
      const {
        data: { friends, receivedFriendRequests, sentFriendRequests },
      } = await axios.get(
        "https://mighty-depths-39289.herokuapp.com/users/friends"
      );
      // Set all appropriate response fields to state variables
      setFriends(friends);
      setReceivedFriendRequests(receivedFriendRequests);
      setSentFriendRequests(sentFriendRequests);
      setMyFriends({ friends, receivedFriendRequests, sentFriendRequests });
    } catch (error) {
      console.log(error);
    }
  };

  // On component mount, retrieve the users friends and set state variables.
  useEffect(() => {
    refreshFriendsInformation();
  }, []);

  useEffect(() => {
    console.log(myFriends);
  }, [myFriends]);

  return (
    <main className="Home">
      <MenuBar
        style={{ display: mobileSwapSection ? "none" : "flex" }}
        activeFriendChat={activeFriendChat}
        // To be removed
        friends={friends}
        receivedFriendRequests={receivedFriendRequests}
        sentFriendRequests={sentFriendRequests}
        // Replaced by
        myFriends={myFriends}
        toggleTheme={toggleTheme}
        refreshFriendsInformation={refreshFriendsInformation}
        // Props that set data
        setStoredJwt={setStoredJwt}
        setMobileSwapSection={setMobileSwapSection}
        setActiveFriendChat={setActiveFriendChat}
        setRoomSocket={setRoomSocket}
      />
      <MessagesViewport
        style={{ display: mobileSwapSection ? "block" : "none" }}
        activeFriendChat={activeFriendChat}
        roomSocket={roomSocket}
        // Props that set data
        toggleTheme={toggleTheme}
        refreshFriendsInformation={refreshFriendsInformation}
        setMobileSwapSection={setMobileSwapSection}
        setActiveFriendChat={setActiveFriendChat}
      />
    </main>
  );
}

export default Home;
