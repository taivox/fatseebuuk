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
  let { id } = useParams()

  useEffect(() => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const requestOptions = {
      method: "GET",
      headers: headers,
    }
    fetch(`${process.env.REACT_APP_BACKEND}/groups/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setGroup(data)
        setGroupPosts(data.posts)
      })
      .catch((error) => {
        console.log("seeerror", error)
      })


  }, [id])

  return (
    <div>
      <Header />
      <GroupHeader />
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