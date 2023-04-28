import { Modal, Button, Row, Col, ListGroup, Form } from "react-bootstrap"
import { useState, useEffect, useRef } from "react"

function ChatWindow({ show, setShow, selectedChat }) {
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [messageText, setMessageText] = useState("")
  const [scrollToBottom, setScrollToBottom] = useState(false)
  const chatContainerRef = useRef(null)



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
        { id: 3, sender: "Ivo Malve", text: "I'm doing great, thanks. What have you be<ChatWindow show={false} setShow={toggleChat} />en up to?" },
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


  useEffect(() => {
    if (show) {
      if (scrollToBottom && chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        setScrollToBottom(false)
      }
    }
  }, [scrollToBottom, selectedFriend])

  const handleFriendClick = (id) => {
    console.log("friend handlefriendclickis", id)
    setSelectedFriend(friends[id])
    setScrollToBottom(true)
  }

  useEffect(() => {

    if (selectedChat) {
      console.log("useeffectis", selectedFriend)
      console.log("seeonid", selectedChat.friend.user_id)
      // setSelectedFriend()
      handleFriendClick(selectedChat.friend.user_id)
    }
  }, [selectedChat])

  const handleSendMessage = (e) => {
    e.preventDefault()
    // add message to selectedFriend's messages array
    setMessageText("")
    setScrollToBottom(true)
  }




  return (
    <>
      <Modal show={show} onHide={setShow}>
        <Modal.Header closeButton>
          <Modal.Title>Chat Window</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={4}>
              <div style={{ overflowY: "auto", maxHeight: "40vw" }}>
                <ListGroup>
                  {friends.map((friend) => (
                    <ListGroup.Item
                      key={friend.id}
                      action
                      active={friend === selectedFriend}
                      onClick={() => handleFriendClick(friend.id)}
                    >
                      {friend.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Col>
            <Col>
              <div
                ref={chatContainerRef}
                style={{ maxHeight: "500px", overflowY: "auto" }}
              >
                {selectedFriend ? (
                  <ListGroup>
                    {selectedFriend.messages.map((message) => (
                      <ListGroup.Item key={message.id}>
                        <strong>{message.sender}</strong>: {message.text}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p>Please select a friend to start chatting</p>
                )}
              </div>
              {selectedFriend && (
                <Form onSubmit={handleSendMessage}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                  </Form.Group>
                  <Button type="submit">Send</Button>
                </Form>
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