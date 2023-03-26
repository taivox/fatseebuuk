import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Friends() {
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const friends = [
        {id:1,firstName: "John", lastName: "Doe", image:"/chad.jpg"},
        {id:2,firstName: "Dora", lastName: "Explorer", image:"/dota.jpg"},
        {id:3,firstName: "Peppa", lastName: "Pug", image:"/peppa.jpg"},
        {id:4,firstName: "Tom", lastName: "the Myspace Guy", image:"/tom.webp"},
        {id:5,firstName: "Steve", lastName: "Scumbag", image:"/scumbag.jpg"},
    ]

    setFriendList(friends)
  },[])

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Friends</h5>
        </div>
        <div className="list-group">
            {friendList.map(f => (
          <Link key={f.id} to={`/profile/${f.id}`} className="list-group-item list-group-item-action d-flex align-items-center">
            <img
              src={`profile/${f.image}`}
              style={{
                height: "60px",
                width: "60px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              className="mr-3"
              alt="User avatar"
            />
            <div className="media-body m-3">
              <h5 className="mt-0">{f.firstName} {f.lastName}</h5>
            </div>
          </Link>
            ))}
        </div>
      </div>
    </>
  );
}

export default Friends;
