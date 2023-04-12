import { useEffect, useState } from "react"
import { Link, useOutletContext } from "react-router-dom"
import TextArea from "../form/TextArea"
import PostImagePopup from "../main/PostImagePopup"

function GroupPosts(props) {

  const { groupPosts } = useOutletContext()

  const [posts, setPosts] = useState([])
  const [showFullText, setShowFullText] = useState({})
  const [selectedPost, setSelectedPost] = useState(null)

  const handleImageClick = (post) => {
    setSelectedPost(post)
  }

  const handlePostImagePopupClose = () => {
    setSelectedPost(null)
  }

  const textLimit = 100

  useEffect(() => {
    setPosts(groupPosts)
  }, [groupPosts])

  const toggleText = (postId) => {
    setShowFullText((prevShowFullText) => ({
      ...prevShowFullText,
      [postId]: !prevShowFullText[postId],
    }))
  }


  return (
    <div className="col-md-12">
      <div className="card mt-3">
        <div className="card-body">
          <div className="media mb-3">
            <div className="media-body d-flex">
              <img
                src="/profile/chad.jpg"
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
                  placeholder={"Write something..."}
                />
                <div className="form-group m-2">
                  <label htmlFor="post-image" className="btn btn-ligth mb-0">
                    <box-icon name='photo-album' type='solid' color='green'></box-icon> Add Image
                  </label>
                  <input
                    type="file"
                    className="form-control-file d-none"
                    id="post-image"
                  />
                  <button type="submit" className="btn btn-ligth ml-2">
                    <box-icon name='envelope' type='solid' color='blue' ></box-icon>
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>


      {posts !== [] ? posts.map((p) => (
        <div key={p.post_id} className="card">
          <div className="card-body">
            <div className="media ">
              <div className="d-flex align-items-center m-2">
                <Link to={`/profile/${p.poster.user_id}`}>
                  <img
                    src={`/profile/${p.poster.profile_image}`}
                    className="mr-3 rounded-circle"
                    style={{
                      height: "60px",
                      width: "60px",
                      objectFit: "cover",
                      cursor: "pointer"
                    }}
                    alt="..."
                  />
                </Link>
                <div key={p.poster.user_id} className="m-3">
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
                  {showFullText[p.poster.user_id]
                    ? p.content
                    : p.content.slice(0, textLimit)}
                  {p.content.length > textLimit && !showFullText[p.poster.user_id] && (
                    <span>
                      ...{" "}
                      <span
                        className="show-more-link"
                        href="#!"
                        onClick={() => toggleText(p.poster.user_id)}
                      >
                        See more
                      </span>
                    </span>
                  )}
                </p>
                {p.image !== "" && <img
                  src={`/post/${p.image}`}
                  className="img-fluid mb-2"
                  style={{
                    height: "300px",
                    width: "600px",
                    objectFit: "cover",
                    cursor: "pointer"
                  }}
                  alt="..."
                  onClick={() => handleImageClick(p)}
                />}
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
      )) : <div>No Posts yet!</div>}


      {selectedPost && (
        <PostImagePopup
          post={selectedPost}
          onClose={handlePostImagePopupClose}
        />
      )}
    </div>
  )
}

export default GroupPosts
