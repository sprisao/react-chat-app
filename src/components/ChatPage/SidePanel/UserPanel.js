import React, { useRef, useState } from 'react';
import { MdTry } from 'react-icons/md';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';

import { useSelector, useDispatch } from 'react-redux';
import { setPhotoURL } from '../../../redux/actions/user_action';

import { getAuth, signOut, updateProfile } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

import mime from 'mime-types';

const UserPanel = () => {
  const [newURL, setNewURL] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;
  const dispatch = useDispatch();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('로그아웃 되었습니다');
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const inputOpenImageRef = useRef();

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `images/${user.uid}`);
    const metadata = { contentType: mime.lookup(file.name) };
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    await uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setNewURL(downloadURL);
          dispatch(setPhotoURL(downloadURL));
        });
      }
    );
    await updateProfile(auth.currentUser, {
      photoURL: newURL,
    })
      .then(() => {
        // Profile updated!
        // ...
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  };
  console.log(user);
  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
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
            <Dropdown.Item onClick={handleOpenImageRef}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <input
        type='file'
        accept='image/jpeg, image/png'
        ref={inputOpenImageRef}
        style={{ display: 'none' }}
        onChange={handleUploadImage}
      />
    </div>
  );
};

export default UserPanel;
