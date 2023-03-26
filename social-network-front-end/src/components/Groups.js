import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Groups(){

    const [groups, setGroups] = useState([])

    useEffect(()=>{
        const groups = [
            {id:1,title:"Web Developers Anonymous",description:"About stuff",image:"/webdev.jpg"},
            {id:2,title:"UI/UX Designers",description:"About other stuff",image:"/webdev.jpg"},
            {id:3,title:"Product Managers",description:"Still stuff",image:"/webdev.jpg"},
            {id:4,title:"Data Scientists",description:"You guessed it, stuff",image:"/webdev.jpg"},
        ]

        setGroups(groups)
    },[])

    return (
        <>
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Groups</h5>
          </div>
          <div className="list-group">
          {groups.map(g => (
            <Link key={g.id} to={`/group/${g.id}`} className="list-group-item list-group-item-action d-flex align-items-center">
              <img
                src={g.image}
                style={{
                  height: "65px",
                  borderRadius: "20%",
                  objectFit: "cover",
                }}
                className="mr-3"
                alt="User avatar"
              />
              <div className="media-body m-3">
                <h4 className="mt-0">{g.title}</h4>
                <p className="mt-0">{g.description}</p>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </>
    )
}

export default Groups