import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const RegisterPage = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  console.log(watch('email'));

  return (
    <div className='auth-wrapper'>
      <div style={{ textAlign: 'center' }}>
        <h3>Register</h3>
      </div>
      <form>
        <label>Email</label>
        <input
          name='email'
          type='email'
          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>This field is required.</p>}
        <label>Name</label>
        <input
          name='name'
          {...register('name', { required: true, maxLength: 10 })}
        />
        {errors.name === 'required' && <p>This field is required.</p>}
        {errors.name === 'maxLength' && <p>Your input exceed maximum length</p>}
        <label>Password</label>
        <input
          name='password'
          type='password'
          {...register('password', { required: true, maxLength: 6 })}
        />
        {errors.password && errors.password.type === 'required' && (
          <p>This field is required.</p>
        )}
        <label>Password Confirm</label>
        <input name='password_confirm' type='password_confirm' />
        <input type='submit' />
      </form>
      <Link>이미 아이디가 있다면</Link>
    </div>
  );
};

export default RegisterPage;
