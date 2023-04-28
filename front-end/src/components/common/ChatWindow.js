import { Modal, Button, Row, Col, ListGroup, Form } from "react-bootstrap"
import { useState } from "react"

function ChatWindow() {
  const [show, setShow] = useState(true)
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [messageText, setMessageText] = useState("")

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const friends = [
    {
      id: 1,
      name: "Margus Linnamäe",
      messages: [
        { id: 1, sender: "Margus Linnamäe", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Margus Linnamäe", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 2,
      name: "Rain Lõhmus",
      messages: [
        { id: 1, sender: 'Rain Lõhmus', text: "Hey, what's up?" },
        { id: 2, sender: 'You', text: 'Not much, just chilling. How about you?' },
        { id: 3, sender: 'Rain Lõhmus', text: 'Same here. Have you watched the latest episode of the show we were talking about?' },
        { id: 4, sender: 'Rain Lõhmus', text: "Hey, what's up?" },
        { id: 5, sender: 'You', text: 'Not much, just chilling. How about you?' },
        { id: 6, sender: 'Rain Lõhmus', text: 'Same here. Have you watched the latest episode of the show we were talking about?' },
        { id: 7, sender: 'Rain Lõhmus', text: "Hey, what's up?" },
        { id: 8, sender: 'You', text: 'Not much, just chilling. How about you?' },
        { id: 9, sender: 'Rain Lõhmus', text: 'Same here. Have you watched the latest episode of the show we were talking about?' },
        { id: 10, sender: 'Rain Lõhmus', text: "Hey, what's up?" },
        { id: 11, sender: 'You', text: 'Not much, just chilling. How about you?' },
        { id: 12, sender: 'Rain Lõhmus', text: 'Same here. Have you watched the latest episode of the show we were talking about?' },
      ],
    },
    {
      id: 3,
      name: "Oleg Gross",
      messages: [
        { id: 1, sender: 'Oleg Gross', text: "Hey, what's up?" },
        { id: 2, sender: 'You', text: 'Not much, just chilling. How about you?' },
        { id: 3, sender: 'Oleg Gross', text: 'Same here. Have you watched the latest episode of the show we were talking about?' },
        { id: 4, sender: 'Oleg Gross', text: "Hey, what's up?" },
        { id: 5, sender: 'You', text: 'Not much, just chilling. How about you?' },
        { id: 6, sender: 'Oleg Gross', text: 'Same here. Have you watched the latest episode of the show we were talking about?' },
        { id: 7, sender: 'Oleg Gross', text: "Hey, what's up?" },
        { id: 8, sender: 'You', text: 'Not much, just chilling. How about you?' },
        { id: 9, sender: 'Oleg Gross', text: 'Same here. Have you watched the latest episode of the show we were talking about?' },
        { id: 10, sender: 'Oleg Gross', text: "Hey, what's up?" },
        { id: 11, sender: 'You', text: 'Not much, just chilling. How about you?' },
        { id: 12, sender: 'Oleg Gross', text: 'Same here. Have you watched the latest episode of the show we were talking about?' },
      ],
    },
    {
      id: 4,
      name: "Ain Hanschimdt",
      messages: [
        { id: 1, sender: "Ain Hanschimdt", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Ain Hanschimdt", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 5,
      name: "Kristo Käärmann",
      messages: [
        { id: 1, sender: "Kristo Käärmann", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Kristo Käärmann", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 6,
      name: "Markus Villig",
      messages: [
        { id: 1, sender: "Markus Villig", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Markus Villig", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 7,
      name: "Egon Saks",
      messages: [
        { id: 1, sender: 'Egon Saks', text: "Hey, what's up?" },
        { id: 2, sender: 'You', text: 'Not much, just chilling. How about you?' },
        { id: 3, sender: 'Egon Saks', text: 'Same here. Have you watched the latest episode of the show we were talking about?' },
        { id: 4, sender: 'Egon Saks', text: "Hey, did I tell you about the time I worked for Bolt in Mexico? It was an amazing experience!" },
        { id: 5, sender: 'You', text: 'No, you haven\'t. Tell me about it!' },
        { id: 6, sender: 'Egon Saks', text: 'Oh man, it was wild. The traffic there is insane, but the people are so friendly and welcoming. And the food... don\'t even get me started!' },
        { id: 7, sender: 'Egon Saks', text: "Hey, have you tried that new coding course I told you about? It's really helping me improve my skills." },
        { id: 8, sender: 'You', text: 'Not yet, but I\'ll definitely check it out. Thanks for the recommendation!' },
        { id: 9, sender: 'Egon Saks', text: 'No problem, man. I always love sharing my knowledge with fellow coding enthusiasts.' },
        { id: 10, sender: 'Egon Saks', text: "Hey, did I tell you about the time I solved that really tricky coding challenge on Hackerrank? It was insane!" },
        { id: 11, sender: 'You', text: 'No, you haven\'t. How did you do it?' },
        { id: 12, sender: 'Egon Saks', text: 'Well, it took me a few hours of intense coding, but I finally cracked it. I felt like a coding superhero!' },
      ],

    },
    {
      id: 8,
      name: "Martin Villig",
      messages: [
        { id: 1, sender: "Martin Villig", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Martin Villig", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 9,
      name: "Urmas Sõõrumaa",
      messages: [
        { id: 1, sender: "Urmas Sõõrumaa", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Urmas Sõõrumaa", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 10,
      name: "Taavet Hinrikus",
      messages: [
        { id: 1, sender: "Taavet Hinrikus", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Taavet Hinrikus", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 11,
      name: "Peep Vain",
      messages: [
        { id: 1, sender: "Peep Vain", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Peep Vain", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 12,
      name: "Jaak Roosaare",
      messages: [
        { id: 1, sender: "Jaak Roosaare", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Jaak Roosaare", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 13,
      name: "Kristi Saare",
      messages: [
        { id: 1, sender: "Kristi Saare", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Kristi Saare", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 14,
      name: "Rainer Steinfeld",
      messages: [
        { id: 1, sender: "Rainer Steinfeld", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Rainer Steinfeld", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 15,
      name: "Karin Künnapas",
      messages: [
        { id: 1, sender: "Karin Künnapas", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Karin Künnapas", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 16,
      name: "Mari-liis Kitter",
      messages: [
        { id: 1, sender: "Mari-liis Kitter", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Mari-liis Kitter", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 17,
      name: "Ivo Malve",
      messages: [
        { id: 1, sender: "Ivo Malve", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Ivo Malve", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 18,
      name: "Talis Pähn",
      messages: [
        { id: 1, sender: "Talis Pähn", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Talis Pähn", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 19,
      name: "Marek Kiisa",
      messages: [
        { id: 1, sender: "Marek Kiisa", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. How about you?" },
        { id: 3, sender: "Marek Kiisa", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
    {
      id: 20,
      name: "Jüri-Mikk Udam",
      messages: [
        { id: 1, sender: "Jüri-Mikk Udam", text: "Hey, how are you?" },
        { id: 2, sender: "You", text: "I'm good, thanks for asking. Did you accept my linkedin connection request?" },
        { id: 3, sender: "Jüri-Mikk Udam", text: "I'm doing great, thanks. What have you been up to?" },
      ],
    },
  ]

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend)
  }

  const handleMessageSend = (e) => {
    e.preventDefault()

    const newMessage = {
      id: selectedFriend.messages.length + 1,
      sender: "You",
      text: messageText,
    }

    setSelectedFriend({
      ...selectedFriend,
      messages: [...selectedFriend.messages, newMessage],
    })

    setMessageText("")

  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Messenger
      </Button>

      <Modal show={show}
        onHide={handleClose}
        dialogClassName="modal-90w"
        aria-labelledby="contained-modal-title-vcenter"
        style={{ maxHeight: "95vh", minWidth: "60vw" }}
        centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Chat with friends
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={4}>
              <div style={{ overflowY: "auto", maxHeight: "40vw" }}>

                <ListGroup >
                  {friends.map((friend) => (
                    <ListGroup.Item key={friend.id} action onClick={() => handleFriendClick(friend)} active={selectedFriend?.id === friend.id} style={{ overflowY: "auto" }}>
                      {friend.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Col>
            <Col md={8} >
              {selectedFriend ? (
                <>
                  <h5>{selectedFriend.name}</h5>
                  <hr />
                  <div style={{ overflowY: 'auto', maxHeight: '40vh' }}>
                    {selectedFriend.messages.map((message) => (
                      <div key={message.id} style={{ wordBreak: "break-all" }}>
                        <p className={`mb-1 ${message.sender === "You" ? "text-right" : ""}`}>{message.text}</p>
                        <small className={`d-block ${message.sender === "You" ? "text-right" : ""}`}>{message.sender}</small>
                        <hr className="my-1" />
                      </div>
                    ))}
                  </div>
                  <Form onSubmit={handleMessageSend}>
                    <Form.Group controlId="messageText" className="d-flex">
                      <Form.Control type="text" placeholder="Type a message..." value={messageText} onChange={(e) => setMessageText(e.target.value)} />
                      <Button variant="primary" type="submit" className="ml-auto" style={{ marginRight: 0 }}>
                        Send
                      </Button>
                    </Form.Group>
                  </Form>

                </>
              ) : (
                <p>Please select a friend to start chatting.</p>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ChatWindow