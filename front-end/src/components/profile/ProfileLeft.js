import { Link } from "react-router-dom";

function ProfileLeft({ props }) {
  return (
    <div className="col-md-6">
      <div className="card mt-3">
        <div className="card-header">
          <h5 className="card-title">About</h5>
        </div>
        <div className="container">
          <div className="m-3">
            <p className="card-text">{props.about}</p>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-header">
          <h5 className="card-title">Photos</h5>
        </div>
        <div className="container m-2">
          <div className="row">
            {props.posts && props.posts.length > 0 ? (
              props.posts.map((post) => (
                <>
                  {post.image !== "" && (
                    <div className="col-md-4">
                      <img
                        src={`/post/${post.image}`}
                        alt=""
                        className="img-fluid"
                        style={{  
                          height: "90%",
                          width: "90%",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  )}
                </>
              ))
            ) : (
              <div>No photos</div>
            )}
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-header">
          <h5 className="card-title">Friends</h5>
          <div className="card-text">{props.friends_list ? `${props.friends_list.length} friends` : <div className="m-2">No friends</div>}</div>
        </div>
        <div className="container m-2">
          <div className="row">
        {props.friends_list && props.friends_list.length > 0 ? props.friends_list.map((friend => (

            <div className="col-md-4">
              <Link to={`/profile/${friend.friend.user_id}`}>
                <img
                  src={`/profile/${friend.friend.profile_image}`}
                  alt=""
                  className="img-fluid"
                  style={{
                    height: "85%",
                    width: "85%",
                    borderRadius: "10px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              </Link>
              <p style={{ fontSize: "14px", cursor: "pointer" }}>
                <strong>
                  <Link to={`/profile/${friend.friend.user_id}`} className="Link">
                    {`${friend.friend.first_name} ${friend.friend.last_name}`}
                  </Link>
                </strong>
              </p>
            </div>
        )))
        : <div className="m-2">No friends</div>}
        </div>
      </div>
      </div>
    </div>
  );
}

export default ProfileLeft;
