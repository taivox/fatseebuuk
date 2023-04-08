import { useEffect, useState } from "react"
import { Link, useOutletContext, useParams } from "react-router-dom"
import TextArea from "../form/TextArea"
import PostImagePopup from "../main/PostImagePopup"

function GroupEvent() {


    const { group_id, event_id } = useParams()

    const [event, setEvent] = useState([])
    const [showFullText, setShowFullText] = useState({})

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
                console.log(data)
                setEvent(data)
            })
            .catch((error) => {
                console.log(error)
            })


    }, [])

    const toggleText = (postId) => {
        setShowFullText((prevShowFullText) => ({
            ...prevShowFullText,
            [postId]: !prevShowFullText[postId],
        }))
    }


    return (
        <div className="col-md-12">
            {event.title}

        </div>
    )
}

export default GroupEvent
