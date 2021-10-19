import React, { useState } from 'react';
import { FaRegSmileWink } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import { getDatabase, ref, push, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const ChatRooms = () => {
  const [show, setShow] = useState(false);
  const [roomNameInput, setRoomNameInput] = useState('');
  const [roomDescInput, setRoomDescInput] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('handleSubmit', roomNameInput, roomDescInput);
    const roomName = roomNameInput;
    const roomDesc = roomDescInput;
    if (roomName && roomDesc) {
      addChatRoom(roomName, roomName);
      setShow(false);
    }
    setRoomDescInput('');
    setRoomNameInput('');
  };

  const addChatRoom = (roomName, roomDesc) => {
    console.log('채팅방 만들어주기');

    console.log('만들어주기 위해 받은 방이름', roomName);
    console.log('만들어주기 위해 받은 방설명', roomDesc);
    const db = getDatabase();
    const chatroomListRef = ref(db, 'chatRooms');
    const newChatRoomRef = push(chatroomListRef);
    set(newChatRoomRef, {
      id: newChatRoomRef.key,
      name: roomName,
      desc: roomDesc,
      createdBy: {
        name: user.displayName,
        image: user.photoURL,
      },
      // ...
    });
  };

  console.log('초기화 되어서 나타나야할', roomNameInput, roomDescInput);

  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FaRegSmileWink style={{ marginRight: 3 }} />
        CHAT ROOMS
        <FaPlus
          onClick={handleShow}
          style={{
            position: 'absolute',
            right: 0,
            cursor: 'pointer',
          }}
        />
      </div>
      {/* ADD CHAT ROOM MODAL */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label>방 이름</Form.Label>
              <Form.Control
                type='text'
                placeholder='방 이름을 설정해주세요.'
                onChange={(e) => setRoomNameInput(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>설명</Form.Label>
              <Form.Control
                type='text'
                placeholder='방에대한 설명을 입력해주세요. (선택)'
                onChange={(e) => setRoomDescInput(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            닫기
          </Button>
          <Button variant='primary' onClick={handleSubmit}>
            방만들기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChatRooms;
