import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

function Friends() {
  const [friendList, setFriendList] = useState([]);
  const { cookie } = useOutletContext()

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", cookie);

    let requestOptions = {
      method: "GET",
      headers: headers,
    };
    fetch(
      `${process.env.REACT_APP_BACKEND}/friends`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("seeondata", data);
        setFriendList(data)
        if (data.error) {
          console.log("error tuli", data);
        } else {
          console.log("success tuli ja muuta nupp mittekatiivseks");
        }
      });
  },[cookie])

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Friends</h5>
        </div>
        <div className="list-group">
            {friendList.map(f => (
          <div key={f.friend.user_id}  className="list-group-item list-group-item-action d-flex align-items-center">
            <Link to={`/profile/${f.friend.user_id}`} className="Link d-flex align-items-center">
            <img
              src={`profile/${f.friend.profile_image}`}
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
              <h5 className="mt-0">{f.friend.first_name} {f.friend.last_name}</h5>
            </div>
            </Link>
              {f.request_pending && <div><button
                      className="btn btn-light"
                    >
                      <box-icon color="green" name="check" />
                    </button>
                    <button
                      className="btn btn-light"
                    >
                      <box-icon color="red" name="x" />
                    </button></div>}
          </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Friends;
