import React from 'react'
import { Link, useParams } from 'react-router-dom'


function GroupMenu() {
  const { group_id } = useParams()

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
          </div>
        </div>
      </nav>
    </div>
  )
}

export default GroupMenu