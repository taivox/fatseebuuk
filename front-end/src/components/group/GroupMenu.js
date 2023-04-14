import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'


function GroupMenu({groupOwner,cookie}) {
  const { group_id } = useParams()
  const [groupRequests, setGroupRequests] = useState([])

  useEffect(()=>{
    if (groupOwner){
      const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", cookie)

    const requestOptions = {
      method: "GET",
      headers: headers,
    }
    fetch(`${process.env.REACT_APP_BACKEND}/groups/${group_id}/requests`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setGroupRequests(data)
      })
      .catch((error) => {
        console.log(error)
      })
    }
  },[group_id,groupOwner])
  return (
    <div className="col-md-3">
      <nav>
        <div className="list-group">
          <Link
            to={`/groups/${group_id}/`}
            className="list-group-item list-group-item-action"
          >
            <h6 className=""><box-icon name='home' type='solid' color="blue" />Community home</h6>
          </Link>
          <div>
            <Link
              to={`/groups/${group_id}/events`}
              className="list-group-item list-group-item-action"
            >
              <h6 className=""><box-icon name='calendar' />Events</h6>
            </Link>
          </div >
          {groupOwner && <div className="list-group-item list-group-item-action">
              <h6 className=""><box-icon name='calendar-plus' />Group Requests</h6>
              {groupRequests.length > 0 && groupRequests.map((request)=>(
                <div>
                  {`${request.requester.first_name} ${request.requester.last_name}`} 
                  <box-icon color="green" name='check'></box-icon>
                  <box-icon color="red" name='x'></box-icon>
                </div>
              ))}
          </div>
          }
        </div>
      </nav>
    </div>
  )
}

export default GroupMenu