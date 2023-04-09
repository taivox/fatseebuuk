import { Outlet, useParams } from "react-router-dom"
import Footer from "./common/Footer"
import Header from "./common/Header"
import GroupHeader from "./group/GroupHeader"
import GroupMenu from "./group/GroupMenu"
import Chats from "./main/Chats"
import { useEffect, useState } from "react"
import ErrorPage from "./common/ErrorPage"


function Group() {
  const [group, setGroup] = useState({})
  const [groupPosts, setGroupPosts] = useState([])
  let { group_id } = useParams()
  const [error, setError] = useState(null)


  useEffect(() => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const requestOptions = {
      method: "GET",
      headers: headers,
    }
    fetch(`${process.env.REACT_APP_BACKEND}/groups/${group_id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.message)
        }
        setGroup(data)
        setGroupPosts(data.posts)
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
        {group && <GroupHeader group={group} />}
        <div className="container">
          <div className="row">
            <GroupMenu />
            <div className="col-md-6">
              {groupPosts.length > 0 && <Outlet context={{ groupPosts }} />}
            </div>
            <Chats />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Group