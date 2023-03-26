import React from "react";
import Footer from "./common/Footer";
import Header from "./common/Header";
import ProfileHeader from "./profile/ProfileHeader";
import ProfileLeft from "./profile/ProfileLeft";
import ProfilePosts from "./profile/ProfilePosts";

function Profile() {
  return (
    <div>
      <Header />

      <ProfileHeader />
      <div>
        <div className="profile-content">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">About Me</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      Some info about me
                    </h6>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nulla consectetur erat justo, sed interdum est feugiat sit
                      amet. Sed quis feugiat velit. Sed malesuada lacus dolor,
                      eget commodo mi euismod non. Integer sodales, ipsum a
                      venenatis rutrum, nisi lectus sollicitudin velit, at
                      scelerisque urna lorem vel odio. Vestibulum eu est ac orci
                      semper fermentum ut quis libero. Sed nec sodales lacus.
                      Vestibulum id varius nunc. Nam suscipit nunc eu diam
                      tristique, nec laoreet nisi rutrum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <ProfileLeft />
              <ProfilePosts />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
