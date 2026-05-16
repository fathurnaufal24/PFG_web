import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { FormEventHandler, useEffect } from 'react';
import { Transition } from '@headlessui/react';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const user = usePage().props.auth.user;

    // let profile;

    // if (user.role === 'teacher') profile = user.teacher;
    // if (user.role === 'student') profile = user.student;
    // if (user.role === 'admin') profile = user.curriculum;

    // const notTeacher = user.role === 'admin' || user.role === 'student';
    type FormDataProps = {
        first_name?: string;
        last_name?: string;
        pob?: string;
        dob?: string;
        domicile?: string;
        card_number?: string;

        name?: string;

        email: string;

        current_password: string;
        password: string;
        password_confirmation: string;
    };

    let initialData: FormDataProps;

    if (user.role === 'teacher') {
        initialData = {
            first_name: user.teacher.first_name,
            last_name: user.teacher.last_name ?? '',
            pob: user.teacher.pob ?? '',
            dob: user.teacher.dob ?? '',
            domicile: user.teacher.domicile ?? '',
            card_number: user.teacher.card_number ?? '',

            name: '',
            email: user.email,

            current_password: '',
            password: '',
            password_confirmation: '',
        };
    } else if (user.role === 'admin') {
        initialData = {
            first_name: '',
            last_name: '',
            pob: '',
            dob: '',
            domicile: '',
            card_number: '',

            name: user.curriculum.name ?? '',
            email: user.email,

            current_password: '',
            password: '',
            password_confirmation: '',
        };
    } else {
        // student
        initialData = {
            first_name: '',
            last_name: '',
            pob: '',
            dob: '',
            domicile: '',
            card_number: '',

            name: user.student.name ?? '',
            email: user.email,

            current_password: '',
            password: '',
            password_confirmation: '',
        };
    }

    // begin edit
    // const initialData = {
    //     email: user.email,
    //     current_password: '',
    //     password: '',
    //     password_confirmation: '',
    // };

    const { data, setData, put, patch, processing, errors, recentlySuccessful } = useForm(initialData);

    useEffect(() => {
        console.log(user.role);
    }, []);
    // end edit

    // const { data, setData, put, patch, errors } = useForm({
    //     first_name: user.teacher?.first_name,
    //     last_name: user.teacher?.last_name,
    //     pob: user.teacher?.pob,
    //     dob: user.teacher?.dob,
    //     domicile: user.teacher?.domicile,
    //     card_number: user.teacher?.card_number,
    //     email: user.email,
    //     current_password: '',
    //     password: '',
    //     password_confirmation: ''
    // });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('tombol ditekan');
        patch(route('profile.update'));
    };

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Profile" />
            <div className='bg-white p-3'>
                <div className='flex justify-between items-center'>
                    <h1>My Profile</h1>
                    <div className='flex gap-4 items-center'>
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Saved.
                            </p>
                        </Transition>
                        <PrimaryButton type='submit' form='profile_form' disabled={processing}>{(processing) ? 'Saving' : 'Save'}</PrimaryButton>
                    </div>
                </div>
                <div className='flex gap-12'>
                    <form onSubmit={submit} id='profile_form' className='flex flex-col'>

                        {(user.role === 'teacher') ?
                            <>
                                <InputLabel htmlFor="first_name" value='First Name' />
                                <TextInput
                                    id='first_name'
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                />
                                <InputLabel htmlFor="last_name" value='Last Name' />
                                <TextInput
                                    id='last_name'
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                />
                            </> :
                            <>
                                <InputLabel htmlFor="name" value='Name' />
                                <TextInput
                                    id='name'
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                            </>
                        }
                        {
                            (user.role === 'teacher') &&
                            <>
                                <InputLabel htmlFor="pob" value='Place of Birth' />
                                <TextInput
                                    id='pob'
                                    value={data.pob}
                                    onChange={(e) => setData('pob', e.target.value)}
                                />
                                <InputLabel htmlFor="dob" value='Date of Birth' />
                                <TextInput
                                    id='dob'
                                    value={data.dob}
                                    onChange={(e) => setData('dob', e.target.value)}
                                />
                                <InputLabel htmlFor="domicile" value='Domicile' />
                                <TextInput
                                    id='domicile'
                                    value={data.domicile}
                                    onChange={(e) => setData('domicile', e.target.value)}
                                />
                                <InputLabel htmlFor="card_number" value='Card Number' />
                                <TextInput
                                    id='card_number'
                                    value={data.card_number}
                                    onChange={(e) => setData('card_number', e.target.value)}
                                />
                            </>
                        }
                        <InputLabel htmlFor='email' value='Email' />
                        <TextInput
                            id='email'
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </form>
                    <form onSubmit={updatePassword} id='update_password_form'>
                        <div className='flex flex-col border rounded p-4 mt-5'>
                            <h2>Change Password</h2>
                            <InputLabel htmlFor='current_password' value='Current Password' />
                            <TextInput
                                type='password'
                                id='current_password'
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                            />
                            <InputLabel htmlFor='password' value='New Password' />
                            <TextInput
                                type='password'
                                id='password'
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputLabel htmlFor='password_confirmation' value='Confirm New Password' />
                            <TextInput
                                type='password'
                                id='password_confirmation'
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                            <PrimaryButton>Change Password</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
