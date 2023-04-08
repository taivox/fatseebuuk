import React, { useEffect, useState } from "react"
import Footer from "./common/Footer"
import Header from "./common/Header"
import ProfileHeader from "./profile/ProfileHeader"
import ProfileLeft from "./profile/ProfileLeft"
import ProfilePosts from "./profile/ProfilePosts"
import { useParams } from "react-router-dom"

function Profile() {
  const [profile, setProfile] = useState({})
  let { id } = useParams()

  useEffect(() => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const requestOptions = {
      method: "GET",
      headers: headers,
    }

    fetch(`${process.env.REACT_APP_BACKEND}/user/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setProfile(data)
      })
      .catch((error) => {
        console.log(error)
      })

  }, [id])

  return (

    <div>
      <Header />

      <ProfileHeader props={profile} />
      <div>
        <div className="profile-content">
          <div className="container">
            <div className="row">
              <ProfileLeft props={profile} />
              <ProfilePosts props={profile} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Profile
