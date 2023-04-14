import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function NotificationsPopup() {
  const [notifications, setNotifications] = useState([])
  const [cookie, setCookie] = useState("")
  const [cookieSet, setCookieSet] = useState(false)
  const [error, setError] = useState()

  //types are set according to boxicon names. subject_id is message_id or event_id etc
  const notificationsMockData = [
    {
      notification_id: 2,
      type: "like",
      boxicon_name: "like",
      subject_id: 3,
      from: {
        first_name: "Chad",
        last_name: "Smith",
        user_id: 1,
        profile_image: "chad.jpg",
      },
    }, // someone liked your post
    {
      notification_id: 3,
      type: "friend_request",
      boxicon_name: "user-plus",
      subject_id: 1,
      from: {
        first_name: "Chad",
        last_name: "Smith",
        user_id: 1,
        profile_image: "chad.jpg",
      },
    }, // has a private profile and some other user sends him/her a following request
    {
      notification_id: 4,
      type: "group_invite",
      boxicon_name: "calendar-plus",
      subject_id: 1,
      from: {
        first_name: "Chad",
        last_name: "Smith",
        user_id: 1,
        profile_image: "chad.jpg",
      },
    }, // receives a group invitation, so he can refuse or accept the request
    {
      notification_id: 5,
      type: "group_request",
      boxicon_name: "calendar-star",
      subject_id: 1,
      from: {
        first_name: "Chad",
        last_name: "Smith",
        user_id: 1,
        profile_image: "chad.jpg",
      },
    }, // is the creator of a group and another user requests to join the group, so he can refuse or accept the request
    {
      notification_id: 6,
      type: "event_created",
      boxicon_name: "calendar-plus",
      subject_id: 1,
      from: {
        first_name: "Chad",
        last_name: "Smith",
        user_id: 1,
        profile_image: "chad.jpg",
      },
    }, // is member of a group and an event is created
  ]
  
  const printNotification = (notification) => {
    let notificationContent = ""

    switch(notification.type){
      case "like":
        notificationContent = `${notification.from.first_name} ${notification.from.last_name} liked your content.`
        break
      case "group_invite":
        notificationContent = `${notification.from.first_name} ${notification.from.last_name} invited you to join a group.`
        break
      case "group_request":
        notificationContent = `${notification.from.first_name} ${notification.from.last_name} requested to join your group.`  
        break
      case "friend_request":
        notificationContent = `${notification.from.first_name} ${notification.from.last_name} has sent you a friend request.` 
        break
      case "event_created":
        notificationContent = `${notification.from.first_name} ${notification.from.last_name} has created an event for your group.` 
        break  
    }

    return notificationContent
  }



  useEffect(() => {
    let cookies = document.cookie.split(";")

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim()
      if (cookie.startsWith("session=")) {
        setCookie(cookie.substring("session=".length))
        break
      }
    }
    setCookieSet(true)
  }, [])

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", cookie);

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/notifications`, requestOptions);
        const data = await response.json();
        if (data.error) {
          throw new Error(data.message);
        }
        setNotifications(data);
        console.log(data);
      } catch (error) {
        setError(error);
      } finally {
        if (document.cookie.includes("session=")){
          setTimeout(fetchNotifications, 5000);
        }
      }
    };

    fetchNotifications();

  }, [cookie]);

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
        <ul className="dropdown-menu dropdown-menu-end" style={{ width: "250px"}}>
          {notifications.length > 0 ? notifications.map((notification) => (
            <li  key={notification.notification_id}>
              <Link to={notification.link} className="dropdown-item" href="#!">
                <div  className="d-flex">

                <img src={`profile/${notification.from.profile_image}`}
                className={"m-2"}
                  style={{
                    height: "45px",
                    width: "45px",
                    borderRadius: "100%",
                    objectFit: "cover",
                  }}
                  />
                <div>
                <box-icon
                  color="black"
                  type="icon"
                  name={notification.boxicons_name}
                  ></box-icon>
               <span style={{ whiteSpace: "normal", wordWrap: "break-word" }}> {printNotification(notification)}</span>
                </div>
                  </div>
              </Link>
            </li>
          )) : <div>No notifications</div>}
        </ul>
      </li>
    </>
  )
}

export default NotificationsPopup
