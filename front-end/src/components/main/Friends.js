import { useEffect, useState } from "react"
import { Link, useOutletContext } from "react-router-dom"

function Friends() {
  const [friendList, setFriendList] = useState([])
  const { cookie } = useOutletContext()


  function AcceptFriendRequest(friendID) {
    console.log("Nyyd callis acceptfriend")
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", cookie)

    let requestOptions = {
      method: "POST",
      headers: headers,
    }
    fetch(
      `${process.env.REACT_APP_BACKEND}/friends/${friendID}/accept`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log("error tuli", data)
        } else {
          console.log("success tuli, friend on friends listi lisatud")
        // Call function to refetch friends list  onButtonClick()
        }
      })
  }

  function RemoveFriendRequest(friendID) {
    console.log("Nyyd callis removefriend")
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", cookie)

    let requestOptions = {
      method: "POST",
      headers: headers,
    }
    fetch(
      `${process.env.REACT_APP_BACKEND}/friends/${friendID}/remove`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log("error tuli", data)
        } else {
          console.log("success tuli. friend on listist remuuvitod")
        // Call function to refetch friends list  onButtonClick()
        }
      })
  }

  
  useEffect(() => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", cookie)

    let requestOptions = {
      method: "GET",
      headers: headers,
    }
    fetch(
      `${process.env.REACT_APP_BACKEND}/friends`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        setFriendList(data)
        console.log("friends list on set")
      })
  }, [cookie])


  return (
    <>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Friends</h5>
        </div>
        <div className="list-group">
          {friendList.map(f => (
            <div key={f.friend.user_id} className="list-group-item list-group-item-action d-flex align-items-center">
              <Link to={`/profile/${f.friend.user_id}`} className="Link d-flex align-items-center">
                <img
                  src={`profile/${f.friend.profile_image}`}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  className="mr-3"
                  alt="User avatar"
                />
                <div className="media-body m-3">
                  <h5 className="mt-0">{f.friend.first_name} {f.friend.last_name}</h5>
                </div>
              </Link>
              {f.request_pending && <div><button
              className="btn btn-light" onClick={() => AcceptFriendRequest(f.friend.user_id)}>
              
               <box-icon color="green" name="check" />
              </button>
                <button
                  className="btn btn-light" onClick={() => RemoveFriendRequest(f.friend.user_id)}
                >
                  <box-icon color="red" name="x" />
                </button></div>}
              {!f.request_pending && <div>
                <button
                  className="btn btn-light" onClick={() => RemoveFriendRequest(f.friend.user_id)}
                > Remove friend
                  <box-icon color="red" name="x" />
                </button></div>}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Friends
