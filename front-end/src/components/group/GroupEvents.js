import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import TextArea from "../form/TextArea"
import PostImagePopup from "../main/PostImagePopup"
import CreateEventPopup from "./CreateEventPopup"

function GroupEvents() {
  const [posts, setPosts] = useState([])
  const [showFullText, setShowFullText] = useState({})
  const [createModalShowing, setCreateModalShowing] = useState(false)

  const handleCreateEventClick = () => {
    setCreateModalShowing(true)
  }

  const handleCreateEventClose = () => {
    setCreateModalShowing(false)
  }

  const [text, setText] =
    useState(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id
    est id elit consectetur sollicitudin. Nam vel turpis eget ipsum
    bibendum dictum at in lectus. Mauris a semper urna, ac facilisis
    nulla. Pellentesque habitant morbi tristique senectus et netus
    et malesuada fames ac turpis egestas. Praesent congue nulla nec
    ipsum bibendum, vel finibus turpis luctus. Sed ornare, lorem vel
    varius tristique, est massa dictum est, vitae euismod massa
    mauris a augue. Sed at sapien nunc. Suspendisse potenti. Aenean
    hendrerit mi ut turpis maximus, vel imperdiet augue bibendum.
    Donec ut consequat enim. Duis pharetra euismod ex sed dignissim.
    Sed sollicitudin eu metus non lobortis. Nunc nec sagittis leo.`)
  const textLimit = 100

  useEffect(() => {
    const dummyPosts = [
      {
        id: 1,
        posterID: 1,
        poster: "John Doe",
        profileImage: "/profile/chad.jpg",
        global: true,
        postedAt: "Posted 1 day ago",
        postContent: text,
        postImage: "/post/chadpost.png",
      },
      {
        id: 2,
        posterID: 2,
        poster: "Dora Explorer",
        profileImage: "/profile/dota.jpg",
        global: false,
        postedAt: "Posted 2 hours ago",
        postContent: text,
        postImage: "/post/js.jpg",
      },
      {
        id: 3,
        posterID: 3,
        poster: "Peppa Pug",
        profileImage: "/profile/peppa.jpg",
        global: false,
        postedAt: "Posted 5 days ago",
        postContent: text,
        postImage: "/post/oldprogrammers.webp",
      },
      {
        id: 4,
        posterID: 4,
        poster: "Steve Scumbag",
        profileImage: "/profile/scumbag.jpg",
        global: true,
        postedAt: "Posted 12 days ago",
        postContent: text,
        postImage: "/post/nagutaivo.png",
      },
    ]

    setPosts(dummyPosts)
  }, [text])

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
          <div className="card-title d-flex justify-content-between align-items-center">
            <h5>Upcoming Events</h5>
            <button onClick={handleCreateEventClick} className="btn btn-primary ml-2">Create Event</button>
          </div>
          <div className="list-group m-2">
            <div className="d-flex align-items-center">
              <Link
                key={1}
                to={`/`}

              >
                <img
                  src={"/post/guys.webp"}
                  style={{
                    height: "130px",
                    width: "130px",
                    objectFit: "cover",
                  }}
                  className="mr-3"
                  alt="User avatar"
                />
              </Link>
              <div className="media-body m-3">
                <p className="mt-0" style={{ color: 'red', fontSize: '12px' }}><strong>{"April 4, 2023 3:00 PM"}</strong></p>
                <h4 className="mt-0"><Link className="Link" to={`/`}>{"Some event"}</Link></h4>
                <p className="mt-0">Creator: <Link className="Link" to={`/profile/1`}><strong>{"John Doe"}</strong></Link></p>
              </div>
            </div>

            <div className="d-flex align-items-center">
              <Link
                key={1}
                to={`/`}

              >
                <img
                  src={"/post/guys.webp"}
                  style={{
                    height: "130px",
                    width: "130px",
                    objectFit: "cover",
                  }}
                  className="mr-3"
                  alt="User avatar"
                />
              </Link>
              <div className="media-body m-3">
                <p className="mt-0" style={{ color: 'red', fontSize: '12px' }}><strong>{"April 4, 2023 3:00 PM"}</strong></p>
                <h4 className="mt-0">{"Some event"}</h4>
                <p className="mt-0">Creator: <Link className="Link" to={`/profile/1`}><strong>{"Good fun happening"}</strong></Link></p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body">
          <div className="card-title d-flex justify-content-between align-items-center">
            <h5>Past Events</h5>
          </div>
          <div className="list-group m-2">
            <div className="d-flex align-items-center">
              <Link
                key={1}
                to={`/`}

              >
                <img
                  src={"/post/guys.webp"}
                  style={{
                    height: "130px",
                    width: "130px",
                    objectFit: "cover",
                  }}
                  className="mr-3"
                  alt="User avatar"
                />
              </Link>
              <div className="media-body m-3">
                <p className="mt-0" style={{ color: 'red', fontSize: '12px' }}><strong>{"January 4, 2023 3:00 PM"}</strong></p>
                <h4 className="mt-0">{"Some event"}</h4>
                <p className="mt-0">Creator: <Link className="Link" to={`/profile/1`}><strong>{"Good fun happening"}</strong></Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {createModalShowing && (
        <CreateEventPopup
          onClose={handleCreateEventClose}
        />
      )}
    </div>
  )
}

export default GroupEvents
