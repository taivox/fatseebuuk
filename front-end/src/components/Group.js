import { Outlet, useParams } from "react-router-dom"
import Footer from "./common/Footer"
import Header from "./common/Header"
import GroupHeader from "./group/GroupHeader"
import GroupMenu from "./group/GroupMenu"
import Chats from "./main/Chats"
import { useEffect, useState } from "react"

function Group() {
  const [group, setGroup] = useState({})
  const [groupPosts, setGroupPosts] = useState([])
  let { group_id } = useParams()

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
        setGroup(data)
        setGroupPosts(data.posts)
      })
      .catch((error) => {
        console.log(error)
      })


  }, [])

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

export default Group