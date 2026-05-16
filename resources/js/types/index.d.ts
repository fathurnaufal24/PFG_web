// resources/js/types/index.d.ts

export interface BaseUser {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    // role: 'teacher' | 'admin' | 'student';
}

export type User =
    | (BaseUser & {
        role: 'teacher';
        teacher: TeacherProps;
    })
    | (BaseUser & {
        role: 'admin';
        curriculum: CurriculumProps;
    })
    | BaseUser & {
        role: 'student';
        student: StudentProps;
    }

// export interface Teacher extends User {
//     // role: 'teacher';
//     teacher: TeacherProps;
// }

// export interface Curriculum extends User {
//     // role: 'admin';
//     curriculum: CurriculumProps;
// }

// export interface Student extends User {
//     // role: 'student';
//     student: StudentProps;
// }

export interface TeacherProps {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string | null;
    pob: string | null; // place of birth
    dob: string | null; // biasanya dikirim sebagai ISO string (YYYY-MM-DD HH:mm:ss)
    domicile: string | null;
    card_number: string | null;
    bachelor: string | null;
    master: string | null;
    doctoral: string | null;
    created_at: string;
    updated_at: string;
}

export interface CurriculumProps {
    id: number;
    user_id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface StudentProps {
    id: number;
    user_id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Course {
    id: number;
    subject: string;
    level: number;
    period: number;
    order: number;
    type: string;
    session?: number;
    note?: string;
    student?: number;
    scheduled_at?: string;

    teacher_id?: number;

    created_at: string;
    updated_at: string;
}


export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
