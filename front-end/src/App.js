import { Outlet, useNavigate } from "react-router-dom"
import Chats from "./components/main/Chats"
import Footer from "./components/common/Footer"
import Header from "./components/common/Header"
import Menu from "./components/main/Menu"
import { useEffect, useState } from "react"

function App() {
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
    if (cookieSet && cookie === "") {
      navigate("/login")
    }
  }, [navigate, cookie, cookieSet])

  return (
    <div>
      <Header cookie={cookie} />
      <div className="container">
        <div className="row">
          <Menu cookie={cookie}/>
          <div className="col-md-6">
            <Outlet context={{ cookie, setCookie }} />
          </div>
          <Chats />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
