// types
import type { Dispatch, SetStateAction } from 'react';
import type { View } from 'react-big-calendar';
import type { UtilityStoreType } from '@store/utilityStore';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';

type ProfileType = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
    updated_at: string;
};
interface StudentType extends ProfileType {
    password_hash: string;
    enrolled_date: string;
    last_login: string;
    is_active: boolean;
    profile_picture_url: string;
    bio: string;
};
interface EmployeeType extends ProfileType {
    phone: string;
    hire_date: string;
    job_title: string;
    department_id: number;
    salary: number;
    manager_id: number;
};
type AppointmentType = {
    id: number;
    title: string;
    description?: string | null;
    location?: string | null;
    start_time: string; // ISO 8601 string (e.g., from `toISOString()` or Supabase)
    end_time: string;
    created_at?: string | null;
    updated_at?: string | null;
    instructor: number;  // references employees.id
    student_id: number;  // references students.id
};
type DefaultCalendarStateType = { 
    date: Date | null, 
    view: View, 
    time: any | null 
};
type TabContentPropsType = {
    utilityStore: UtilityStoreType;
    studentsQuery: any | UseQueryResult<StudentType[], Error>;
    employeesQuery: any | UseQueryResult<EmployeeType[], Error>;
    appointmentsQuery: any | UseQueryResult<AppointmentType[], Error>;
    supabaseMutation: UseMutationResult<any, Error, any, unknown>; // customize this too
    calendar: DefaultCalendarStateType;
    selected: any | null;
    setCalendar: Dispatch<SetStateAction<DefaultCalendarStateType>>;
    setSelected: Dispatch<SetStateAction<any>>;
    handleCancelClick: () => void;
    [key: string]: any;
};
type GetTableDataType = (tableQuery: any, isRows?: boolean, filterById?: number) => any;

export type {
    ProfileType,
    StudentType,
    EmployeeType,
    AppointmentType,
    DefaultCalendarStateType,
    TabContentPropsType,
    GetTableDataType
};