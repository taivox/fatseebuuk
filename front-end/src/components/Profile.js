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
  const [cookie, setCookie] = useState("")
  const [cookieSet, setCookieSet] = useState(false)

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
    if (cookieSet) {
      const headers = new Headers()
      headers.append("Content-Type", "application/json")
      headers.append("Authorization", cookie)

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
          console.log(data)
          setProfile(data)
        })
        .catch((error) => {
          setError(error)
        })
    }
  }, [cookie, cookieSet, user_id])


  if (false) {
    return <><ErrorPage error={error} /></>
  } else {
    return (
      <div>
        <Header cookie={cookie} />

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
