import { useEffect, useState } from "react"
import { Link, useNavigate, useOutletContext } from "react-router-dom"
import Swal from "sweetalert2"

function Friends() {
  const [friendList, setFriendList] = useState([])
  const { cookie } = useOutletContext()
  const navigate = useNavigate()


  function AcceptFriendRequest(friendID) {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", cookie)

    let requestOptions = {
      method: "POST",
      headers: headers,
    }
    fetch(
      `${process.env.REACT_APP_BACKEND}/friends/${friendID}/accept`, requestOptions)
      .then(response => response.status === 401 ? navigate('/login') : response.json())
      .then((data) => {
        if (data.error) {
          console.log("error:", data)
        } else {
          fetchFriendslist()
        }
      })
  }

  function RemoveFriendRequest(friendID) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove friend!",
    }).then((result) => {
      if (result.isConfirmed) {
        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        headers.append("Authorization", cookie)

        const requestOptions = {
          method: "POST",
          headers: headers,
        }
        fetch(
          `${process.env.REACT_APP_BACKEND}/friends/${friendID}/remove`, requestOptions)
          .then(response => response.status === 401 ? navigate('/login') : response.json())
          .then((data) => {
            if (data.error) {
              Swal.fire("Oops...", data.message, "error")
              return
            }
          }).catch((error) => { console.log(error) })
        Swal.fire("Done!", "You are no longer frein!", "success")
        fetchFriendslist()
      }
    })
  }


  useEffect(() => {
    fetchFriendslist()
  }, [cookie])

  const fetchFriendslist = () => {
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
      .then(response => response.status === 401 ? navigate('/login') : response.json())
      .then((data) => {
        setFriendList(data)
      })
  }


  return (
    <>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Friends</h5>
        </div>
        <div className="list-group">
          {friendList && friendList.length > 0 ? friendList.map(f => (
            <div key={f.friend.user_id} className="list-group-item list-group-item-action d-flex align-items-center">
              <Link to={`/profile/${f.friend.user_id}`} className="Link d-flex align-items-center">
                <img
                  src={`profileimages/${f.friend.profile_image}`}
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
          )) : <div className="m-2">You got no friends, buddy!</div>}
        </div>
      </div>
    </>
  )
}

export default Friends
