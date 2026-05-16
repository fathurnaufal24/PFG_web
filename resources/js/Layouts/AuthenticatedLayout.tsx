import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { IoMenuSharp, IoNotificationsSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

export default function AuthenticatedLayout({
    className = '',
    children,
}: PropsWithChildren<{className?: string}>) {
    const user = usePage().props.auth.user;
    useEffect(() => {
        console.log((user.role === 'admin') && user.curriculum);
    }, []);
    const name = (user.role === 'teacher')? user.teacher.first_name : (user.role === 'admin')? user.curriculum.name : user.student.name;


    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);

    return <main className='min-h-screen bg-slate-200'>
        <Head>
            <title>Dashboard</title>
        </Head>
        <nav className='p-3 flex justify-between items-center bg-blue-400 relative'>
            <div className={`absolute top-16 bg-white ${showingNavigationDropdown? 'block' : 'hidden'}`}>
                <section className='flex flex-col'>
                    <NavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</NavLink>
                    <NavLink href={route('course')} active={route().current('course')}>Class Management</NavLink>
                    <NavLink href={route('revenue')} active={route().current('revenue')}>Revenue</NavLink>
                    <NavLink href={route('schedule')} active={route().current('schedule')}>My Schedule</NavLink>
                    <NavLink href={route('module')} active={route().current('module')}>Module</NavLink>
                    <NavLink href={route('classoffering')} active={route().current('classoffering')}>Class Offering</NavLink>
                </section>
            </div>
            {
                profileDropdown &&
                <div className={`absolute top-16 right-0 bg-white`}>
                <section className='flex flex-col'>
                    <Link className='p-5' href={route('profile.edit')}>Edit Profile</Link>
                    <Link className='p-5' href={route('logout')} method='post'>Logout</Link>
                </section>
            </div>
            }
            <div className='flex items-center'>
                <IoMenuSharp size={32} className='cursor-pointer' onClick={() => setShowingNavigationDropdown((e) => !e)} />
                <IoNotificationsSharp size={32} />
            </div>
            <div className='flex items-center cursor-pointer' onClick={() => setProfileDropdown(e => !e)}>
                <p>Welcome, {name}</p>
                <FaUser size={32}/>
            </div>
        </nav>
        <div className={`flex p-5 justify-center items-center ` + className}>
            {children}
        </div>
    </main>;
}
