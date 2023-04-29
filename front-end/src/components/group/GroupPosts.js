import { useEffect, useState, useRef } from "react"
import { Link, Navigate, useNavigate, useOutletContext } from "react-router-dom"
import TextArea from "../form/TextArea"
import PostImagePopup from "../main/PostImagePopup"
import Swal from "sweetalert2"
import { getTimeElapsedString } from "../../Utils"
import { Row, Col, ListGroup, Form, Button } from 'react-bootstrap'

function GroupPosts() {
  const { groupPosts, cookie, group_id, fetchGroup, group} = useOutletContext()

  const [posts, setPosts] = useState([])
  const [showFullText, setShowFullText] = useState({})
  const [selectedPost, setSelectedPost] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [postContent, setPostContent] = useState("")
  const [postIndex, setPostIndex] = useState(null)
  const [currentUser, setCurrentUser] = useState({})
  const MAX_FILE_SIZE = 10 * 1024 * 1024
  const [errors, setErrors] = useState([])
  const [error, setError] = useState([])
  const navigate = useNavigate()
  const [messageText, setMessageText] = useState('')
  const [scrollToBottom, setScrollToBottom] = useState(false)
  const [messages, setMessages] = useState([])
  const chatContainerRef = useRef(null)
  const [socket, setSocket] = useState(null)

  const handleImageClick = (post, index) => {
    setSelectedPost(post)
    setPostIndex(index)
  }

  const handlePostImagePopupClose = () => {
    setSelectedPost(null)
    setPostIndex(null)
  }

  const hasError = (key) => {
    return errors.indexOf(key) !== -1
  }

  const handleGroupImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select an image file",
      })
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      localStorage.removeItem("image")
      setImagePreview(null)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "File size exceeds the limit of 10 MB!",
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

  const handleGroupSubmit = (event) => {
    event.preventDefault()

    let errors = []
    const payload = {
      content: postContent,
    }

    let required = [{ field: payload.content, name: "content" }]

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

    fetch(`${process.env.REACT_APP_BACKEND}/groups/${group_id}/createpost`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
          })
          return
        }
        setPostContent("")
        setImagePreview("")
        fetchGroup()
      })
      .catch((error) => {
        setError(error)
      })
  }

  const textLimit = 100

  const handleSubmitLike = (id) => {
    const payload = {
      post_id: id,
      belongs_to_group: window.location.href.includes("groups"),
    }

    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", cookie)

    let requestOptions = {
      body: JSON.stringify(payload),
      method: "POST",
      headers: headers,
    }

    let fetchURL = `${process.env.REACT_APP_BACKEND}/createpostlike`

    fetch(fetchURL, requestOptions)
      .then((response) =>
        response.status === 401 ? navigate("/login") : response.json()
      )
      .then((data) => {
        if (data.error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
          })
          return
        }
        fetchGroup()
      })
      .catch((error) => {
        setError(error)
      })
  }

  useEffect(() => {
    setPosts(groupPosts)
    if (selectedPost !== null) {
      setSelectedPost(groupPosts[postIndex])
    }
  }, [groupPosts])

  const toggleText = (postId) => {
    setShowFullText((prevShowFullText) => ({
      ...prevShowFullText,
      [postId]: !prevShowFullText[postId],
    }))
  }

  useEffect(() => {
    if (cookie) {
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
    }
  }, [])



  //SIIT EDASI WEBSOCKETI STUFF
  useEffect(() => {
    if (cookie) {
      const newSocket = new WebSocket('ws://localhost:8080/ws')

      setSocket(newSocket)

      newSocket.addEventListener('open', () => {
        console.log('WebSocket connection established')
        const payload = {
          cookie: cookie,
          group_id: parseInt(group_id),
        }

        console.log("payload", payload)
        newSocket.send(JSON.stringify(payload))
      })

      newSocket.addEventListener('message', (event) => {
        const jsonData = JSON.parse(event.data)
        setMessages(jsonData)
        setScrollToBottom(true)
        console.log("socketist tuli:", jsonData)
      })

      return () => {
        newSocket.close()
        console.log('closing')
        setSocket(null)
      }
    }
  }, [cookie])

  const handleClick = (content) => {
    if (socket && content !== "") {
      console.log('saatsin midagi socketisse')

      const payload = {
        cookie: cookie,
        content: content,
        group_id: parseInt(group_id),
      }
      console.log("selle saadame socketisse", payload)

      socket.send(JSON.stringify(payload))
    }
  }

  useEffect(() => {
    if (scrollToBottom && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      setScrollToBottom(false)
    }
  }, [scrollToBottom])


  const handleSendMessage = (e) => {
    e.preventDefault()
    // add message to selectedFriend's messages array
    setMessageText('')
    setScrollToBottom(true)
  }

  // const getSenderName = (userID) => {

  //  return  group.members.forEach(member => {
  //     if (member.user_id = userID) {
  //       console.log("minginimi",member.first_name + ' ' + member.last_name)
  //       return member.first_name + ' ' + member.last_name
  //     }
  
  //   })

  // }


  return (
    <div className="col-md-12">
      <div className="card" >
        <h2 className="m-3">Group chat</h2>
        <Row>

          <Col>
            <div style={{ maxHeight: '500px', minHeight: '250px', overflowY: 'auto' }}>

              <ListGroup>
                {messages && messages.length > 0 &&
                  messages.map((message) => (
                    <ListGroup.Item key={message.message_id} style={{ wordBreak: "break-all" }}>
                      <strong>{message.from_id === currentUser ? "You" :  "keegi teine"}</strong>: {message.content}
                    </ListGroup.Item>
                  ))}
              </ListGroup>


            </div>
            <Form >
              <Form.Group>
                <Form.Control type="text"  value={messageText} onChange={(e) => setMessageText(e.target.value)} />
              </Form.Group>
              <Button type="submit" className="m-2" onClick={() => handleClick(messageText)}>
                Send
              </Button>
            </Form>
          </Col>
        </Row>
      </div>


      <div className="card mt-3">
        <div className="card-body">
          <div className="media mb-3">
            <div className="media-body d-flex">
              <img
                src={`/profile/${currentUser.profile_image}`}
                className="mr-3 m-2"
                alt=""
                style={{
                  height: "80px",
                  width: "80px",
                  borderRadius: "100%",
                  objectFit: "cover",
                }}
              />
              <form onSubmit={handleGroupSubmit} className="flex-grow-1">
                <TextArea
                  title={""}
                  name={""}
                  rows={"3"}
                  placeholder={"Write something..."}
                  onChange={(event) => setPostContent(event.target.value)}
                  value={postContent}
                  errorDiv={hasError("content") ? "text-danger" : "d-none"}
                  errorMsg={"Please enter something"}
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
                    onChange={handleGroupImageUpload}
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
                {imagePreview && (
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
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {posts && posts.length > 0 ? (
        posts.map((p, index) => (
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
                        cursor: "pointer",
                      }}
                      alt="..."
                    />
                  </Link>
                  <div key={p.poster.user_id} className="m-3">
                    <h5 className="mt-0" style={{ cursor: "pointer" }}>
                      <Link
                        className="Link"
                        to={`/profile/${p.poster.user_id}`}
                      >
                        {`${p.poster.first_name} ${p.poster.last_name}`}{" "}
                      </Link>
                    </h5>
                    <small className="text-muted">{getTimeElapsedString(p.created)}</small>
                  </div>
                </div>
                <div className="media-body">
                  <p className="card-text">
                    {showFullText[p.poster.user_id]
                      ? p.content
                      : p.content.slice(0, textLimit)}
                    {p.content.length > textLimit &&
                      !showFullText[p.poster.user_id] && (
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
                  {p.image !== "" && (
                    <img
                      src={`/post/${p.image}`}
                      className="img-fluid mb-2"
                      style={{
                        height: "300px",
                        width: "600px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      alt="..."
                      onClick={() => handleImageClick(p, index)}
                    />
                  )}
                  <div className="d-flex justify-content-between align-items-center">
                    <button onClick={() => handleSubmitLike(p.post_id)} className="btn">
                      <box-icon name="like" /> {p.likes}
                    </button>
                    <button
                      onClick={() => handleImageClick(p, index)}
                      className="btn btn"
                    >
                      {p.comments && p.comments.length > 0 ? `${p.comments.length} Comments` : "No comments"}
                    </button>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center m-2">
                    <button onClick={() => handleSubmitLike(p.post_id)} className="btn btn-light">
                      <box-icon name="like" /> Like
                    </button>
                    <button
                      onClick={() => handleImageClick(p, index)}
                      className="btn btn-light"
                    >
                      <box-icon name="comment" /> Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>No Posts yet!</div>
      )}

      {selectedPost && (
        <PostImagePopup
          post={selectedPost}
          onClose={handlePostImagePopupClose}
          cookie={cookie}
          updatePosts={fetchGroup}
        />
      )}
    </div>
  )
}

export default GroupPosts
