import { useState } from "react"
import { Modal } from "react-bootstrap"
import { Link } from "react-router-dom"

function PostImagePopup({ post, onClose }) {
  const [show, setShow] = useState(true)
  const [showFullText, setShowFullText] = useState({})
  const textLimit = 100

  const handleClose = () => {
    setShow(false)
    onClose()
  }

  const toggleText = (postId) => {
    setShowFullText((prevShowFullText) => ({
      ...prevShowFullText,
      [postId]: !prevShowFullText[postId],
    }))
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>User {`${post.poster.first_name} ${post.poster.last_name}`} post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {post.image !== "" && <> <img src={`/post/${post.image}`} alt="" className="w-100" />
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn">
              <box-icon name="like" /> 23
            </button>
            <button className="btn btn">23 Comments</button>
          </div></>}
        <div><p className="card-text">
          {showFullText[post.poster.user_id]
            ? post.content
            : post.content.slice(0, textLimit)}
          {post.content.length > textLimit && !showFullText[post.poster.user_id] && (
            <span>
              ...{" "}
              <p
                className="show-more-link"
                href="#!"
                onClick={() => toggleText(post.poster.user_id)}
              >
                See more
              </p>
            </span>
          )}
        </p></div>
      </Modal.Body>
      <Modal.Footer className="justify-content-between m-3">
        <div className="d-flex flex-grow-1 col-12">
          <div className="d-flex flex-grow-1 align-items-center">
            <button className="btn btn-light col-12">
              <box-icon name="like" /> Like
            </button>
          </div>
          <div className="d-flex flex-grow-1 align-items-center justify-content-end">
            <button className="btn btn-light col-12">
              <box-icon name="comment" /> Comment
            </button>
          </div>
        </div>

        {post.comments.length === 0 ? <div>No comments yet!</div> : post.comments.map((comment) => (
          <div>
            <div className="d-flex align-items-center media mb-3">
              <Link to={`/profile/${comment.poster.user_id}`}>
                <img
                  className="rounded-circle mr-3"
                  src={`/profile/${comment.poster.profile_image}`}
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  alt=""
                />
              </Link>
              <div className="media-body bg-light rounded p-2">
                <Link className="Link" to={`/profile/${comment.poster.user_id}`}>
                  <h6 className="mt-0">{`${comment.poster.first_name} ${comment.poster.last_name}`}</h6>
                </Link>
                <p>
                  {comment.content}
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button type="button" className="btn btn-outline-ligth btn-sm m-1">
                Like
              </button>
              <button type="button" className="btn btn-outline-ligth btn-sm m-1">
                Reply
              </button>
              <span className="text-muted mr-3">{comment.created}</span>
            </div>
          </div>
        ))}












      </Modal.Footer>
    </Modal >
  )
}

export default PostImagePopup
