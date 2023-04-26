import { useEffect, useState } from "react"
import { Link, useNavigate, useOutletContext } from "react-router-dom"
import PostImagePopup from "./PostImagePopup"
import { getTimeElapsedString } from "../../Utils"
import Swal from "sweetalert2"


function Feed() {
  const [posts, setPosts] = useState([])
  const [showFullText, setShowFullText] = useState({})
  const [selectedPost, setSelectedPost] = useState(null)
  const [postIndex,setPostIndex] = useState(null)
  const { cookie } = useOutletContext()
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleImageClick = (post,index) => {
    setSelectedPost(post)
    setPostIndex(index)
  }

  const handlePostImagePopupClose = () => {
    setSelectedPost(null)
    setPostIndex(null)
  }

  const textLimit = 100

  const fetchFeed = () => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append("Authorization", cookie)

    const requestOptions = {
      method: 'GET',
      headers: headers
    }

    //  .then(response => response.json())
    fetch(`${process.env.REACT_APP_BACKEND}/feed`, requestOptions)
      .then(response => response.status === 401 ? navigate('/login') : response.json())
      .then(data => {
        setPosts(data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleSubmitLike = (id) => {  
    const payload = {
      post_id : id,
      belongs_to_group: window.location.href.includes("groups"),
    };

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", cookie);

    let requestOptions = {
      body: JSON.stringify(payload),
      method: "POST",
      headers: headers,
    };

    fetch(`${process.env.REACT_APP_BACKEND}/createpostlike`, requestOptions)
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
        fetchFeed()
      })
      .catch((error) => {
        setError(error);
      });
  }

  useEffect(() => {
    fetchFeed()
  }, [cookie])

  useEffect(()=>{
    
    if(selectedPost !== null){
      setSelectedPost(posts[postIndex])
    }
  },[posts])

  const toggleText = (postId) => {
    setShowFullText((prevShowFullText) => ({
      ...prevShowFullText,
      [postId]: !prevShowFullText[postId],
    }))
  }

  return (
    <>
      {posts && posts.length > 0 ? posts.map((p, index) => (
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
      )):<div className="card m-2 align-items-center"><h3>No posts.</h3></div>}
      {selectedPost && (
        <PostImagePopup
          post={selectedPost}
          onClose={handlePostImagePopupClose}
          cookie={cookie}
          updatePosts={fetchFeed}
        />
      )}
    </>
  )
}

export default Feed
