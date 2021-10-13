import React from 'react';
import { MdTry } from 'react-icons/md';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useSelector } from 'react-redux';
import { getAuth, signOut } from 'firebase/auth';

const UserPanel = () => {
  const user = useSelector((state) => state.user.currentUser);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('로그아웃 되었습니다');
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <div>
      <h3 style={{ color: 'white' }}>
        <MdTry /> Bruce Chat
      </h3>
      <div className='' style={{ display: 'flex', marginBottom: '1rem' }}>
        <Image
          src={user && user.photoURL}
          style={{ width: '30px', height: '30px', marginTop: '3px' }}
          roundedCircle
        />
        <Dropdown>
          <Dropdown.Toggle
            style={{ background: 'transparent', border: '0px' }}
            id='dropdown-basic'
          >
            {user && user.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href='#/action-1'>프로필 사진 변경</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default UserPanel;
