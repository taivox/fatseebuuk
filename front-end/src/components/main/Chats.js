import React from "react";
import ChatWindow from "../common/ChatWindow"

function Chats({ friends }) {


  return (
    <div className="col-md-3">
      {/* <!-- Chats --> */}
      <div className="card mt-3">
        <div className="card-header">
          <h5 className="card-title">Chats</h5>
        </div>
        <div className="scrollable-list">
          <ul className="list-group list-group-flush">
            {friends && friends.length > 0 ? (
              friends.map((friend) => (
                <li key={friend.friend.user_id} className="list-group-item">
                  <span
                    // onClick={() => handleClick(friend)}
                    style={{ cursor: "pointer" }}
                  >
                    {`${friend.friend.first_name} ${friend.friend.last_name}`}
                  </span>
                </li>
              ))
            ) : (
              <li className="list-group-item">No friends, okay friends.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Chats;
