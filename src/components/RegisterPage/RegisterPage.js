import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// import md5 from 'md5';

// Import the functions you need from the SDKs you need
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const RegisterPage = () => {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: 'onChange' });
  const [loading, setLoading] = useState(false);
  const [createdUser, setCreatedUser] = useState('');

  const auth = getAuth();
  const password = useRef();
  password.current = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);

    // 인증 진행
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        setLoading(false);
        // Signed in
        setCreatedUser(userCredential.user);
        console.log('사용자', createdUser);
        // ...
      })
      .catch((error) => {
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log(errorCode);
        console.log(errorMessage);
      });

    // 추가 정보 업데이트

    await updateProfile(auth.currentUser, {
      displayName: data.name,
      photoURL: 'no photo',
    })
      .then(() => {
        console.log('profile updated!!');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log(errorCode);
        console.log(errorMessage);
      });

    const user = auth.currentUser;
    const db = getDatabase();
    await set(ref(db, 'users/' + user.uid), {
      username: user.displayName,
      email: user.email,
      profile_picture: user.photoURL,
    });
  };

  return (
    <div className='auth-wrapper'>
      <div style={{ textAlign: 'center' }}>
        <h3>Register</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input
          name='email'
          type='email'
          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>이메일은 필수입력 사항입니다.</p>}

        <label>Name</label>
        <input
          name='name'
          type='name'
          {...register('name', { required: true, maxLength: 7 })}
        />
        {errors.name && errors.name.type === 'required' && (
          <p>이름은 필수입력 사항입니다.</p>
        )}
        {errors.name && errors.name.type === 'maxLength' && (
          <p>이름은 7자 이상 사용하실 수 없습니다.</p>
        )}
        {errors.name === 'maxLength' && <p>Your input exceed maximum length</p>}

        <label>Password</label>
        <input
          name='password'
          type='password'
          {...register('password', { required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === 'required' && (
          <p>비밀번호는 필수입력 사항입니다.</p>
        )}
        {errors.password && errors.password.type === 'minLength' && (
          <p>Password must have at least 6 Len</p>
        )}

        <label>Password Confirm</label>
        <input
          name='password_confirm'
          type='password'
          {...register('password_confirm', {
            required: true,
            validate: (value) => value === password.current,
          })}
        />
        {errors.password_confirm &&
          errors.password_confirm.type === 'required' && (
            <p>비밀번호는 필수입력 사항입니다.</p>
          )}
        {errors.password_confirm &&
          errors.password_confirm.type === 'validate' && (
            <p>입력하신 비밀번호와 일치하지 않습니다</p>
          )}
        <input type='submit' disabled={loading} />
        <Link to='login'>이미 아이디가 있다면</Link>
      </form>
    </div>
  );
};

export default RegisterPage;
