import { useState } from "react";
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
  activeFriendChat,
  toggleTheme,
  refreshFriendsInformation,
  setStoredJwt,
  setMobileSwapSection,
  setActiveFriendChat,
  setRoomSocket,
  myFriends,
}) {
  const [showProfile, setShowProfile] = useState(false);
  const [showAddFriends, setShowAddFriends] = useState(false);
  // Generate a collection of chat rows given the users friends.
  const sortedFriends = myFriends.friends;
  const chatRows = sortedFriends.map((chat) => {
    return (
      <ChatRow
        key={v4()}
        // If this current chat row is the current active one - background will be slightly different.
        activeStyle={
          activeFriendChat.friendUsername === chat.friend.username
            ? "activeChat"
            : ""
        }
        chat={chat}
        setMobileSwapSection={setMobileSwapSection}
        setActiveFriendChat={setActiveFriendChat}
        setRoomSocket={setRoomSocket}
      />
    );
  });

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
          sentFriendRequests={myFriends.sentFriendRequests}
          receivedFriendRequests={myFriends.receivedFriendRequests}
          refreshFriendsInformation={refreshFriendsInformation}
          setShowAddFriends={setShowAddFriends}
        />
      ) : null}
    </aside>
  );
}

export default MenuBar;
