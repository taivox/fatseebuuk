import { useEffect, useState } from "react";
import PostImagePopup from "./PostImagePopup";

function Feed() {
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
    <>
      {posts.map((p) => (
        <div key={p.id} className="card">
          <div className="card-body">
            <div className="media ">
              <div className="d-flex align-items-center m-2">
                <img
                  src={p.profileImage}
                  className="mr-3 rounded-circle"
                  style={{
                    height: "60px",
                    width: "60px",
                    objectFit: "cover",
                  }}
                  alt="..."
                />
                <div key={p.posterID} className="m-3">
                  <h5 className="mt-0">
                    {p.poster}{" "}
                    <box-icon color="grey" name={p.global ? "globe" : "user"} />
                  </h5>
                  <small className="text-muted">{p.postedAt}</small>
                </div>
              </div>
              <div className="media-body">
                <p className="card-text">
                  {showFullText[p.id]
                    ? p.postContent
                    : p.postContent.slice(0, textLimit)}
                  {p.postContent.length > textLimit && !showFullText[p.id] && (
                    <span>
                      ...{" "}
                      <p
                        className="show-more-link"
                        href="#!"
                        onClick={() => toggleText(p.id)}
                      >
                        See more
                      </p>
                    </span>
                  )}
                </p>
                <img
                  src={p.postImage}
                  className="img-fluid mb-2"
                  style={{
                    height: "300px",
                    width: "600px",
                    objectFit: "cover",
                  }}
                  alt="..."
                  onClick={() => handleImageClick(p)}
                />
                <div className="d-flex justify-content-between align-items-center">
                  <button className="btn">
                    <box-icon name="like" /> 23
                  </button>
                  <button
                    onClick={() => handleImageClick(p)}
                    className="btn btn"
                  >
                    23 Comments
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
      ))}
      {selectedPost && (
        <PostImagePopup
          post={selectedPost}
          onClose={handlePostImagePopupClose}
        />
      )}
    </>
  );
}

export default Feed;
