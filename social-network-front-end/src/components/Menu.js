import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Menu() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const groups = [
      { id: 1, title: "Web Developers Anonymous" },
      { id: 2, title: "UI/UX Designers" },
      { id: 3, title: "Product Managers" },
      { id: 4, title: "Data Scientists" },
    ];

    setGroups(groups);
  }, []);
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
              {groups.map((g) => (
                <Link to={`/groups/${g.id}`} key={g.id} className="list-group-item">{g.title}</Link>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Menu;
