import React from 'react';
import SidePanel from './SidePanel/SidePanel';
import MainPanel from './MainPanel/MainPanel';

const ChatPage = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '375px' }}>
        <SidePanel />
      </div>
      <div className='' style={{ width: '100%' }}>
        <MainPanel />
      </div>
    </div>
  );
};

export default ChatPage;
