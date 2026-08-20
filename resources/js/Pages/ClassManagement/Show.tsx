import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Course } from "@/types"

export default function CourseShow({ course }: { course: Course }) {
    return <AuthenticatedLayout>
        <main>
            <h1>Class Detail</h1>
        </main>
    </AuthenticatedLayout>
}
