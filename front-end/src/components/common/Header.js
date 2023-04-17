import { Link, useNavigate } from "react-router-dom"
import Profile from "./../../images/profile.webp"
import { useState } from "react"
import NotificationsPopup from "./NotificationsPopup"

function Header({ cookie }) {
  const [notificationsShowing, setNotificationsShowing] = useState(false)
  // const toggleNotifications = () => {
  //   setNotificationsShowing(!notificationsShowing)
  // }
  const navigate = useNavigate()

  const logout = () => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", cookie)

    let requestOptions = {
      method: "POST",
      headers: headers,
    }
    fetch(`${process.env.REACT_APP_BACKEND}/logout`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
        } else {
          document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
          navigate("/login")
        }
      })
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Fatseebuuk
        </Link>
        <form className="d-flex mt-3" role="search">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasDarkNavbar"
          aria-controls="offcanvasDarkNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end text-bg-dark"
          tabIndex="-1"
          id="offcanvasDarkNavbar"
          aria-labelledby="offcanvasDarkNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
              Dark offcanvas
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#!">
                  Profile
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#!!">
                  <box-icon
                    color="white"
                    type="regular"
                    name="chat"
                  ></box-icon>
                </a>
              </li>
              <NotificationsPopup  />
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#!!"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img src={Profile} style={{ height: '30px', borderRadius: '50%', objectFit: 'cover' }} alt="profile pic" />
                </a>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <a className="dropdown-item" href="#!">
                      Action
                    </a>
                  </li>
                  <li>
                    <Link onClick={logout} className="dropdown-item" href="#!">
                      Logout
                    </Link>
                  </li>

                </ul>
              </li>
            </ul>

          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
