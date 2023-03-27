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
