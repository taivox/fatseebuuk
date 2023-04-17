import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function GroupMenu({ groupOwner, cookie }) {
  const { group_id } = useParams();
  const [groupRequests, setGroupRequests] = useState([]);

  const approveRequest = (groupID, requestID) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", cookie);

    const requestOptions = {
      method: "GET",
      headers: headers,
    };
    fetch(
      `${process.env.REACT_APP_BACKEND}/groups/${groupID}/approverequest/${requestID}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
          });
        }else{
          Swal.fire({
            icon: "success",
            title: "Yay!",
            text: data.message,
          });
          setGroupRequests(prevRequests => prevRequests.filter(request => request.request_id !== requestID));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const rejectRequest = (groupID, requestID) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", cookie);

    const requestOptions = {
      method: "GET",
      headers: headers,
    };
    fetch(
      `${process.env.REACT_APP_BACKEND}/groups/${groupID}/rejectrequest/${requestID}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
          });
        }else{
          Swal.fire({
            icon: "success",
            title: "Yay!",
            text: data.message,
          });
          setGroupRequests(prevRequests => prevRequests.filter(request => request.request_id !== requestID));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (groupOwner) {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", cookie);

      const requestOptions = {
        method: "GET",
        headers: headers,
      };
      fetch(
        `${process.env.REACT_APP_BACKEND}/groups/${group_id}/requests`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          setGroupRequests(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [group_id, groupOwner,cookie]);
  return (
    <div className="col-md-3">
      <nav>
        <div className="list-group">
          <Link
            to={`/groups/${group_id}/`}
            className="list-group-item list-group-item-action"
          >
            <h6 className="">
              <box-icon name="home" type="solid" color="blue" />
              Community home
            </h6>
          </Link>
          <div>
            <Link
              to={`/groups/${group_id}/events`}
              className="list-group-item list-group-item-action"
            >
              <h6 className="">
                <box-icon name="calendar" />
                Events
              </h6>
            </Link>
          </div>
          {groupOwner && (
            <div className="list-group-item list-group-item-action">
              <h6 className="">
                <box-icon name="calendar-plus" />
                Group Requests
              </h6>
              {groupRequests && groupRequests.length > 0 ?
                groupRequests.map((request) => (
                  <div key={request.request_id}>
                    <Link
                      to={`/profile/${request.requester.user_id}`}
                      className="Link"
                    >{`${request.requester.first_name} ${request.requester.last_name}`}</Link>
                    <button
                      onClick={() =>
                        approveRequest(request.group_id, request.request_id)
                      }
                      className="btn btn-light"
                    >
                      <box-icon color="green" name="check" />
                    </button>
                    <button
                      onClick={() =>
                        rejectRequest(request.group_id, request.request_id)
                      }
                      className="btn btn-light"
                    >
                      <box-icon color="red" name="x" />
                    </button>
                  </div>
                )):<div>No requests</div>}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default GroupMenu;
