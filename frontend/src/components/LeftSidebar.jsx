import { Home, LogOut, PlusSquare, Search, BookOpen } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setAuthUser } from '@/redux/authSlice'
import AddWordForm from './AddWordForm'
import { setWords } from '@/redux/wordSlice'

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get('/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setWords([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Add Word") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'My Words') {
            navigate("/my-words");
        } else if (textType === 'Search') {
            navigate("/search");
        }
    }

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <PlusSquare />, text: "Add Word" },
        { icon: <BookOpen />, text: "My Words" },
        { icon: <LogOut />, text: "Logout" },
    ]

    return (
        <aside className='w-64 h-screen bg-white border-r border-gray-300 px-4 flex flex-col'>
            <h1 className='my-8 pl-3 font-bold text-xl text-blue-600'>Serious Game admin board</h1>
            <div>
                {sidebarItems.map((item, index) => (
                    <div
                        onClick={() => sidebarHandler(item.text)}
                        key={index}
                        className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'
                    >
                        {item.icon}
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
            <AddWordForm open={open} setOpen={setOpen} />
        </aside>
    )
}

export default LeftSidebar
