import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import TextArea from "../form/TextArea"
import PostImagePopup from "../main/PostImagePopup"
import Swal from "sweetalert2"
import { getTimeElapsedString } from "../../Utils"

function ProfilePosts({ props, cookie, updatePosts }) {
  const [showFullText, setShowFullText] = useState({})
  const [selectedPost, setSelectedPost] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [postIndex, setPostIndex] = useState(null)
  const [almostPrivateChecked, setAlmostPrivateChecked] = useState(false)
  const [postContent, setPostContent] = useState("")
  const navigate = useNavigate()
  const MAX_FILE_SIZE = 10 * 1024 * 1024
  const [errors, setErrors] = useState([])
  const [error, setError] = useState([])
  const textLimit = 100
  const [selectedUsers, setSelectedUsers] = useState([])


  function handleCheckboxChange(event) {
    setAlmostPrivateChecked(event.target.checked)
  }

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

  const handleSubmit = (event) => {
    event.preventDefault()
    let errors = []

    let payload = {}
    if (almostPrivateChecked) {
      payload = {
        content: postContent,
        is_almost_private: almostPrivateChecked,
        selected_users: [props.user_id, ...selectedUsers],
      }
    } else {
      payload = {
        content: postContent,
        is_almost_private: almostPrivateChecked
      }
    }


    let required = [
      { field: payload.content, name: "content" },
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


    fetch(`${process.env.REACT_APP_BACKEND}/createpost`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.message,
          })
          return
        }
        updatePosts()
        setPostContent("")
        setImagePreview("")
      })
      .catch(error => {
        setError(error)
      })
  }

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
        updatePosts()
      })
      .catch((error) => {
        setError(error)
      })
  }

  useEffect(() => {

    if (selectedPost !== null) {
      setSelectedPost(props.posts[postIndex])
    }
  }, [props])


  const toggleText = (postId) => {
    setShowFullText((prevShowFullText) => ({
      ...prevShowFullText,
      [postId]: !prevShowFullText[postId],
    }))
  }

  return (
    <div className="col-md-6">
      {props.is_owner && (
        <div className="card mt-3">
          <div className="card-body">
            <div className="media mb-3">
              <div className="media-body d-flex">
                <img
                  src={`/profileimages/${props.profile_image}`}
                  className="mr-3 m-2"
                  alt="Your Profile Image"
                  style={{
                    height: "80px",
                    width: "80px",
                    borderRadius: "100%",
                    objectFit: "cover",
                  }}
                />
                <form onSubmit={handleSubmit} className="flex-grow-1">
                  <TextArea
                    title={""}
                    name={""}
                    rows={"3"}
                    placeholder={"What's on your mind?"}
                    value={postContent}
                    onChange={(event) => setPostContent(event.target.value)}
                    errorDiv={hasError("post_content") ? "text-danger" : "d-none"}
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
                      onChange={handleImageUpload}
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
                    {imagePreview && <img
                      style={{
                        borderRadius: "10px",
                        objectFit: "cover",
                        height: "130px",
                        width: "130px",
                      }}
                      className="col-md-12"
                      src={imagePreview && imagePreview}
                      alt=""
                    />}

                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={almostPrivateChecked} onChange={handleCheckboxChange} />
                      <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Make Almost Private</label>
                    </div>

                    {almostPrivateChecked && props.friends_list && (props.friends_list.length > 0) && <> {
                      props.friends_list.map((friend) => (
                        <div className="form-check" key={friend.friend.user_id}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`checkbox-${friend.friend.user_id}`}
                            checked={selectedUsers.includes(friend.friend.user_id)}
                            onChange={(event) => {
                              const id = friend.friend.user_id
                              const isChecked = event.target.checked
                              if (isChecked) {
                                setSelectedUsers([...selectedUsers, id])
                              } else {
                                setSelectedUsers(selectedUsers.filter((item) => item !== id))
                              }
                            }}
                          />

                          <label className="form-check-label" htmlFor="flexCheckDefault">
                            <div>
                              <img
                                className="friend-pic"
                                src={`/profileimages/${friend.friend.profile_image}`}
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  borderRadius: "100%",
                                  objectFit: "cover",
                                  zIndex: "99999",
                                }}
                                alt="profile" />
                              {`${friend.friend.first_name} ${friend.friend.last_name}`}
                            </div>
                          </label>
                        </div>
                      ))
                    }
                    </>}


                  </div>
                </form>
              </div>
            </div>
          </div>
        </div >
      )
      }

      {
        props.posts && props.posts.length > 0 ? props.posts.map((p, index) => (
          <div key={p.post_id} className="card">
            <div className="card-body">
              <div className="media ">
                <div className="d-flex align-items-center m-2">
                  <Link to={`/profile/${p.poster.user_id}`}>
                    <img
                      src={`/profileimages/${p.poster.profile_image}`}
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
                    src={`/postimages/${p.image}`}
                    className="img-fluid mb-2"
                    style={{
                      height: "300px",
                      width: "600px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    alt="..."
                    onClick={() => handleImageClick(p, index)}
                  />}
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
        )) : "No posts or user is private"
      }
      {
        selectedPost && (
          <PostImagePopup
            post={selectedPost}
            onClose={handlePostImagePopupClose}
            cookie={cookie}
            updatePosts={updatePosts}
          />
        )
      }
    </div >
  )
}

export default ProfilePosts
