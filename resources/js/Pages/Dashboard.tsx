import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {usePage} from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { IoMenuSharp, IoNotificationsSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

export default function Dashboard() {
    const user = usePage().props.auth.user;
    return <AuthenticatedLayout>
        <div className='flex gap-6'>
            <section className='bg-white flex'>
                <div>Gambar</div>
                <div>
                    <h1>Welcome, {(user.role === 'teacher')? user.teacher.first_name : (user.role === 'admin')? user.curriculum.name : user.student.name}</h1>
                    <p>Remember to begin your day with Bismillah. Also, your performance score has now
                        reached 61.19 % out of the 75% standard. Feel free to share this with the Super Teacher
                        or the Curriculum Team. Insya Allah, it will become green! May your study session go well,
                        keep the spirit high!</p>
                </div>
            </section>
            <section className='bg-white'>
                <h1>Teacher Performance</h1>
                <div></div>
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </section>
        </div>
        <section className='bg-white'>
            <div>Pending Attendance</div>
            <ul>
                <li>asdfasdfdsa</li>
                <li>asdfasdfasdf</li>
                <li>asdfasdfasdf</li>
                <li>asdfasdfasdf</li>
            </ul>
        </section>
    </AuthenticatedLayout>
}
