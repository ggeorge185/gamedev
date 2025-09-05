import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, GamepadIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setGameAuthUser } from '@/redux/gameAuthSlice';

const GameUserLogin = () => {
  const [input, setInput] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { gameUser } = useSelector((store) => store.gameAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('/api/v1/gameuser/login', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setGameAuthUser(res.data.gameUser));
        toast.success(res.data.message);
        navigate('/game');
        setInput({
          email: '',
          password: ''
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gameUser) {
      navigate('/game');
    }
  }, []);

  return (
    <div className='flex items-center w-screen h-screen justify-center bg-gradient-to-br from-green-50 to-blue-100'>
      <div className='w-full max-w-md'>
        <form onSubmit={loginHandler} className='bg-white shadow-lg rounded-lg flex flex-col gap-5 p-8'>
          <div className='my-4 text-center'>
            <div className='flex items-center justify-center gap-2 mb-4'>
              <GamepadIcon className='w-8 h-8 text-green-600' />
              <h1 className='text-2xl font-bold text-green-600'>German Learning Game</h1>
            </div>
            <p className='text-sm text-gray-600'>Login to start your German learning journey</p>
          </div>
          <div>
            <span className='font-medium'>Email</span>
            <Input
              type='email'
              name='email'
              value={input.email}
              onChange={changeEventHandler}
              className='focus-visible:ring-transparent my-2'
              required
            />
          </div>
          <div>
            <span className='font-medium'>Password</span>
            <Input
              type='password'
              name='password'
              value={input.password}
              onChange={changeEventHandler}
              className='focus-visible:ring-transparent my-2'
              required
            />
          </div>
          {loading ? (
            <Button disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button type='submit' className='bg-green-600 hover:bg-green-700'>
              Login
            </Button>
          )}
          <span className='text-center'>
            Don't have an account? <Link to="/game-signup" className='text-green-600 hover:underline'>Signup</Link>
          </span>
{/*           <div className='mt-4 text-center'>
             <Link to="/login" className='text-sm text-gray-500 hover:underline'>
             Admin Login
            </Link> 
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default GameUserLogin;
