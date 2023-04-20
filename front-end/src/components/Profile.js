import React, { useEffect, useState } from "react"
import Footer from "./common/Footer"
import Header from "./common/Header"
import ProfileHeader from "./profile/ProfileHeader"
import ProfileLeft from "./profile/ProfileLeft"
import ProfilePosts from "./profile/ProfilePosts"
import { useNavigate, useParams } from "react-router-dom"
import ErrorPage from "./common/ErrorPage"


function Profile() {
  const [profile, setProfile] = useState({})
  let { user_id } = useParams()
  const [error, setError] = useState(null)
  const [cookie, setCookie] = useState("")
  const [cookieSet, setCookieSet] = useState(false)
  const navigate = useNavigate()

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
      fetchProfileData()
    }
  }, [cookie, cookieSet, user_id])

  const fetchProfileData = () => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", cookie)

    const requestOptions = {
      method: "GET",
      headers: headers,
    }

    fetch(`${process.env.REACT_APP_BACKEND}/user/${user_id}`, requestOptions)
      .then(response => response.status === 401 ? navigate('/login') : response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.message)
        }
        console.log("seeonprofiledata",data)
        setProfile(data)
      })
      .catch((error) => {
        setError(error)
      })
  }




  if (false) {
    return <><ErrorPage error={error} /></>
  } else {
    return (
      <div>
        <Header cookie={cookie} />

        <ProfileHeader props={profile} cookie={cookie} onButtonClick={fetchProfileData} />
        <div>
          <div className="profile-content">
            <div className="container">
              <div className="row">
                <ProfileLeft props={profile} />
                <ProfilePosts props={profile} cookie={cookie} updatePosts={fetchProfileData}/>
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
