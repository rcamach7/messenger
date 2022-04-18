import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faBars,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import ChatRow from "./subComponents/ChatRow";
import Profile from "./subComponents/Profile";
import AddFriends from "./subComponents/AddFriends";

function MenuBar({
  style,
  friends,
  receivedFriendRequests,
  sentFriendRequests,
  toggleTheme,
  refreshFriendsInformation,
  setStoredJwt,
  setMobileSwapSection,
  setActiveFriendChat,
  setRoomSocket,
}) {
  const [showProfile, setShowProfile] = useState(false);
  const [showAddFriends, setShowAddFriends] = useState(false);
  // Generate a collection of chat rows given the users friends.
  const sortedFriends = friends;
  const chatRows = sortedFriends.map((chat) => {
    return (
      <ChatRow
        key={v4()}
        chat={chat}
        setMobileSwapSection={setMobileSwapSection}
        setActiveFriendChat={setActiveFriendChat}
        setRoomSocket={setRoomSocket}
      />
    );
  });

  useEffect(() => {
    // Organize chat rows anytime there is a change (a new message for example)
    // sortedFriends.sort((a, b) => a.messages[a.messages.length])
    if (sortedFriends.length > 0) {
      console.log(
        sortedFriends[0].messages[sortedFriends[0].messages.length - 1]
      );
    }
  }, [sortedFriends]);

  return (
    <aside className="MenuBar" style={style}>
      <nav className="navbar">
        <ul>
          <li>
            {
              <FontAwesomeIcon
                className="icon"
                icon={faBars}
                onClick={() => setShowProfile(true)}
              />
            }
          </li>
          <li>Friends</li>
          <li>
            {
              <FontAwesomeIcon
                className="icon"
                icon={faUserPlus}
                onClick={() => setShowAddFriends(true)}
              />
            }
          </li>
        </ul>
      </nav>

      {/* Main container that holds all different friends */}
      <div className="chatRowsContainer">{chatRows}</div>

      {/* Container that holds social icons */}
      <ul className="personalSocialsContainer">
        <li
          onClick={() => window.open("https://github.com/rcamach7", "_blank")}
        >
          <FontAwesomeIcon icon={faGithub} className="icon" />
        </li>
        <li
          onClick={() =>
            window.open("https://www.ricardo-camacho.dev/", "_blank")
          }
        >
          <FontAwesomeIcon icon={faBriefcase} className="icon" />
        </li>
        <li>
          <FontAwesomeIcon icon={faLinkedin} className="icon" />
        </li>
      </ul>

      {/* Hidden Tabs */}
      {showProfile ? (
        <Profile
          toggleTheme={toggleTheme}
          setStoredJwt={setStoredJwt}
          setShowProfile={setShowProfile}
        />
      ) : null}
      {showAddFriends ? (
        <AddFriends
          sentFriendRequests={sentFriendRequests}
          receivedFriendRequests={receivedFriendRequests}
          refreshFriendsInformation={refreshFriendsInformation}
          setShowAddFriends={setShowAddFriends}
        />
      ) : null}
    </aside>
  );
}

export default MenuBar;
