import React, { useEffect, useState } from "react"
import Footer from "./common/Footer"
import Header from "./common/Header"
import ProfileHeader from "./profile/ProfileHeader"
import ProfileLeft from "./profile/ProfileLeft"
import ProfilePosts from "./profile/ProfilePosts"
import { useParams } from "react-router-dom"
import ErrorPage from "./common/ErrorPage"


function Profile() {
  const [profile, setProfile] = useState({})
  let { user_id } = useParams()
  const [error, setError] = useState(null)


  useEffect(() => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const requestOptions = {
      method: "GET",
      headers: headers,
    }

    fetch(`${process.env.REACT_APP_BACKEND}/user/${user_id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.message)
        }
        setProfile(data)
      })
      .catch((error) => {
        setError(error)
      })

  }, [])




  if (error) {
    return <><ErrorPage error={error} /></>
  } else {
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
}

export default Profile
