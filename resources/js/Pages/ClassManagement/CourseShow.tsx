import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Course } from "@/types"

export default function CourseShow({ course }: { course: Course }) {
    return <AuthenticatedLayout>
        <section id="course_overview" className="bg-white w-full">
            <div className="flex justify-between">
                <h1>{course.subject}&ndash;{course.period}.{course.order}&ndash;P1</h1>
                <div className="flex gap-3">
                    <span>{course.type}</span>
                    <button>Edit</button>
                </div>
            </div>
            <h1>Class Room</h1>
            <section id="class_detail" className="flex">
                <section>
                    <div>
                        <p className="font-semibold">Teacher</p>
                        <p>{course.teacher.first_name}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Release Schedule</p>
                        <p>{course.scheduled_at || '-'}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Level</p>
                        <p>{course.level}</p>
                    </div>
                    <div id="class_link">
                        <p className="font-semibold">Class Link</p>
                        <p>main</p>
                        <p>alias</p>
                    </div>
                </section>
            </section>
        </section>
        <section id="start_lesson_plan"></section>
        <section id="start_active_class"></section>
        <section id="start_report"></section>
        <section id="start_parent_meeting"></section>
    </AuthenticatedLayout>
}
