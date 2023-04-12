import { useEffect, useState } from "react"
import { Link, useOutletContext } from "react-router-dom"
import PostImagePopup from "./PostImagePopup"
import { getTimeElapsedString } from "../../Utils"


function Feed() {
  const [posts, setPosts] = useState([])
  const [showFullText, setShowFullText] = useState({})
  const [selectedPost, setSelectedPost] = useState(null)
  const { cookie } = useOutletContext()

  const handleImageClick = (post) => {
    setSelectedPost(post)
  }

  const handlePostImagePopupClose = () => {
    setSelectedPost(null)
  }

  const textLimit = 100

  useEffect(() => {

    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append("Authorization", cookie)

    const requestOptions = {
      method: 'GET',
      headers: headers
    }

    fetch(`${process.env.REACT_APP_BACKEND}/feed`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setPosts(data)
      })
      .catch(err => {
        console.log(err)
      })

  }, [cookie])

  const toggleText = (postId) => {
    setShowFullText((prevShowFullText) => ({
      ...prevShowFullText,
      [postId]: !prevShowFullText[postId],
    }))
  }

  return (
    <>
      {posts.map((p) => (
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
                      <box-icon color="grey" name={p.is_public ? "globe" : "user"} />
                    </Link>
                  </h5>
                  <small className="text-muted">{getTimeElapsedString(p.created)}</small>
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
                    cursor: "pointer"
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
                    {p.comments ? `${p.comments.length}` : '0'} Comments
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
  )
}

export default Feed
