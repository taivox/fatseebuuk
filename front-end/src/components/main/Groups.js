import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import CreateGroupPopup from "../group/CreateGroupPopup"

function Groups() {
  const [groups, setGroups] = useState([])
  const [createModalShowing, setCreateModalShowing] = useState(false)
  const [cookie, setCookie] = useState("");
  const [cookieSet, setCookieSet] = useState(false);

  const handleCreateGroupClick = () => {
    setCreateModalShowing(true)
  }

  const handleCreateGroupClose = () => {
    setCreateModalShowing(false)
  }

  useEffect(() => {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith("session=")) {
        setCookie(cookie.substring("session=".length))
        break;
      }
    }
    setCookieSet(true);
  }, []);

  useEffect(() => {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith("session=")) {
        setCookie(cookie.substring("session=".length))
        break;
      }
    }
    
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", cookie)

    const requestOptions = {
      method: "GET",
      headers: headers,
    }

    fetch(`${process.env.REACT_APP_BACKEND}/groups`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setGroups(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [cookie,setCookie])

  return (
    <>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title">Groups</h5>
          <button onClick={handleCreateGroupClick} className="btn btn-primary m-2"><box-icon name='plus' color="white" /> Create Group</button>
        </div>
        <div className="list-group">
          {groups.map(g => (
            <Link key={g.group_id} to={`/groups/${g.group_id}`} className="list-group-item list-group-item-action d-flex align-items-center">
              <img
                src={`/group/${g.image}`}
                style={{
                  height: "65px",
                  borderRadius: "20%",
                  objectFit: "cover",
                }}
                className="mr-3"
                alt="Group"
              />
              <div className="media-body m-3">
                <h4 className="mt-0">{g.title}</h4>
                <p className="mt-0">{g.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {createModalShowing && (
        <CreateGroupPopup
          onClose={handleCreateGroupClose}
        />
      )}

    </>
  )
}

export default Groups