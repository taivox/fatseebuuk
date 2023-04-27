import { useEffect, useState } from "react"
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom"
import CreateEventPopup from "./CreateEventPopup"
import { dateFormat } from "../../Utils"
import ErrorPage from "../common/ErrorPage"


function GroupEvents() {
  const [pastEvents, setPastEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [createModalShowing, setCreateModalShowing] = useState(false)
  const { group_id } = useParams()
  const [error, setError] = useState(null)
  const { cookie } = useOutletContext()
  const navigate = useNavigate()

  const handleCreateEventClick = () => {
    setCreateModalShowing(true)
  }

  const handleCreateEventClose = () => {
    setCreateModalShowing(false)
  }

  useEffect(() => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", cookie)

    const requestOptions = {
      method: "GET",
      headers: headers,
    }
    fetch(`${process.env.REACT_APP_BACKEND}/groups/${group_id}/events`, requestOptions)
      .then(response => response.status === 401 ? navigate('/login') : response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.message)
        }
        setPastEvents(data.past_events)
        setUpcomingEvents(data.upcoming_events)
      })
      .catch((error) => {
        setError(error)
      })
  }, [])

  if (error) {
    return <><ErrorPage error={error} /></>
  } else {
    return (
      <div className="col-md-12">
        <div className="card mt-3">
          <div className="card-body">
            <div className="card-title d-flex justify-content-between align-items-center">
              <h5>Upcoming Events</h5>
              <button onClick={handleCreateEventClick} className="btn btn-primary ml-2">Create Event</button>
            </div>

            {upcomingEvents ? upcomingEvents.map((event) => (
              <div key={event.event_id} className="list-group m-2">
                <div className="d-flex align-items-center">
                  <Link
                    to={`${event.event_id}`}
                  >
                    <img
                      src={`/event/${event.image}`}
                      style={{
                        height: "130px",
                        width: "130px",
                        objectFit: "cover",
                      }}
                      className="mr-3"
                      alt=""
                    />
                  </Link>
                  <div className="media-body m-3">
                    <p className="mt-0" style={{ color: 'red', fontSize: '12px' }}><strong> {`${new Date(event.event_date).toLocaleString('en-UK', dateFormat)}`}</strong></p>
                    <Link className="Link" to={`${event.event_id}`}><h4 style={{ wordBreak: "break-word" }} className="mt-0">{event.title}</h4></Link>
                    <p className="mt-0">Creator: <Link className="Link" to={`/profile/${event.poster.user_id}`}><strong>{`${event.poster.first_name} ${event.poster.last_name}`}</strong></Link></p>
                  </div>
                </div>
              </div>
            )) : <div>No events yet</div>}

          </div>
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <div className="card-title d-flex justify-content-between align-items-center">
              <h5>Past Events</h5>
            </div>

            {pastEvents ? pastEvents.map((event) => (
              <div key={event.event_id} className="list-group m-2">
                <div className="d-flex align-items-center">
                  <Link
                    to={`${event.event_id}`}
                  >
                    <img
                      src={`/event/${event.image}`}
                      style={{
                        height: "130px",
                        width: "130px",
                        objectFit: "cover",
                      }}
                      className="mr-3"
                      alt=""
                    />
                  </Link>
                  <div className="media-body m-3">
                    <p className="mt-0" style={{ color: 'red', fontSize: '12px' }}><strong>{`${new Date(event.event_date).toLocaleString('en-UK', dateFormat).slice(0, -3)}`}</strong></p>
                    <Link className="Link" to={`${event.event_id}`}><h4 className="mt-0">{event.title}</h4></Link>
                    <p className="mt-0">Creator: <Link className="Link" to={`/profile/${event.poster.user_id}`}><strong>{`${event.poster.first_name} ${event.poster.last_name}`}</strong></Link></p>
                  </div>
                </div>
              </div>
            )) : <div>No events yet</div>}


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
}


export default GroupEvents
