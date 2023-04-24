import { useState, useEffect } from "react"
import { Col, Container, Modal, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import Input from "../form/Input"
import TextArea from "../form/TextArea"

function CreateGroupPopup({ post, onClose, cookie, fetchGroups }) {
  const [show, setShow] = useState(true)
  const [currentUser, setCurrentUser] = useState({})
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState([])
  const [error, setError] = useState(null)
  const MAX_FILE_SIZE = 10 * 1024 * 1024
  const navigate = useNavigate()

  useEffect(() => {

    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", cookie)

    const requestOptions = {
      method: "GET",
      headers: headers,
    }

    fetch(`${process.env.REACT_APP_BACKEND}/currentuser`, requestOptions)
      .then(response => response.status === 401 ? navigate('/login') : response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.message)
        }
        setCurrentUser(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select an image file',
      })
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      localStorage.removeItem("image")
      setImagePreview(null)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'File size exceeds the limit of 10 MB!',
      })
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      setImagePreview(reader.result)
    }

    localStorage.setItem("image", imagePreview)
  }

  const handleClose = () => {
    setShow(false)
    onClose()
  }

  const hasError = (key) => {
    return errors.indexOf(key) !== -1
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    let errors = []
    const payload = {
      title: title,
      description: description,
    }

    let required = [
      { field: payload.title, name: "title" },
      { field: payload.description, name: "description" },
    ]


    required.forEach((req) => {
      if (req.field === "") {
        errors.push(req.name)
      }
    })

    setErrors(errors)

    if (errors.length > 0) {
      return
    }

    payload.image = imagePreview
    localStorage.removeItem("image")

    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", cookie)

    let requestOptions = {
      body: JSON.stringify(payload),
      method: "POST",
      headers: headers,
    }


    fetch(`${process.env.REACT_APP_BACKEND}/groups/creategroup`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.message,
          })
          return
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: "Group created successfully!",
          })
          fetchGroups()
          onClose()
        }
      })
      .catch(error => {
        setError(error)
      })
  }


  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <div className="text-center">
          <Modal.Title>Create Group</Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center m-2">
            <img
              src={`/profile/${currentUser.profile_image}`}
              className="mr-3 rounded-circle"
              style={{
                height: "60px",
                width: "60px",
                objectFit: "cover",
              }}
              alt="..."
            />
            <div className="m-3">
              <h6>{`${currentUser.first_name} ${currentUser.last_name}`}</h6>
              <p>Host</p>
            </div>
          </div>
          <div>
            <label
              htmlFor="post-image"
              className="btn btn-light col-md-12"
              style={{ height: "180px" }}
            >
              <img
                style={{
                  borderRadius: "10px",
                  objectFit: "cover",
                  height: "130px",
                  width: "130px",
                }}
                className="col-md-12"
                src={imagePreview && imagePreview}
                alt=""
              />
              <br />
              <p className="m-2">Add Image (Optional)</p>
            </label>
            <input onChange={handleImageUpload} type="file" className="form-control-file d-none" id="post-image" />
            <input type="file" className="form-control-file d-none" id="post-image" />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <Container>
            <Row>
              <Col xs={12}>
                <Input
                  className="form-control"
                  type="text"
                  name={"title"}
                  value={title}
                  placeholder={"Name of the group"}
                  onChange={(event) => setTitle(event.target.value)}
                  errorDiv={hasError("title") ? "text-danger" : "d-none"}
                  errorMsg={"Please enter your group's name"}
                  style={{ height: "80px" }}
                />
              </Col>
            </Row>

            <Row>
              <TextArea
                className="form-control"
                type="time"
                name={"title"}
                value={description}
                placeholder={"Description..."}
                onChange={(event) => setDescription(event.target.value)}
                errorDiv={hasError("description") ? "text-danger" : "d-none"}
                errorMsg={"Please enter a description for your group"}
                style={{ height: "180px" }}
              />
            </Row>
          </Container>
          <div className="d-flex flex-grow-1 align-items-center">
            <button
              style={{ width: "100%", height: "80px" }}
              className="btn btn-primary"
              type="submit"
            >
              <h6>Create Group</h6>
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CreateGroupPopup
