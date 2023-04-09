import React from "react"
import { Link, useOutletContext } from "react-router-dom"

function GroupHeader({ group }) {
  return (
    <div className="container">
      <div className="cover-container">
        <img
          className="cover-photo"
          src={`/group/${group.image}`}
          alt=""
          style={{
            height: "400px",
            width: "98%",
            objectFit: "cover",
          }}
        />
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-between align-items-center">
          <div className="profile-info">
            <h1>{group.title}</h1>
            <p>{group.description}</p>
          </div>
        </div>
        <div className="profile-buttons p-4">
          <button className="btn btn-primary">
            <box-icon name='plus' color="white" />
            Invite
          </button>
        </div>
      </div>
      <hr />

    </div>
  )
};

export default GroupHeader
