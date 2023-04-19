import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
// import { BiMessageAdd, BiUserPlus } from "react-icons/bi";

function ProfileHeader({ props, cookie, onButtonClick }) {
  const navigate = useNavigate()


  function AddFriend() {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", cookie)

    let requestOptions = {
      method: "POST",
      headers: headers,
    }
    fetch(
      `${process.env.REACT_APP_BACKEND}/friends/${props.user_id}/add`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log("error tuli", data)
        } else {
          console.log("success tuli ja muuta nupp")
          onButtonClick()
        }
      })
  }

  function RemoveFriend() {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", cookie)

    let requestOptions = {
      method: "POST",
      headers: headers,
    }
    fetch(
      `${process.env.REACT_APP_BACKEND}/friends/${props.user_id}/remove`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log("error tuli", data)
        } else {
          console.log("success tuli ja muuta nupp")
          navigate(`/profile/${props.user_id}`)
          onButtonClick()
        }
      })
  }



  return (
    <div className="container">
      <div className="cover-container">
        <img
          className="cover-photo"
          src={`/cover/${props.cover_image}`}
          alt="cover"
          style={{
            height: "400px",
            width: "95%",
            objectFit: "cover",
          }} />
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-between align-items-center">
          <div className="profile-pic-container">
            <div className="profile-pic-wrapper">
              <img
                className="profile-pic m-3"
                src={`/profile/${props.profile_image}`}
                style={{
                  height: "155px",
                  width: "155px",
                  borderRadius: "100%",
                  objectFit: "cover",
                  zIndex: "99999",
                }}
                alt="profile" />
            </div>
          </div>
          <div></div>
          <div className="profile-info">
            <h1>{`${props.first_name} ${props.last_name}`} {props.nickname && `(${props.nickname})`}</h1>
            <div className="friend-info">
              <div className="friend-count">100 friends</div>
              <div className="friend-list">
                <img
                  className="friend-pic"
                  src="/profile/chad.jpg"
                  style={{
                    height: "55px",
                    width: "55px",
                    borderRadius: "100%",
                    objectFit: "cover",
                    zIndex: "99999",
                  }}
                  alt="profile" />
                <img
                  className="friend-pic"
                  src="/profile/chad.jpg"
                  style={{
                    height: "55px",
                    width: "55px",
                    borderRadius: "100%",
                    objectFit: "cover",
                    zIndex: "99999",
                  }}
                  alt="profile" />
                <img
                  className="friend-pic"
                  src="/profile/chad.jpg"
                  style={{
                    height: "55px",
                    width: "55px",
                    borderRadius: "100%",
                    objectFit: "cover",
                    zIndex: "99999",
                  }}
                  alt="profile" />
                <img
                  className="friend-pic"
                  src="/profile/chad.jpg"
                  style={{
                    height: "55px",
                    width: "55px",
                    borderRadius: "100%",
                    objectFit: "cover",
                    zIndex: "99999",
                  }}
                  alt="profile" />
                <img
                  className="friend-pic"
                  src="/profile/chad.jpg"
                  style={{
                    height: "55px",
                    width: "55px",
                    borderRadius: "100%",
                    objectFit: "cover",
                    zIndex: "99999",
                  }}
                  alt="profile" />
                <img
                  className="friend-pic"
                  src="/profile/chad.jpg"
                  style={{
                    height: "55px",
                    width: "55px",
                    borderRadius: "100%",
                    objectFit: "cover",
                    zIndex: "99999",
                  }}
                  alt="profile" />

              </div>
            </div>
          </div>
        </div>
        <div className="profile-buttons p-5">
          {props.friend_status && (
            <>
              <button className="btn btn-primary" onClick={props.friend_status === 1 ? AddFriend : RemoveFriend}>
                <box-icon name="user-plus" type="solid" />
                {props.friend_status === 1 ? 'Add Friend' : props.friend_status === 2 ? 'Request Pending' : 'Friends'}
              </button>
              <button className="btn btn-light">
                <box-icon name="chat" type="solid" />
                Message
              </button>
            </>
          )}
        </div>
      </div>
      <hr />
      <div className="d-flex align-content-between align-items-center">
        <Link
          className="list-group-item p-2"
        >
          Posts
        </Link>
        <Link
          className="list-group-item p-2"
        >
          About
        </Link>
        <Link
          className="list-group-item p-2"
        >
          Friends
        </Link>
        <Link
          className="list-group-item p-2"
        >
          Photos
        </Link>
      </div>
    </div>
  )
}

export default ProfileHeader
