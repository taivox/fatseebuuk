function ProfileLeft() {
  return (
    <div className="col-md-6">
      <div className="card mt-3">
        <div className="card-header">
          <h5 className="card-title">About</h5>
        </div>
        <div className="container">
          <div className="m-3">
            <p className="card-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              consectetur erat justo, sed interdum est feugiat sit amet. Sed
              quis feugiat velit. Sed malesuada lacus dolor, eget commodo mi
              euismod non. Integer sodales, ipsum a venenatis rutrum, nisi
              lectus sollicitudin velit, at scelerisque urna lorem vel odio.
              Vestibulum eu est ac orci semper fermentum ut quis libero. Sed nec
              sodales lacus. Vestibulum id varius nunc. Nam suscipit nunc eu
              diam tristique, nec laoreet nisi rutrum.
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
                <img src="/post/chadpost.png" alt="" className="img-fluid" style={{
                  height: "90%",
                  width: "90%",
                  objectFit: "cover",
                  cursor:"pointer"
                }} />
              </div>
              <div className="col-md-4">
                <img src="/post/js.jpg" alt="" className="img-fluid" style={{
                  height: "90%",
                  width: "90%",
                  objectFit: "cover",
                  cursor:"pointer"
                }} />
              </div>
              <div className="col-md-4">
                <img src="/post/nagutaivo.png" alt="" className="img-fluid" style={{
                  height: "95%",
                  width: "95%",
                  objectFit: "cover",
                  cursor:"pointer"
                }}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <img src="/post/oldprogrammers.webp" alt="" className="img-fluid" style={{
                  height: "95%",
                  width: "95%",
                  objectFit: "cover",
                  cursor:"pointer"
                }} />
              </div>
              <div className="col-md-4">
                <img src="/post/guys.webp" alt="" className="img-fluid" style={{
                  height: "95%",
                  width: "95%",
                  objectFit: "cover",
                  cursor:"pointer"
                }} />
              </div>
              <div className="col-md-4">
                <img src="/post/flowers.jpg" alt="" className="img-fluid" style={{
                  height: "95%",
                  width: "95%",
                  objectFit: "cover",
                  cursor:"pointer"
                }} />
              </div>
            </div>
          </div>
          </div>
      </div>
  );
}

export default ProfileLeft;
