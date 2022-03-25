import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faCircle,
  faMoon,
  faXmark,
  faHeartCrack,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faDev } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import UpdateNameForm from "../forms/UpdateNameForm";

function Profile(props) {
  const [showEditNameForm, setShowEditNameForm] = useState(false);
  // Deletes token and refreshes the page to log user out.
  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="ProfileBackdrop">
      <div className="Profile">
        <ul className="topBar">
          <li onClick={() => props.setShowProfile(false)}>
            <FontAwesomeIcon icon={faCircleXmark} className="iconClose" />
          </li>
        </ul>

        <div className="profileInformation">
          <p className="profileImage">
            <FontAwesomeIcon icon={faCircle} style={{ fontSize: "150px" }} />
          </p>
          {/* <p>{props.user.fullName}</p> */}
          <section className="profileName">
            {showEditNameForm ? (
              <UpdateNameForm
                user={props.user}
                setUser={props.setUser}
                setShowEditNameForm={setShowEditNameForm}
              />
            ) : (
              <p>{props.user.fullName}</p>
            )}
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="editNameIcon"
              onClick={() => setShowEditNameForm(!showEditNameForm)}
            />
          </section>
          <p>({props.user.username})</p>
        </div>

        <nav className="profileButtons">
          <ul className="buttonList">
            <li>
              <FontAwesomeIcon className="buttonIcon" icon={faMoon} />
              <button>Toggle Dark Mode</button>
            </li>
            <li>
              <FontAwesomeIcon className="buttonIcon" icon={faHeartCrack} />
              <button>Report A Problem</button>
            </li>
            <li>
              <FontAwesomeIcon className="buttonIcon" icon={faXmark} />
              <button onClick={handleSignOut}>Log Out</button>
            </li>
          </ul>
        </nav>

        <ul className="socialsContainer">
          <li>
            <FontAwesomeIcon icon={faGithub} className="socialIcon" />
          </li>
          <li>
            <FontAwesomeIcon icon={faDev} className="socialIcon" />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;