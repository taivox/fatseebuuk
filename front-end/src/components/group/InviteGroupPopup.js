import { useState, useEffect } from "react"
import { Col, Container, Modal, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import Input from "../form/Input"
import TextArea from "../form/TextArea"

function InviteGroupPopup({ onClose, cookie, group }) {
    const [show, setShow] = useState(true)
    const [currentUser, setCurrentUser] = useState({})
    const [inviteList, setInviteList] = useState([])
    const navigate = useNavigate()
    const [error, setError] = useState()

    useEffect(() => {

        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        headers.append("Authorization", cookie)

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`${process.env.REACT_APP_BACKEND}/groups/${group.group_id}/getinvitelist`, requestOptions)
            .then(response => response.status === 401 ? navigate('/login') : response.json())
            .then((data) => {
                if (data.error) {
                    throw new Error(data.message)
                }
                console.log(data)
                setInviteList(data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    const handleClose = () => {
        setShow(false)
        onClose()
    }

    const handleInvite = (friendID) => {
        console.log(friendID)


        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        headers.append("Authorization", cookie)

        const payload = {
            user_id: friendID,
        }

        let requestOptions = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload)
        }

        fetch(`${process.env.REACT_APP_BACKEND}/groups/${group.group_id}/createinvite`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.message,
                    })
                    return
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: "Invitation sent successfully!",
                    })
                    onClose()
                }
            })
            .catch(error => {
                setError(error)
            })
    }


    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <div className="text-center">
                    <Modal.Title>Invite People</Modal.Title>
                </div>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <div className="list-group">
                        {inviteList && inviteList.length > 0 ? inviteList.map(f => (
                            <div key={f.user_id} className="list-group-item list-group-item-action d-flex align-items-center">
                                <Link to={`/profile/${f.user_id}`} className="Link d-flex align-items-center">
                                    <img
                                        src={`/profile/${f.profile_image}`}
                                        style={{
                                            height: "60px",
                                            width: "60px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                        }}
                                        className="mr-3"
                                        alt="User avatar"
                                    />
                                    <div className="media-body m-3">
                                        <h5 className="mt-0">{f.first_name} {f.last_name}</h5>
                                    </div>
                                </Link>
                                <div>
                                    <button className="btn btn-primary" onClick={() => handleInvite(f.user_id)}>Invite</button>
                                </div>
                            </div>
                        )) : <div className="text-center">No friends to show</div>}
                    </div>
                </Container>
            </Modal.Body>
        </Modal>
    )
}

export default InviteGroupPopup
