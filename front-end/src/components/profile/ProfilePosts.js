import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TextArea from "../form/TextArea";
import PostImagePopup from "../main/PostImagePopup";

function ProfilePosts({ props }) {
  const [posts, setPosts] = useState([]);
  const [showFullText, setShowFullText] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);

  const handleImageClick = (post) => {
    setSelectedPost(post);
  };

  const handlePostImagePopupClose = () => {
    setSelectedPost(null);
  };

  const [text, setText] =
    useState(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id
    est id elit consectetur sollicitudin. Nam vel turpis eget ipsum
    bibendum dictum at in lectus. Mauris a semper urna, ac facilisis
    nulla. Pellentesque habitant morbi tristique senectus et netus
    et malesuada fames ac turpis egestas. Praesent congue nulla nec
    ipsum bibendum, vel finibus turpis luctus. Sed ornare, lorem vel
    varius tristique, est massa dictum est, vitae euismod massa
    mauris a augue. Sed at sapien nunc. Suspendisse potenti. Aenean
    hendrerit mi ut turpis maximus, vel imperdiet augue bibendum.
    Donec ut consequat enim. Duis pharetra euismod ex sed dignissim.
    Sed sollicitudin eu metus non lobortis. Nunc nec sagittis leo.`);
  const textLimit = 100;

  useEffect(() => {
    const dummyPosts = [
      {
        id: 1,
        posterID: 1,
        poster: "John Doe",
        profileImage: "/profile/chad.jpg",
        global: true,
        postedAt: "Posted 1 day ago",
        postContent: text,
        postImage: "/post/chadpost.png",
      },
      {
        id: 2,
        posterID: 2,
        poster: "Dora Explorer",
        profileImage: "/profile/dota.jpg",
        global: false,
        postedAt: "Posted 2 hours ago",
        postContent: text,
        postImage: "/post/js.jpg",
      },
      {
        id: 3,
        posterID: 3,
        poster: "Peppa Pug",
        profileImage: "/profile/peppa.jpg",
        global: false,
        postedAt: "Posted 5 days ago",
        postContent: text,
        postImage: "/post/oldprogrammers.webp",
      },
      {
        id: 4,
        posterID: 4,
        poster: "Steve Scumbag",
        profileImage: "/profile/scumbag.jpg",
        global: true,
        postedAt: "Posted 12 days ago",
        postContent: text,
        postImage: "/post/nagutaivo.png",
      },
    ];

    setPosts(dummyPosts);
  }, [text]);

  const toggleText = (postId) => {
    setShowFullText((prevShowFullText) => ({
      ...prevShowFullText,
      [postId]: !prevShowFullText[postId],
    }));
  };

  return (
    <div className="col-md-6">
      {props.is_owner && (
        <div className="card mt-3">
          <div className="card-body">
            <div className="media mb-3">
              <div className="media-body d-flex">
                <img
                  src={props.profile_image}
                  className="mr-3 m-2"
                  alt="Your Profile Image"
                  style={{
                    height: "80px",
                    width: "80px",
                    borderRadius: "100%",
                    objectFit: "cover",
                  }}
                />
                <form className="flex-grow-1">
                  <TextArea
                    title={""}
                    name={""}
                    rows={"3"}
                    placeholder={"What's on your mind?"}
                  />
                  <div className="form-group m-2">
                    <label htmlFor="post-image" className="btn btn-ligth mb-0">
                      <box-icon
                        name="photo-album"
                        type="solid"
                        color="green"
                      ></box-icon>{" "}
                      Add Image
                    </label>
                    <input
                      type="file"
                      className="form-control-file d-none"
                      id="post-image"
                    />
                    <button type="submit" className="btn btn-ligth ml-2">
                      <box-icon
                        name="envelope"
                        type="solid"
                        color="blue"
                      ></box-icon>
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div> 
      )}

      {props.posts && props.posts.length > 0 ? props.posts.map((p) => (
        <div key={p.post_id} className="card">
          <div className="card-body">
            <div className="media ">
              <div className="d-flex align-items-center m-2">
                <Link to={`/profile/${p.poster.user_id}`}>
                  <img
                    src={p.poster.profile_image}
                    className="mr-3 rounded-circle"
                    style={{
                      height: "60px",
                      width: "60px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    alt="..."
                  />
                </Link>
                <div key={p.post_id} className="m-3">
                  <h5 className="mt-0" style={{ cursor: "pointer" }}>
                    <Link className="Link" to={`/profile/${p.poster.user_id}`}>
                      {`${p.poster.first_name} ${p.poster.last_name}`}{" "}
                    </Link>
                  </h5>
                  <small className="text-muted">{p.created}</small>
                </div>
              </div>
              <div className="media-body">
                <p className="card-text">
                  {showFullText[p.post_id]
                    ? p.content
                    : p.content.slice(0, textLimit)}
                  {p.content.length > textLimit && !showFullText[p.post_id] && (
                    <span>
                      ...{" "}
                      <span
                        className="show-more-link"
                        href="#!"
                        onClick={() => toggleText(p.post_id)}
                      >
                        See more
                      </span>
                    </span>
                  )}
                </p>
                {p.image && <img
                  src={`/post/${p.image}`}
                  className="img-fluid mb-2"
                  style={{
                    height: "300px",
                    width: "600px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  alt="..."
                  onClick={() => handleImageClick(p)}
                />}
                <div className="d-flex justify-content-between align-items-center">
                  <button className="btn">
                    <box-icon name="like" /> {p.likes}
                  </button>
                  <button
                    onClick={() => handleImageClick(p)}
                    className="btn btn"
                  >
                    {p.comments && p.comments.length > 0 ? `${p.comments.length} Comments` : "No comments"}
                  </button>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center m-2">
                  <button className="btn btn-light">
                    <box-icon name="like" /> Like
                  </button>
                  <button
                    onClick={() => handleImageClick(p)}
                    className="btn btn-light"
                  >
                    <box-icon name="comment" /> Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )) : "No posts or user is private"}
      {selectedPost && (
        <PostImagePopup
          post={selectedPost}
          onClose={handlePostImagePopupClose}
        />
      )}
    </div>
  );
}

export default ProfilePosts;
