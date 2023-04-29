import { Modal, Button, Row, Col, ListGroup, Form } from 'react-bootstrap'
import { useState, useEffect, useRef } from 'react'
import { json } from 'react-router-dom'

function ChatWindow({ show, setShow, cookie, friends, selectedChat }) {
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [scrollToBottom, setScrollToBottom] = useState(false)
  const [messages, setMessages] = useState([])
  const chatContainerRef = useRef(null)
  const currentUser = parseInt(localStorage.getItem('user'))
  const [socket, setSocket] = useState(null)

  const regex = /(:\)|:\(|:D|;\)|:P|:O|:\||:\/|:3|;\(|:\*|XD|:'\)|>: \(|8\)|8\(|:\]|:\}|:{|:\\|:s|:\$|:#|:x|:!|:\^ \)|:smirk:|:heart:|:star:|:exclamation:|:question:|:arrow_up:|:arrow_down:|:arrow_left:|:arrow_right:|:ok_hand:|:thumbsup:|:thumbsdown:|:clap:|:pray:|:muscle:|:poop:|:bomb:|:fire:|:100:)/g
  // Regular expression to match common emojis
  const unicodeEmojis = {
    ":)": String.fromCodePoint(0x1F600),
    ":(": String.fromCodePoint(0x1F62D),
    ":D": String.fromCodePoint(0x1F603),
    ";)": String.fromCodePoint(0x1F609),
    ":P": String.fromCodePoint(0x1F61B),
    ":O": String.fromCodePoint(0x1F62E),
    ":|": String.fromCodePoint(0x1F610),
    ":/": String.fromCodePoint(0x1F615),
    ":3": String.fromCodePoint(0x1F63A),
    ";(": String.fromCodePoint(0x1F622),
    ":*": String.fromCodePoint(0x1F617),
    "XD": String.fromCodePoint(0x1F606),
    ":')": String.fromCodePoint(0x1F602),
    ">:(": String.fromCodePoint(0x1F620),
    "8)": String.fromCodePoint(0x1F60E),
    "8(": String.fromCodePoint(0x1F623),
    ":]": String.fromCodePoint(0x1F60A),
    ":}": String.fromCodePoint(0x1F60A),
    ":{": String.fromCodePoint(0x1F641),
    ":/": String.fromCodePoint(0x1F615),
    ":\\": String.fromCodePoint(0x1F615),
    ":s": String.fromCodePoint(0x1F616),
    ":$": String.fromCodePoint(0x1F633),
    ":#": String.fromCodePoint(0x1F645),
    ":x": String.fromCodePoint(0x1F636),
    ":!": String.fromCodePoint(0x1F631),
    ":^)": String.fromCodePoint(0x1F60F),
    ":smirk:": String.fromCodePoint(0x1F60F),
    ":heart:": String.fromCodePoint(0x2764),
    ":star:": String.fromCodePoint(0x2B50),
    ":exclamation:": String.fromCodePoint(0x2757),
    ":question:": String.fromCodePoint(0x2753),
    ":arrow_up:": String.fromCodePoint(0x2B06),
    ":arrow_down:": String.fromCodePoint(0x2B07),
    ":arrow_left:": String.fromCodePoint(0x2B05),
    ":arrow_right:": String.fromCodePoint(0x27A1),
    ":ok_hand:": String.fromCodePoint(0x1F44C),
    ":thumbsup:": String.fromCodePoint(0x1F44D),
    ":thumbsdown:": String.fromCodePoint(0x1F44E),
    ":clap:": String.fromCodePoint(0x1F44F),
    ":pray:": String.fromCodePoint(0x1F64F),
    ":muscle:": String.fromCodePoint(0x1F4AA),
    ":poop:": String.fromCodePoint(0x1F4A9),
    ":bomb:": String.fromCodePoint(0x1F4A3),
    ":fire:": String.fromCodePoint(0x1F525),
    ":100:": String.fromCodePoint(0x1F4AF)
  } // Map of Unicode emojis for each matched emoji


  useEffect(() => {
    if (show) {
      const newSocket = new WebSocket('ws://localhost:8080/ws')

      setSocket(newSocket)

      newSocket.addEventListener('open', () => {
        console.log('WebSocket connection established')
        const payload = {
          cookie: cookie,
          group_id: -1,
        }
        newSocket.send(JSON.stringify(payload))
      })

      newSocket.addEventListener('message', (event) => {
        const jsonData = JSON.parse(event.data)
        setMessages(jsonData)
        setScrollToBottom(true)
      })

      return () => {
        newSocket.close()
        console.log('closing')
        setSocket(null)
      }
    }
  }, [show])

  const handleClick = (toID, content) => {
    if (socket && content !== "") {
      console.log('saatsin midagi socketisse')

      const payload = {
        cookie: cookie,
        content: content,
        to_id: toID,
        group_id: -1,
      }

      socket.send(JSON.stringify(payload))
    }
  }

  useEffect(() => {
    if (show) {
      if (scrollToBottom && chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        setScrollToBottom(false)
      }
    }
  }, [scrollToBottom, selectedFriend])

  const handleFriendClick = (id) => {
    console.log('friend handlefriendclickis', id)
    setSelectedFriend(friends.find((friend) => friend.friend.user_id === id))
    setScrollToBottom(true)
    console.log('selectedfriend', selectedFriend)
  }

  useEffect(() => {
    if (selectedChat) {
      console.log('useeffectis', selectedFriend)
      console.log('seeonid', selectedChat.friend.user_id)
      // setSelectedFriend()
      handleFriendClick(selectedChat.friend.user_id)
    }
  }, [selectedChat])

  const handleSendMessage = (e) => {
    e.preventDefault()
    // add message to selectedFriend's messages array
    setMessageText('')
    setScrollToBottom(true)
  }

  return (
    <>
      {show ? (
        <Modal show={show} onHide={setShow}>
          <Modal.Header closeButton>
            <Modal.Title>Chat Window</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4}>
                <div style={{ overflowY: 'auto', maxHeight: '40vw' }}>
                  <ListGroup>
                    {friends.map((friend) => (
                      <ListGroup.Item key={friend.friend.user_id} action active={friend === selectedFriend} onClick={() => handleFriendClick(friend.friend.user_id)}>
                        {friend.friend.first_name} {friend.friend.last_name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </Col>
              <Col>
                <div ref={chatContainerRef} style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {selectedFriend ? (
                    <ListGroup>
                      {messages && messages.length > 0 &&
                        messages.filter((message) =>
                          (message.from_id === currentUser && message.to_id === selectedFriend.friend.user_id) ||
                          (message.from_id === selectedFriend.friend.user_id && message.to_id === currentUser)
                        )
                          .map((message) => (
                            <ListGroup.Item key={message.message_id} style={{ wordBreak: "break-all" }}>
                              <strong>{message.from_id === currentUser ? "You" : selectedFriend.friend.first_name}</strong>:
                              {message.content.replace(regex, (match) => unicodeEmojis[match])}
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
                      <Form.Control type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
                    </Form.Group>
                    <Button type="submit" onClick={() => handleClick(selectedFriend.friend.user_id, messageText)}>
                      Send
                    </Button>
                  </Form>
                )}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      ) : null}
    </>
  )
}

export default ChatWindow


