import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"

function NotificationsPopup() {
  const [notifications, setNotifications] = useState([])
  const [cookie, setCookie] = useState("")
  const [cookieSet, setCookieSet] = useState(false)
  const [error, setError] = useState()
  const [notificationsAmount, setNotificationsAmount] = useState(999999)
  const notificationsAmountRef = useRef(notificationsAmount);
  
  
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
      default:
          // Do nothing
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
  if(cookieSet){
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", cookie);

      const requestOptions = {
        method: "GET",
        headers: headers,
      };

      let url = `${process.env.REACT_APP_BACKEND}/notifications?notificationsAmount=${notificationsAmount}`

      const fetchNotifications = async () => {
        try {
          const response = await fetch(url, requestOptions);
          const data = await response.json();
          if (data === null){
            setNotificationsAmount(0)
            notificationsAmountRef.current = 0;
          }
          if (data.error) {
            throw new Error(data.message);
          }
          setNotifications(data);
          setNotificationsAmount(data.length);
          notificationsAmountRef.current = data.length;
        } catch (error) {
          setError(error);
        } finally {
          url = `${process.env.REACT_APP_BACKEND}/notifications?notificationsAmount=${notificationsAmountRef.current}`;
          if (document.cookie.includes("session=")) {
            setTimeout(fetchNotifications, 25000);
          }
        }
      };
      fetchNotifications();
    }
  }, [cookie, setCookie]);

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
                  alt=""
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
