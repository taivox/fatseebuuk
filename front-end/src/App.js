import { Outlet, useNavigate } from "react-router-dom"
import Chats from "./components/main/Chats"
import Footer from "./components/common/Footer"
import Header from "./components/common/Header"
import Menu from "./components/main/Menu"
import { useEffect, useState } from "react"
import ChatWindow from "./components/common/ChatWindow"

function App() {
  const [cookie, setCookie] = useState("")
  const [cookieSet, setCookieSet] = useState(false)
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState({})
  const [friends, setFriends] = useState([])


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
    if (cookieSet && cookie === "") {
      navigate("/login")
    }
  }, [navigate, cookie, cookieSet])


  useEffect(()=>{
    if(cookieSet){
      const headers = new Headers()
        headers.append("Content-Type", "application/json")
        headers.append("Authorization", cookie)

        const requestOptions = {
          method: "GET",
          headers: headers,
        }
        fetch(
          `${process.env.REACT_APP_BACKEND}/friends`, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              console.log(data.error)
            }
            setFriends(data)

          }).catch((error) => { console.log(error) })
      }
    },[cookie])

  if (cookieSet){
    return (
      <div>
        <Header cookie={cookie} friends={friends} />
        <div className="container">
          <div className="row">
            <Menu cookie={cookie}/>
            <div className="col-md-6">
              <Outlet context={{ cookie, setCookie }} />
            </div>  
            <Chats friends={friends}/>
          </div>
        </div>
        <ChatWindow/>
        <Footer />
      </div>
    )
  }
}

export default App
