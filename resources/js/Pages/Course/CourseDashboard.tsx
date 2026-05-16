import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, useForm } from "@inertiajs/react";
import { MdOutlineEdit } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { Dialog, DialogTitle, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Course, PageProps } from "@/types";
import { useState, useEffect, Fragment } from "react";
import { TbRuler } from "react-icons/tb";



export default function CourseDashboard({ canCreate, courses }: PageProps<{ canCreate: boolean; courses: Course[] }>) {
    useEffect(() => {
        console.log(courses);
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        subject: '',
        level: '',
        period: '',
        order: '',
        type: '',
        session: '',
        note: '',
        schedule_at: '',
        teacher_id: '' // Jika admin, perlu pilih teacher
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('course.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    return <AuthenticatedLayout className="flex-col gap-5">
        <section className="bg-white">
            <h1>Class Overview</h1>
            <div className="flex gap-3">
                <div>
                    <h2>Lesson Plan</h2>
                    <p>Lorem ipsum</p>
                </div>
                <div>
                    <h2>Active</h2>
                    <p>Lorem ipsum</p>
                </div>
                <div>
                    <h2>Report</h2>
                    <p>Lorem ipsum</p>
                </div>
                <div>
                    <h2>Parent Meeting</h2>
                    <p>Lorem ipsum</p>
                </div>
                <div>
                    <h2>Class Ended</h2>
                    <p>Lorem ipsum</p>
                </div>
            </div>
        </section>
        <section className="bg-white">
            <div id="nav_class" className="flex justify-start gap-5">
                <Link>Lesson Plan</Link>
                <Link>Active</Link>
                <Link>Report</Link>
                <Link>Parent Meeting</Link>
                <Link>Class Ended</Link>
            </div>
            <div>
                <div className="flex justify-between">
                    <div id="search">Search</div>
                    {canCreate &&
                        <>
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
                            <button
                                id="add_class"
                                onClick={() => setIsModalOpen(true)}
                            >+ Add Class</button>
                        </>
                    }
                </div>
                <div className="grid grid-cols-8 gap-4 border p-4 rounded-lg">

                    {/* Header */}
                    <div className="font-semibold border-b pb-2">No</div>
                    <div className="font-semibold border-b pb-2">Subject</div>
                    <div className="font-semibold border-b pb-2">Level</div>
                    <div className="font-semibold border-b pb-2">Type</div>
                    <div className="font-semibold border-b pb-2">Session</div>
                    <div className="font-semibold border-b pb-2">Release Schedule</div>
                    <div className="font-semibold border-b pb-2">Students</div>
                    <div className="font-semibold border-b pb-2">Action</div>

                    {/* Row */}
                    {
                        courses.map((e, idx) =>
                            <Fragment key={e.id}>
                                <div>{idx + 1}</div>
                                <div>{e.subject}&ndash;{e.period}.{e.order}&ndash;P1</div>
                                <div>{e.level}</div>
                                <div>{e.type}</div>
                                <div>{e.session}</div>
                                <div>
                                    {(e.scheduled_at ? e.scheduled_at : '-')}
                                </div>
                                <div>{(e.student)? e.student + ' Students' : '0 Student'}</div>
                                <div className="flex justify-start gap-4">
                                    {
                                        (canCreate &&
                                            <button><MdOutlineEdit /></button>
                                        )
                                    }

                                    <Link href={`/course/${e.id}`}><GrView /></Link>
                                </div>
                            </Fragment>
                        )
                    }

                </div>
            </div>
        </section>

        {/* ========== BEGIN MODAL COURSE ========== */}
        <Transition appear show={isModalOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={() => setIsModalOpen(false)}
            >
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                <DialogTitle className="text-lg font-medium mb-4">
                                    Create New Course
                                </DialogTitle>

                                <form onSubmit={handleSubmit}>
                                    {/* Form fields */}
                                    <div className="space-y-4">
                                        <div>
                                            <label id="class_subject" className="block text-sm font-medium">Class Subject</label>
                                            <input
                                                type="text"
                                                value={data.subject}
                                                onChange={e => setData('subject', e.target.value)}
                                                className="mt-1 block w-full border rounded p-2"
                                            />
                                            {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
                                        </div>
                                        {/* Add other fields... */}
                                        <div>
                                            <label id="class_type" className="block text-sm font-medium text-gray-700">
                                                Class Type
                                            </label>
                                            <select
                                                value={data.type}
                                                onChange={e => setData('type', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                                required
                                            >
                                                <option value="" disabled>Select class type</option>
                                                <option value="trial">Trial</option>
                                                <option value="reguler">Reguler</option>
                                                <option value="private">Private</option>
                                            </select>
                                            {errors.type && (
                                                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div>
                                                <label id="class_period_code" className="block text-sm font-medium">Class Period Code</label>
                                                <input
                                                    type="text"
                                                    value={data.period}
                                                    onChange={e => setData('period', e.target.value)}
                                                    className="mt-1 block w-full border rounded p-2"
                                                />
                                                {errors.period && <p className="text-red-500 text-sm">{errors.period}</p>}
                                            </div>
                                            <div>
                                                <label id="class_order_code" className="block text-sm font-medium">Class Order Code</label>
                                                <input
                                                    type="text"
                                                    value={data.order}
                                                    onChange={e => setData('order', e.target.value)}
                                                    className="mt-1 block w-full border rounded p-2"
                                                />
                                                {errors.order && <p className="text-red-500 text-sm">{errors.order}</p>}
                                            </div>
                                            <div>
                                                <label id="class_level" className="block text-sm font-medium">Level</label>
                                                <input
                                                    type="text"
                                                    value={data.level}
                                                    onChange={e => setData('level', e.target.value)}
                                                    className="mt-1 block w-full border rounded p-2"
                                                />
                                                {errors.level && <p className="text-red-500 text-sm">{errors.level}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Start Schedule
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    value={data.schedule_at}
                                                    onChange={e => setData('schedule_at', e.target.value)}
                                                    className="mt-1 block w-full border rounded-md p-2"
                                                />
                                                {errors.schedule_at && <p className="text-red-500 text-sm">{errors.schedule_at}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Note
                                            </label>
                                            <textarea
                                                value={data.note}
                                                onChange={e => setData('note', e.target.value)}
                                                rows={3}
                                                className="mt-1 block w-full border rounded-md p-2"
                                                placeholder="Additional notes..."
                                            />
                                            {errors.note && <p className="text-red-500 text-sm">{errors.note}</p>}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 border rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-blue-500 text-white rounded"
                                        >
                                            Create
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
        {/* ========== END MODAL COURSE ========== */}
    </AuthenticatedLayout>
}
