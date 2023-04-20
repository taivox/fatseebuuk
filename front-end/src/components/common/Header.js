import { Link, useNavigate } from "react-router-dom";
import Profile from "./../../images/profile.webp";
import { useEffect, useState } from "react";
import NotificationsPopup from "./NotificationsPopup";
import Input from "../form/Input";

function Header({ cookie }) {
  const [notificationsShowing, setNotificationsShowing] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  // const toggleNotifications = () => {
  //   setNotificationsShowing(!notificationsShowing)
  // }
  const navigate = useNavigate();

  function calculateScore(searchTerm, result) {
    // Convert both strings to lowercase for case-insensitive comparison
    searchTerm = searchTerm.toLowerCase();
    result = result.toLowerCase();
  
    // Calculate the Levenshtein distance between the search term and the result
    let matrix = [];
    for (let i = 0; i <= result.length; i++) {
      matrix[i] = [i];
      for (let j = 0; j <= searchTerm.length; j++) {
        matrix[0][j] = j;
        if (i > 0 && j > 0) {
          let cost = result.charAt(i - 1) === searchTerm.charAt(j - 1) ? 0 : 1;
          matrix[i][j] = Math.min(
            matrix[i-1][j] + 1,
            matrix[i][j-1] + 1,
            matrix[i-1][j-1] + cost
          );
        }
      }
    }
    // Return the Levenshtein distance as the score
    return matrix[result.length][searchTerm.length];
  }
  
  function filterResults(searchTerm) {
    setSearch(searchTerm)
    let tempResults = []
    for (let i = 0; i < searchData.users.length; i++) {
      
      let userName = searchData.users[i].first_name + " " + searchData.users[i].last_name

      let score = calculateScore(searchTerm, userName);
      if (score < 8) {
        // Only include results with a low score (less than 3 in this example)
        tempResults.push(searchData.users[i]);
      }
    }
    setFilteredResults(tempResults);
    console.log(filteredResults);
  }


  const logout = () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", cookie);

    let requestOptions = {
      method: "POST",
      headers: headers,
    };
    fetch(`${process.env.REACT_APP_BACKEND}/logout`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
        } else {
          document.cookie =
            "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
          navigate("/login");
        }
      });
  };

  useEffect(() => {
    if (cookie) {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", cookie);

      let requestOptions = {
        method: "GET",
        headers: headers,
      };
      fetch(`${process.env.REACT_APP_BACKEND}/users-search`, requestOptions)
        .then((response) =>
          response.status === 401 ? navigate("/login") : response.json()
        )
        .then((data) => {
          if (data.error) {
          } else {
            //TODO: data to search bar and link to profile
            setSearchData(data);
            console.log(data);
          }
        });
    }
  }, [cookie]);

  return (
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
                <li className="list-group-item">{`${result.first_name} ${result.last_name}`}</li>
              )) :<div>No results</div>}
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
                <a className="nav-link" href="#!!">
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
                    src={Profile}
                    style={{
                      height: "30px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    alt="profile pic"
                  />
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
  );
}

export default Header;
