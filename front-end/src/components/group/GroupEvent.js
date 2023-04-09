import { useEffect, useState } from "react"
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom"
import TextArea from "../form/TextArea"
import PostImagePopup from "../main/PostImagePopup"
import dateFormat from "../../Utils"
import ErrorPage from "../common/ErrorPage"


function GroupEvent() {


    const { group_id, event_id } = useParams()

    const [event, setEvent] = useState({})
    const [poster, setPoster] = useState({})
    const [showFullText, setShowFullText] = useState({})
    const [error, setError] = useState(null)

    const textLimit = 100

    useEffect(() => {

        const headers = new Headers()
        headers.append("Content-Type", "application/json")

        const requestOptions = {
            method: "GET",
            headers: headers,
        }
        fetch(`${process.env.REACT_APP_BACKEND}/groups/${group_id}/events/${event_id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    throw new Error(data.message)
                }
                setEvent(data)
                setPoster(data.poster)
            })
            .catch((error) => {
                setError(error)
            })


    }, [])

    const toggleText = (postId) => {
        setShowFullText((prevShowFullText) => ({
            ...prevShowFullText,
            [postId]: !prevShowFullText[postId],
        }))
    }

    if (error) {
        return (
            <><ErrorPage error={error} /></>
        )
    } else {
        return (
            <div className="col-md-12">
                <div key={event.event_id} className="card">
                    <div className="card-body">
                        <div className="media ">
                            <h1>{event.title}</h1>
                            <p style={{ color: 'red', fontSize: '14px' }}><strong>{`${new Date(event.event_date).toLocaleString('en-UK', dateFormat).slice(0, -3)}`}</strong></p>
                            <div className="d-flex align-items-center m-2">
                                <p>Created by: </p>
                                <Link to={`/profile/${poster.user_id}`}>
                                    <img
                                        src={`/profile/${poster.profile_image}`}
                                        className="mr-3 rounded-circle"
                                        style={{
                                            height: "40px",
                                            width: "40px",
                                            objectFit: "cover",
                                            cursor: "pointer"
                                        }}
                                        alt="..."
                                    />
                                </Link>
                                <div className="m-3">
                                    <h5 className="mt-0" style={{ cursor: "pointer" }}>
                                        <Link className="Link" to={`/profile/1`}>
                                            {`${poster.first_name} ${poster.last_name}`}{" "}
                                        </Link>
                                    </h5>
                                </div>
                            </div>
                            <div className="media-body">
                                <p className="card-text">
                                    {event.description}
                                </p>
                                <img
                                    src={`/event/${event.image}`}
                                    className="img-fluid mb-2"
                                    style={{
                                        height: "300px",
                                        width: "600px",
                                        objectFit: "cover",
                                        cursor: "pointer"
                                    }}
                                    alt="..."
                                />
                                <hr />
                                <div className="d-flex justify-content-between align-items-center m-2">
                                    <button className="btn btn-light">
                                        <box-icon name="calendar" /> Going
                                    </button>
                                    <button

                                        className="btn btn-light"
                                    >
                                        <box-icon name="x" /> Not Going
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default GroupEvent
