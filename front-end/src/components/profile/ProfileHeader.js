import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
// import { BiMessageAdd, BiUserPlus } from "react-icons/bi";

function ProfileHeader({ props, cookie, onButtonClick }) {
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState()
  const MAX_FILE_SIZE = 10 * 1024 * 1024


  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select an image file',
      })
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setImagePreview(null)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'File size exceeds the limit of 10 MB!',
      })
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      setImagePreview(reader.result)
    }
  }

  useEffect(()=>{
    if(cookie){

      let payload = {
        image:imagePreview,
      }
  
      const headers = new Headers()
      headers.append("Content-Type", "application/json")
      headers.append("Authorization", cookie)
  
  
      let requestOptions = {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(payload)
      }
  
      console.log("SEENPAYLOAD: ",payload)
  
      fetch(
        `${process.env.REACT_APP_BACKEND}/addcover`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.log("error tuli", data)
          }
        })
    }
  },[imagePreview])

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
      {props.is_owner ? <> <label
         htmlFor="cover-photo"
         className="btn btn-light col-md-12"
         >
        <img
          className="cover-photo"
          src={imagePreview ? imagePreview:`/cover/${props.cover_image}`}
          alt="cover"
          style={{
            height: "400px",
            width: "95%",
            objectFit: "cover",
          }} />
            </label>
            <input onChange={handleImageUpload} type="file" className="form-control-file d-none" id="cover-photo" /> </>: <img
          className="cover-photo"
          src={`/cover/${props.cover_image}`}
          alt="cover"
          style={{
            height: "400px",
            width: "95%",
            objectFit: "cover",
          }} />}

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
              <div className="friend-count">{`${props.friends_list ? props.friends_list.length : `No friends, okay`} friends`}</div>
              <div className="friend-list">
                {props.friends_list && props.friends_list.length > 0 ? props.friends_list.slice(0,6).map(friend => (
                  <Link key={friend.friend.user_id} to={`/profile/${friend.friend.user_id}`}>
                  <img
                    className="friend-pic"
                    src={`/profile/${friend.friend.profile_image}`}
                    style={{
                      height: "55px",
                      width: "55px",
                      borderRadius: "100%",
                      objectFit: "cover",
                      zIndex: "99999",
                    }}
                    alt="profile" />
                  </Link>
                )):null}

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
