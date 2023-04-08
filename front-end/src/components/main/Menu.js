import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function Menu() {
  const [groups, setGroups] = useState([])

  useEffect(() => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

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
        console.log("seeerror", error)
      })
  }, [])
  return (
    <div className="col-md-3">
      <nav>
        <div className="list-group">
          <Link
            to="/friends"
            className="list-group-item list-group-item-action"
          >
            <h5 className="">Friends</h5>
          </Link>
          <div>
            <Link
              to="/groups"
              className="list-group-item list-group-item-action"
            >
              <h5 className="">Groups</h5>
            </Link>

            <ul className="list-group list-group-flush">
              {groups.map((group) => (
                <Link to={`/groups/${group.group_id}`} key={group.group_id} className="list-group-item">{group.title}</Link>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Menu
