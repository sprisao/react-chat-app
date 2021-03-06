import React, { useRef } from 'react';
import { MdTry } from 'react-icons/md';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';

import { useDispatch } from 'react-redux';
import { setPhotoURL } from '../../../redux/actions/user_action';

import { getAuth, signOut, updateProfile } from 'firebase/auth';
import {
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  ref as newRef,
} from 'firebase/storage';

import { getDatabase, update, ref as realtimeRef } from 'firebase/database';

import mime from 'mime-types';

const UserPanel = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const dispatch = useDispatch();
  const db = getDatabase();

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

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    const storage = getStorage();
    const storageRef = newRef(storage, `images/${user.uid}`);
    const metadata = { contentType: mime.lookup(file.name) };
    const uploadTask = uploadBytesResumable(storageRef, file);
    const dbRef = realtimeRef(db, `users/${user.uid}/`);

    // 스토리지에 업로드
    uploadTask.on(
      'state_changed',
      (snapshot) => {
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
        console.log('업로드 안됨', error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // 리덕스 업데이트
          dispatch(setPhotoURL(downloadURL));

          // 프로필 이미지 업데이트
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          })
            .then(() => {
              console.log(downloadURL);
            })
            .catch((error) => {
              // An error occurred
              // ...
            });

          // 실시간 데이터베이스 업데이트
          update(dbRef, { profile_picture: downloadURL })
            .then(() => {
              console.log('업데이트 완료');
            })
            .catch((e) => {
              console.log(e);
            });
        });
      }
    );

    // currentUser의 photoURL 값 Update

    // Realtime Database의 photoURL Update
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
