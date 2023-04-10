import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function NotificationsPopup() {
  const [notifications, setNotifications] = useState([]);

  //types are set according to boxicon names. subject_id is message_id or event_id etc
  const notificationsMockData = [
    {
      notification_id: 1,
      type: "message",
      subject_id: 1,
      user: {
        first_name: "Chad",
        last_name: "Smith",
        user_id: 1,
        profile_image: "chad.jpg",
      },
    }, // someone sent you a message
    {
      notification_id: 2,
      type: "like",
      subject_id: 3,
      user: {
        first_name: "Chad",
        last_name: "Smith",
        user_id: 1,
        profile_image: "chad.jpg",
      },
    }, // someone liked your post
    {
      notification_id: 3,
      type: "user-plus",
      subject_id: 1,
      user: {
        first_name: "Chad",
        last_name: "Smith",
        user_id: 1,
        profile_image: "chad.jpg",
      },
    }, // has a private profile and some other user sends him/her a following request
    {
      notification_id: 4,
      type: "calendar-plus",
      subject_id: 1,
      user: {
        first_name: "Chad",
        last_name: "Smith",
        user_id: 1,
        profile_image: "chad.jpg",
      },
    }, // receives a group invitation, so he can refuse or accept the request
    {
      notification_id: 5,
      type: "calendar-star",
      subject_id: 1,
      user: {
        first_name: "Chad",
        last_name: "Smith",
        user_id: 1,
        profile_image: "chad.jpg",
      },
    }, // is the creator of a group and another user requests to join the group, so he can refuse or accept the request
    {
      notification_id: 6,
      type: "calendar-exclamation",
      subject_id: 1,
      user: {
        first_name: "Chad",
        last_name: "Smith",
        user_id: 1,
        profile_image: "chad.jpg",
      },
    }, // is member of a group and an event is created
  ];

  useEffect(() => {
    setNotifications(notificationsMockData);
  }, [notifications]);

  return (
    <>
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle-no-arrow"
          href="#!!"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <box-icon color="white" type="regular" name="bell"></box-icon>
        </a>
        <ul className="dropdown-menu dropdown-menu">
          {notifications !== [] ? notifications.map((notification) => (
            <li>
              <Link to={"#!"} className="dropdown-item" href="#!">
                <box-icon
                  color="black"
                  type= "icon"
                  name={notification.type}
                ></box-icon>
                {notification.type}
              </Link>
            </li>
          )): <div>Nothing here</div>}
        </ul>
      </li>
    </>
  );
}

export default NotificationsPopup;
