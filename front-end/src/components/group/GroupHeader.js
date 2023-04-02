import React from "react";
import { Link } from "react-router-dom";
// import { BiMessageAdd, BiUserPlus } from "react-icons/bi";

function GroupHeader() {
  return (
    <div className="container">
      <div className="cover-container">
        <img
          className="cover-photo"
          src="/cover/productman.jpg"
          alt="cover"
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
            <h1>Product Managers</h1>
          </div>
        </div>
        <div className="profile-buttons p-4">
          <button className="btn btn-primary">
          <box-icon name='plus' color="white" />
            Invite
          </button>
        </div>
      </div>
      <hr/>
      <div className="d-flex align-content-between align-items-center">
        <Link
          className="list-group-item p-2"
        >
            About 
        </Link>
        <Link
          className="list-group-item p-2"
        >
            People 
        </Link>
        <Link
          className="list-group-item p-2"
        >
            Photos 
        </Link>
      </div>
    </div>
  );
};

export default GroupHeader;
