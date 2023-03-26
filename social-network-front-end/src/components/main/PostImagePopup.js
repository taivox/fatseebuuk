import { useState } from "react";
import { Modal } from "react-bootstrap";

function PostImagePopup({ post, onClose }) {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  console.log(post);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>User {post.poster} post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img src={post.postImage} alt={post.poster} className="w-100" />
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn">
            <box-icon name="like" /> 23
          </button>
          <button className="btn btn">23 Comments</button>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-between m-3">
        <div className="d-flex flex-grow-1 align-items-center">
          <button style={{ width: "100%" }} className="btn btn-light">
            <box-icon name="like" /> Like
          </button>
        </div>
        <div className="d-flex flex-grow-1 align-items-center justify-content-end">
          <button style={{ width: "100%" }} className="btn btn-light">
            <box-icon name="comment" /> Comment
          </button>
        </div>

<div>

        <div class="d-flex align-items-center media mb-3">
          <img
            class="rounded-circle mr-3"
            src="https://via.placeholder.com/50"
            alt=""
          />
          <div class="media-body bg-light rounded p-2">
            <h6 class="mt-0">John Doe</h6>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              nec urna justo. Suspendisse eget velit ac quam aliquam vehicula.
              Donec sodales lectus a dui fringilla, at ullamcorper est cursus.
              Nam bibendum metus sit amet lorem luctus, eget sollicitudin mi
              dictum.
            </p>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <button type="button" class="btn btn-outline-ligth btn-sm mr-1">
            Like
          </button>
          <button type="button" class="btn btn-outline-ligth btn-sm mr-1">
            Reply
          </button>
          <span class="text-muted mr-3">2 hours ago</span>
        </div>
</div>

<div>

        <div class="d-flex align-items-center media mb-3">
          <img
            class="rounded-circle mr-3"
            src="https://via.placeholder.com/50"
            alt=""
          />
          <div class="media-body bg-light rounded p-2">
            <h6 class="mt-0">John Doe</h6>
            <p>
              Lorem ipsum dolor sit amet
            </p>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <button type="button" class="btn btn-outline-ligth btn-sm mr-1">
            Like
          </button>
          <button type="button" class="btn btn-outline-ligth btn-sm mr-1">
            Reply
          </button>
          <span class="text-muted mr-3">1 hours ago</span>
        </div>
</div>
      </Modal.Footer>
    </Modal>
  );
}

export default PostImagePopup;
