import { Outlet, useNavigate, useParams } from "react-router-dom";
import Footer from "./common/Footer";
import Header from "./common/Header";
import GroupHeader from "./group/GroupHeader";
import GroupMenu from "./group/GroupMenu";
import Chats from "./main/Chats";
import { useEffect, useState } from "react";
import ErrorPage from "./common/ErrorPage";
import Swal from "sweetalert2";

function Group() {
  const [group, setGroup] = useState({});
  const [groupPosts, setGroupPosts] = useState([]);
  let { group_id } = useParams();
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [cookie, setCookie] = useState("");
  const [cookieSet, setCookieSet] = useState(false);
  const navigate = useNavigate();
  const [hidden, setHidden] = useState("d-none");
  const [isgroupOwner, setIsGroupOwner] = useState(false);

  useEffect(() => {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith("session=")) {
        setCookie(cookie.substring("session=".length));
        break;
      }
    }
    setCookieSet(true);
  }, []);

  useEffect(() => {
    if (cookieSet && cookie === "") {
      navigate("/login");
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", cookie);

    const requestOptions = {
      method: "GET",
      headers: headers,
    };
    fetch(`${process.env.REACT_APP_BACKEND}/groups/${group_id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.message);
        }
        setHasAccess(data.user_is_group_member);
        setIsGroupOwner(data.user_is_group_owner);
        setHidden(hasAccess ? "d-none" : "");
        setGroup(data);
        setGroupPosts(data.posts);
      })
      .catch((error) => {
        setError(error);
      });
  }, [cookie]);

  const joinGroup = () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", cookie);

    let requestOptions = {
      method: "POST",
      headers: headers,
    };
    fetch(
      `${process.env.REACT_APP_BACKEND}/groups/${group_id}/join`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("seeondata", data);
        if (data.error) {
          console.log("error tuli", data);
        } else {
          console.log("success tuli ja muuta nupp mittekatiivseks");
        }
      });
  };

  const leaveGroup = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, leave group!",
    }).then((result) => {
      if (result.isConfirmed) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", cookie);

        const requestOptions = {
          method: "GET",
          headers: headers,
        };
        fetch(
          `${process.env.REACT_APP_BACKEND}/groups/${group_id}/leave`,requestOptions)
            .then((response) => response.json())
            .then((data)=>{
              if (data.error){
                Swal.fire("Oops...", data.message, "error");
                return
              }
            }).catch((error)=> {console.log(error)})
        Swal.fire("Done!", "We are sad to see you go!", "success")
        navigate("/")
      }
    });
  };

  if (false) {
    return (
      <>
        <ErrorPage error={error} />
      </>
    );
  } else if (isgroupOwner) {
    return (
      <div>
        <Header cookie={cookie} />
        {group && <GroupHeader group={group} />}
        <div className="container">
          <div className="row">
            <GroupMenu groupOwner={true} cookie={cookie} />
            <div className="col-md-6">
              <>
                <h1>OWNER</h1>
              </>
              {groupPosts && groupPosts.length > 0 && (
                <Outlet context={{ groupPosts, cookie }} />
              )}
            </div>
            <Chats />
          </div>
        </div>
        <Footer />
      </div>
    );
  } else if (!hasAccess && cookieSet) {
    return (
      <div>
        <Header cookie={cookie} />
        {group && <GroupHeader group={group} />}
        <div className="container">
          <div className="row">
            <GroupMenu />
            <div className="col-md-6">
              <div className="profile-buttons p-4">
                <button
                  onClick={joinGroup}
                  className={`btn btn-primary ${hidden}`}
                >
                  <box-icon name="plus" color="white" />
                  Join Group
                </button>
              </div>
            </div>
            <Chats />
          </div>
        </div>
        <Footer />
      </div>
    );
  } else {
    return (
      <div>
        <Header cookie={cookie} />
        {group && <GroupHeader group={group} />}
        <div className="container">
          <div className="row">
            <GroupMenu />
            <div className="col-md-6">
              <div className="profile-buttons p-4">
                <button
                  onClick={leaveGroup}
                  className={`btn btn-danger ${hidden}`}
                >
                  <box-icon name="x" color="white" />
                  Leave Group
                </button>
              </div>
              {groupPosts.length > 0 && (
                <Outlet context={{ groupPosts, cookie }} />
              )}
            </div>
            <Chats />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Group;
