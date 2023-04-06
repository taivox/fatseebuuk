import { Link } from "react-router-dom";



function ProfileLeft({props}) {
  return (
    <div className="col-md-6">
      <div className="card mt-3">
        <div className="card-header">
          <h5 className="card-title">About</h5>
        </div>
        <div className="container">
          <div className="m-3">
            <p className="card-text">
            {props.about}
            </p>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-header">
          <h5 className="card-title">Photos</h5>
        </div>
        <div className="container m-2">
          <div className="row">
            <div className="col-md-4">
              <img
                src="/post/chadpost.png"
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
            <div className="col-md-4">
              <img
                src="/post/js.jpg"
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
            <div className="col-md-4">
              <img
                src="/post/nagutaivo.png"
                alt=""
                className="img-fluid"
                style={{
                  height: "95%",
                  width: "95%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            </div>
            <div className="col-md-4">
              <img
                src="/post/oldprogrammers.webp"
                alt=""
                className="img-fluid"
                style={{
                  height: "95%",
                  width: "95%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            </div>
            <div className="col-md-4">
              <img
                src="/post/guys.webp"
                alt=""
                className="img-fluid"
                style={{
                  height: "95%",
                  width: "95%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            </div>
            <div className="col-md-4">
              <img
                src="/post/flowers.jpg"
                alt=""
                className="img-fluid"
                style={{
                  height: "95%",
                  width: "95%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-header">
          <h5 className="card-title">Friends</h5>
          <p className="card-text">100 friends</p>
        </div>
        <div className="container m-2">
          <div className="row">
            <div className="col-md-4">
                <Link to={`/profile/1`}>
              <img
                src="/profile/peppa.jpg"
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
              <p style={{fontSize:"14px", cursor:"pointer"}}>
              <strong><Link to={`/profile/1`} className="Link">Peppa Pug</Link></strong>
              </p>
            </div>
            <div className="col-md-4">
                <Link to={`/profile/1`}>
              <img
                src="/profile/dota.jpg"
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
              <p style={{fontSize:"14px", cursor:"pointer"}}>
              <strong><Link to={`/profile/1`} className="Link">Dora Explorer</Link></strong>
              </p>
            </div>
            <div className="col-md-4">
                <Link to={`/profile/1`}>
              <img
                src="/profile/scumbag.jpg"
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
              <p style={{fontSize:"14px", cursor:"pointer"}}>
              <strong><Link to={`/profile/1`} className="Link">Scumbag Steve</Link></strong>
              </p>
            </div>
            <div className="col-md-4">
                <Link to={`/profile/1`}>
              <img
                src="/profile/tom.webp"
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
              <p style={{fontSize:"14px", cursor:"pointer"}}>
              <strong><Link to={`/profile/1`} className="Link">Tom the Myspace Guy</Link></strong>
              </p>
            </div>
            <div className="col-md-4">
                <Link to={`/profile/1`}>
              <img
                src="/profile/chad.jpg"
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
              <p style={{fontSize:"14px", cursor:"pointer"}}>
              <strong><Link to={`/profile/1`} className="Link">Another Chad</Link></strong>
              </p>
            </div>
            <div className="col-md-4">
                <Link to={`/profile/1`}>
              <img
                src="/profile/peppa.jpg"
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
              <p style={{fontSize:"14px", cursor:"pointer"}}>
              <strong><Link to={`/profile/1`} className="Link">Peppa Pug</Link></strong>
              </p>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileLeft;
