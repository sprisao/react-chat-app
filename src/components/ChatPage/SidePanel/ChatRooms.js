import React, { useState, useEffect } from 'react';
import { FaRegSmileWink } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onValue,
  get,
  child,
} from 'firebase/database';

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChatRoom } from '../../../redux/actions/chatRoom_action';

import { getAuth } from 'firebase/auth';

const ChatRooms = () => {
  const [show, setShow] = useState(false);
  const [roomNameInput, setRoomNameInput] = useState('');
  const [roomDescInput, setRoomDescInput] = useState('');
  const [chatRooms, setChatRooms] = useState([]);
  const [activeChatroom, setActiveChatroom] = useState('');

  // 인증부분
  const auth = getAuth();
  const user = auth.currentUser;

  // 실시간 데이터 부분
  const db = getDatabase();
  const chatroomListRef = ref(db, 'chatRooms');
  const newChatRoomRef = push(chatroomListRef);

  // 모달 설정
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // 리덕스 부분
  let dispatch = useDispatch();

  // 방생성 Submit
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

  // 실시간 데이터에 채팅방 추가
  const addChatRoom = (roomName, roomDesc) => {
    console.log('채팅방 만들어주기');

    console.log('만들어주기 위해 받은 방이름', roomName);
    console.log('만들어주기 위해 받은 방설명', roomDesc);
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

  // 실시간 채팅방 리스트 불러오기
  let dataArray = [];
  // get(child(chatroomListRef, '/'))
  //   .then((snapshot) => {
  //     if (snapshot.exists()) {
  //       setChatRooms(snapshot.val());
  //     } else {
  //       console.log('No data available');
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });

  // 채팅방 추가시 리스트 업데이트
  useEffect(() => {
    onChildAdded(chatroomListRef, (data) => {
      dataArray.push(data.val());
      setChatRooms(dataArray);
    });
    console.log(chatRooms);
  }, []);

  // 현재 채팅방 상태 변경

  const changeChatroom = (room) => {
    dispatch(setCurrentChatRoom(room));
    setActiveChatroom(room.id);
  };

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

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {chatRooms.length > 0 &&
          chatRooms.map((item) => (
            <li
              key={item.id}
              style={{
                backgroundColor: item.id === activeChatroom && '#ffffff45',
              }}
              onClick={() => changeChatroom(item)}
            >
              # {item.name}
            </li>
          ))}
      </ul>

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
