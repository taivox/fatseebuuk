import { useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Input from "../form/Input";
import TextArea from "../form/TextArea";

function CreateEventPopup({ post, onClose }) {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  console.log(post);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <div className="text-center">
          <Modal.Title>Create Event</Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center m-2">
            <img
              src={`/profile/dota.jpg`}
              className="mr-3 rounded-circle"
              style={{
                height: "60px",
                width: "60px",
                objectFit: "cover",
              }}
              alt="..."
            />
            <div className="m-3">
              <h6>John Doe</h6>
              <p>Host</p>
            </div>
          </div>
          <div>
          <label for="post-image" class="btn btn-ligth mb-0" style={{height:'80px',width:'250px'}}>
            <box-icon name="photo-album" type="solid" color="green"></box-icon>{" "} <br/>
            Add Picture
          </label>
          <input type="file" class="form-control-file d-none" id="post-image" />
          </div>
        </div>
        <form>
          <Container>
            <Row>
              <Col xs={12}>
                <Input
                  className="form-control"
                  type="text"
                  name={"title"}
                  value={""}
                  placeholder={"Name of the event"}
                  onChange={null}
                  errorDiv={null}
                  errorMsg={""}
                  style={{ height: "80px" }}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Input
                  className="form-control"
                  type="date"
                  name={"title"}
                  value={""}
                  placeholder={"Name of the event"}
                  onChange={null}
                  errorDiv={null}
                  errorMsg={""}
                  style={{ height: "80px" }}
                />
              </Col>
              <Col md={6}>
                <Input
                  className="form-control"
                  type="time"
                  name={"title"}
                  value={""}
                  placeholder={"Name of the event"}
                  onChange={null}
                  errorDiv={null}
                  errorMsg={""}
                  style={{ height: "80px" }}
                />
              </Col>
            </Row>
            <Row>
              <TextArea
                className="form-control"
                type="time"
                name={"title"}
                value={""}
                placeholder={"Event description"}
                onChange={null}
                errorDiv={null}
                errorMsg={""}
                style={{ height: "180px" }}
              />
            </Row>
          </Container>
        </form>
      </Modal.Body>
      <Modal.Footer className="justify-content-between m-3">
        <div className="d-flex flex-grow-1 align-items-center">
          <button
            style={{ width: "100%", height: "80px" }}
            className="btn btn-primary"
          >
            <h6>Create Event</h6>
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateEventPopup;
