import { useState, useRef, useEffect } from "react";
import { Modal, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getTimeElapsedString } from "../../Utils";
import TextArea from "../form/TextArea";
import Swal from "sweetalert2";

function PostImagePopup({ post, onClose, cookie, updatePosts }) {
  const [show, setShow] = useState(true);
  const [showFullText, setShowFullText] = useState({});
  const [commentContent, setCommentContent] = useState("");
  const textareaRef = useRef();
  const [errors, setErrors] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const textLimit = 100;
  const [commentSent, setCommentSent] = useState(false)

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const toggleText = (postId) => {
    setShowFullText((prevShowFullText) => ({
      ...prevShowFullText,
      [postId]: !prevShowFullText[postId],
    }));
  };

  const handleClick = () => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  function handleCommentSubmit(event) {
    event.preventDefault();

    let errors = [];
    const payload = {
      post_id: post.post_id,
      content: commentContent,
      current_url: window.location.href,
    };

    let required = [{ field: payload.content, name: "content" }];

    required.forEach((req) => {
      if (req.field === "") {
        errors.push(req.name);
      }
    });

    setErrors(errors);

    if (errors.length > 0) {
      return;
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", cookie);

    let requestOptions = {
      body: JSON.stringify(payload),
      method: "POST",
      headers: headers,
    };

    fetch(`${process.env.REACT_APP_BACKEND}/createcomment`, requestOptions)
      .then((response) =>
        response.status === 401 ? navigate("/login") : response.json()
      )
      .then((data) => {
        if (data.error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
          });
          return;
        }
        setCommentContent("");
        setCommentSent(true)
        
      })
      .catch((error) => {
        setError(error);
      });
  }

  useEffect(() => {
    if (commentSent) {
      updatePosts();
      // if (window.location.href.includes("group")) {
      // updatePosts();
      // } else if (window.location.href.includes("profile")) {
      //   updatePosts();
      // } else {
      //   up
      // }
      console.log("Nyyd fetchis")
      setCommentSent(false)
      console.log("post tuli modalisse",post)
    }

  }, [commentContent]);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          User {`${post.poster.first_name} ${post.poster.last_name}`} post
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {post.image !== "" && (
          <>
            {" "}
            <img src={`/post/${post.image}`} alt="" className="w-100" />
          </>
        )}
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn">
            <box-icon name="like" /> {post.likes}
          </button>
          <button className="btn btn">{`${
            post.comments ? post.comments.length : "0"
          } Comments`}</button>
        </div>
        <div>
          <p className="card-text" style={{ wordBreak: "break-word" }}>
            {showFullText[post.poster.user_id]
              ? post.content
              : post.content.slice(0, textLimit)}
            {post.content.length > textLimit &&
              !showFullText[post.poster.user_id] && (
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
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-between m-3">
        <div className="d-flex flex-grow-1 col-12">
          <div className="d-flex flex-grow-1 align-items-center">
            <button className="btn btn-light col-12">
              <box-icon name="like" /> Like
            </button>
          </div>

          <div className="d-flex flex-grow-1 align-items-center justify-content-end">
            <button className="btn btn-light col-12" onClick={handleClick}>
              <box-icon name="comment" /> Comment
            </button>
          </div>
        </div>

        <Container>
          <Row>
            {!post.comments ? (
              <div>No comments yet!</div>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.comment_id}>
                  <div className="d-flex align-items-center media mb-3">
                    <Link to={`/profile/${comment.poster.user_id}`}>
                      <img
                        className="rounded-circle mr-3"
                        src={`/profile/${comment.poster.profile_image}`}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                        alt=""
                      />
                    </Link>
                    <div className="media-body bg-light rounded p-2">
                      <Link
                        className="Link"
                        to={`/profile/${comment.poster.user_id}`}
                      >
                        <h6 className="mt-0">{`${comment.poster.first_name} ${comment.poster.last_name}`}</h6>
                      </Link>
                      <p style={{ wordBreak: "break-all" }}>
                        {comment.content}
                      </p>
                    </div>
                    {comment.likes !== 0 && (
                      <>
                        <box-icon name="like" color="blue" />
                        {comment.likes}
                      </>
                    )}
                  </div>
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-outline-ligth btn-sm m-1"
                    >
                      Like
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-ligth btn-sm m-1"
                      onClick={handleClick}
                    >
                      Reply
                    </button>
                    <span className="text-muted mr-3">
                      {getTimeElapsedString(comment.created)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </Row>
          <form onSubmit={handleCommentSubmit} className="flex-grow-1">
            <TextArea
              textareaRef={textareaRef}
              name={""}
              rows={"3"}
              cols={"12"}
              placeholder={"Write something..."}
              onChange={(event) => setCommentContent(event.target.value)}
              value={commentContent}
              // errorDiv={hasError("content") ? "text-danger" : "d-none"}
            />
            <div className="form-group m-2">
              <button type="submit" className="btn btn-ligth ml-2">
                <box-icon name="envelope" type="solid" color="blue"></box-icon>
                Comment
              </button>
            </div>
          </form>
        </Container>
      </Modal.Footer>
    </Modal>
  );
}

export default PostImagePopup;
