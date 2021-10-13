import React from 'react';
import ChatRooms from './ChatRooms';
import Favorited from './Favorited';
import DirectMessages from './DirectMessages';
import UserPanel from './UserPanel';

const Sidepanel = () => {
  return (
    <div
      className=''
      style={{
        backgroundColor: '#7b83EB',
        padding: '2rem',
        minHeight: '100vh',
        color: 'white',
        minWidth: '275px',
      }}
    >
      <UserPanel />
      <Favorited />
      <ChatRooms />
      <DirectMessages />
    </div>
  );
};

export default Sidepanel;
