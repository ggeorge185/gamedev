<<<<<<< HEAD
import { Home, LogOut, PlusSquare, Search, BookOpen, User, GamepadIcon, PlaySquare, Library } from 'lucide-react'
=======
import { Home, LogOut, PlusSquare, Search, BookOpen, User, Table2, Settings } from 'lucide-react'
>>>>>>> cb49ee8418adf8ecf637648a7497a9d945b1cd7e
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
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
<<<<<<< HEAD
        } else if (textType === 'Games') {
            navigate("/games");
        } else if (textType === 'Scenarios') {
            navigate("/scenarios");
        } else if (textType === 'Collections') {
            navigate("/scenario-collections");
        }
    }

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <PlusSquare />, text: "Add Word" },
        { icon: <BookOpen />, text: "My Words" },
        { icon: <GamepadIcon />, text: "Games" },
        { icon: <PlaySquare />, text: "Scenarios" },
        { icon: <Library />, text: "Collections" },
        { icon: <LogOut />, text: "Logout" },
=======
        } else if (textType === 'Mini Game Table') {
            navigate("/mini-game-table");
        } else if (textType === 'Game Types') {
            navigate("/game-types");
        } else if (textType === 'Scenario Config') {
            navigate("/scenario-config");
        }
    }

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <PlusSquare />, text: "Add Word" },
        { icon: <BookOpen />, text: "My Words" },
        { icon: <Table2 />, text: "Mini Game Table" },
        { icon: <User />, text: "Game Types" },
        { icon: <Settings />, text: "Scenario Config" },
        { icon: <LogOut />, text: "Logout" },
>>>>>>> cb49ee8418adf8ecf637648a7497a9d945b1cd7e
    ]

    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen bg-white'>
            <div className='flex flex-col'>
<<<<<<< HEAD
                <h1 className='my-8 pl-3 font-bold text-xl text-blue-600'>Language Game Admin</h1>
=======
                <h1 className='my-8 pl-3 font-bold text-xl text-blue-600'>Serious Game admin board</h1>
>>>>>>> cb49ee8418adf8ecf637648a7497a9d945b1cd7e
                <div>
                    {sidebarItems.map((item, index) => {
                        return (
                            <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                                {item.icon}
                                <span>{item.text}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
<<<<<<< HEAD

=======
>>>>>>> cb49ee8418adf8ecf637648a7497a9d945b1cd7e
            <AddWordForm open={open} setOpen={setOpen} />
        </div>
    )
}

export default LeftSidebar
