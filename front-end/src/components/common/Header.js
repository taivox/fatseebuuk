import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import NotificationsPopup from "./NotificationsPopup"
import Input from "../form/Input"
import Swal from "sweetalert2"
import ChatWindow from "./ChatWindow"

function Header({ cookie, friends }) {
  const [searchData, setSearchData] = useState([])
  const [search, setSearch] = useState("")
  const [filteredResults, setFilteredResults] = useState([])
  const [currentUser, setCurrentUser] = useState({})
  const [isPublic, setIsPublic] = useState(false)
  const [chatModalShowing, setChatModalShowing] = useState(true)
  const [showChat, setShowChat] = useState(false)

  const toggleChat = () => {
    setShowChat(!showChat)
  }

  const navigate = useNavigate()

  function calculateScore(searchTerm, result) {
    // Convert both strings to lowercase for case-insensitive comparison
    searchTerm = searchTerm.toLowerCase()
    result = result.toLowerCase()

    // Calculate the Levenshtein distance between the search term and the result
    let matrix = []
    for (let i = 0; i <= result.length; i++) {
      matrix[i] = [i]
      for (let j = 0; j <= searchTerm.length; j++) {
        matrix[0][j] = j
        if (i > 0 && j > 0) {
          let cost = result.charAt(i - 1) === searchTerm.charAt(j - 1) ? 0 : 1
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + cost
          )
        }
      }
    }
    // Return the Levenshtein distance as the score
    return matrix[result.length][searchTerm.length]
  }

  function filterResults(searchTerm) {
    setSearch(searchTerm)
    let tempResults = []
    for (let i = 0; i < searchData.users.length; i++) {

      let userName = searchData.users[i].first_name + " " + searchData.users[i].last_name

      let score = calculateScore(searchTerm, userName)
      if (score < 8) {
        // Only include results with a low score (less than 3 in this example)
        tempResults.push(searchData.users[i])
      }
    }
    setFilteredResults(tempResults)
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [cookie])

  const fetchCurrentUser = () => {
    if (cookie) {
      const headers = new Headers()
      headers.append("Content-Type", "application/json")
      headers.append("Authorization", cookie)

      const requestOptions = {
        method: "GET",
        headers: headers,
      }

      fetch(`${process.env.REACT_APP_BACKEND}/currentuser`, requestOptions)
        .then(response => response.status === 401 ? navigate('/login') : response.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.message)
          }
          setCurrentUser(data)
          setIsPublic(data.is_public)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  const changePrivacy = () => {
    if (cookie) {
      const headers = new Headers()
      headers.append("Content-Type", "application/json")
      headers.append("Authorization", cookie)

      let requestOptions = {
        method: "PATCH",
        headers: headers,
      }
      fetch(`${process.env.REACT_APP_BACKEND}/changeuserprivacy`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.log(data.error)
            Swal.fire({
              icon: 'error',
              title: 'Oops!',
              text: data.message,
            })
            return
          }
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `${isPublic ? 'Account change to Private' : 'Account change to Public'}`,
          })
          fetchCurrentUser()
        })
    }
  }

  const logout = () => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", cookie)

    let requestOptions = {
      method: "POST",
      headers: headers,
    }
    fetch(`${process.env.REACT_APP_BACKEND}/logout`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
        } else {
          document.cookie =
            "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
          navigate("/login")
        }
      })
  }

  useEffect(() => {
    if (cookie) {
      const headers = new Headers()
      headers.append("Content-Type", "application/json")
      headers.append("Authorization", cookie)

      let requestOptions = {
        method: "GET",
        headers: headers,
      }
      fetch(`${process.env.REACT_APP_BACKEND}/userssearch`, requestOptions)
        .then((response) =>
          response.status === 401 ? navigate("/login") : response.json()
        )
        .then((data) => {
          if (data.error) {
          } else {
            setSearchData(data)
          }
        })
    }
  }, [cookie])

  return (
    <>
      {currentUser.profile_image && (
        <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
          <div className="container">
            <Link to="/" className="navbar-brand">
              Fatseebuuk
            </Link>
            <div className="container d-flex justify-content-center">
              <div className="col-md-6">
                <Input
                  className="form-control"
                  type="text"
                  name={"search"}
                  placeholder={"Search"}
                  onChange={(event) => filterResults(event.target.value)}
                  autoComplete={"off"}
                />
                {search !== "" && (
                  <div className="card position-absolute " style={{ width: "18rem" }}>
                    <div className="card-header"><strong>Results</strong></div>
                    <ul className="list-group list-group-flush">
                      {filteredResults.length > 0 ? filteredResults.map(result => (
                        <li className="list-group-item">
                          <a href={`/profile/${result.user_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <img src={`/profileimages/${result.profile_image}`} alt={`${result.first_name} ${result.last_name}`} style={{ width: '45px', height: '45px', borderRadius: "100%", objectFit: "cover", paddingRight: "5px" }} />
                            {`${result.first_name} ${result.last_name}`}
                          </a>
                        </li>
                      )) : <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: '45px',
                        marginLeft: '10px',
                      }}>No results</div>
                      }
                    </ul>
                  </div>
                )}
              </div>
            </div>
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
                    <Link
                      className="nav-link"
                      to={`/profile/${searchData.user_id}`}
                    >
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#!!" onClick={() => setShowChat(true)}>
                      <box-icon color="white" type="regular" name="chat"></box-icon>
                    </a>
                  </li>
                  <NotificationsPopup />
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#!!"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={`/profileimages/${currentUser.profile_image}`}
                        style={{
                          height: "35px",
                          width: "35px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        alt=""
                      />
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                      <li>
                        <Link onClick={changePrivacy} className="dropdown-item" href="#!">
                          {isPublic ? "Make Profile Private" : "Make Profile Public"}
                        </Link>
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
            <ChatWindow show={showChat} setShow={toggleChat} cookie={cookie} friends={friends} />
          </div>
        </nav>
      )}
    </>
  )
}

export default Header
