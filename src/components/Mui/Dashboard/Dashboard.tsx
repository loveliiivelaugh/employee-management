// types
import type { 
    GetTableDataType,
    DefaultCalendarStateType,
    TabContentPropsType
} from '@components/EmployeeTime/types';

import moment from 'moment';
import React, { useState } from 'react';
import { 
    Box, Grid2 as Grid, Stack, Typography, Button, 
    IconButton, List, ListItem, ListItemText, 
    ListItemIcon, Toolbar 
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Table from "@custom/charts/ReusableTable";
import Calendar from "@custom/Calendar/Calendar";
import FormContainer from '@custom/forms/FormContainer';
import Search from '@custom/forms/Search';
import useUtilityStore from '@store/utilityStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queries } from '@api/index';
import { Views } from 'react-big-calendar';
import Tabs from '../Tabs';
import EmployeeProfileCard from '@components/EmployeeTime/EmployeeProfileCard';
import AvailabilityLayout from '@components/EmployeeTime/AvailabilityCard';
import CalendarLegend from '@components/custom/Calendar/CalendarLegend';

// could return table columns, table rows, or a single table row. 
// Returns empty array if no data available
// returns columns definition by default
// should have returned rows by default *smh*
// pass row id to filter on it
const getTableData: GetTableDataType = (tableQuery, isRows = false, filterById) => {
    if (!tableQuery?.data?.data || tableQuery.isLoading) return [];
    if (isRows) {
        const rows = tableQuery.data.data;
        if (filterById) return rows.find((row: {id: number}) => (row.id === filterById));
        return rows;
    } 
    else return Object
        .keys(tableQuery.data.data[0])
        .map((columnKey) => ({ name: columnKey, dataType: "text" }));
};

const ContentContainer = ({ children }: { children: React.ReactNode }) => (
    <Box sx={{ maxHeight: 600, overflow: "auto" }}>
        {children}
    </Box>
);
const buildOperateButtons = (
    { utilityStore, columns, ...operateProps }: TabContentPropsType
) => [
    {
        label: "add",
        onClick: () => utilityStore.setModal({
            open: true,
            content: (
                <ContentContainer>
                    <Typography variant="h6">
                        Add {operateProps.table}
                    </Typography>
                    <FormContainer
                        disableHeader
                        schema={{ table: operateProps.table, columns }}
                        handleCancelClick={operateProps.handleCancelClick}
                        handleSubmit={(values) => operateProps.supabaseMutation
                            .mutate({//default is insert
                                table: operateProps.table,
                                ...values.value
                            }, {
                                ...operateProps.mutateOptions,
                                onSuccess: () => {
                                    operateProps.mutateOptions.onSuccess();
                                    setTimeout(() => utilityStore.setModal({
                                        open: true,
                                        content: (
                                            <ContentContainer>
                                                <Typography variant="h6">
                                                    Availability
                                                </Typography>
                                                <Calendar view={Views.WEEK} />
                                                {/* <FormContainer
                                                    disableHeader
                                                    schema={{ table: "appointments", columns }}
                                                    handleCancelClick={operateProps.handleCancelClick}
                                                /> */}
                                            </ContentContainer>
                                        )
                                    }), 300);
                                }
                            })
                        }
                    />
                </ContentContainer>
            )
        })
    },
    {
        label: "update",
        onClick: () => utilityStore.setModal({
            open: true,
            content: (
                <ContentContainer>
                    <Typography variant="h6">
                        Update {operateProps.table}
                    </Typography>
                    <FormContainer
                        disableHeader
                        schema={{ table: operateProps.table, columns }}
                        mapDefaultValue={(column) => operateProps.selected[column.name] || ""}
                        handleCancelClick={operateProps.handleCancelClick}
                        handleSubmit={(values) => operateProps.supabaseMutation
                            .mutate({ 
                                operation: "update",
                                table: operateProps.table,
                                ...values.value 
                            }, operateProps.mutateOptions)
                        }
                    />
                </ContentContainer>
            )
        })
    },
    {
        label: "delete",
        onClick: () => utilityStore.setModal({
            open: true,
            content: (
                <Box>
                    <Typography variant="h6" color="error" gutterBottom>
                        Delete {operateProps.selected.first_name} {operateProps.selected.last_name}?
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        This action cannot be undone. Are you sure you want to proceed?
                    </Typography>

                    <Stack direction="row" spacing={2} mt={2}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => operateProps.supabaseMutation
                                .mutate({ 
                                    operation: "delete",
                                    table: operateProps.table,
                                    id: operateProps.selected.id
                                }, operateProps.mutateOptions)
                            }
                        >
                            Delete
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={operateProps.handleCancelClick} // replace with your cancel handler
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            )
        })
    }
];

const queryOptions = {
    employees: {
        table: "employees",
        select: "*"
    },
    appointments: {
        table: "appointments",
        select: "*"
    },
    students: {
        table: "students",
        select: "*"
    }
};

const TableTabContent = ({ utilityStore, tableQuery, ...props }: TabContentPropsType) => (
    <>
        <Box sx={{ display: "flex", justifyContent: "end", px: 2 }}>
            {buildOperateButtons({
                utilityStore,
                columns: getTableData(tableQuery),
                ...props,
                mutateOptions: {
                    onSuccess: (result: any) => {
                        //Success Handler for all Operate buttons
                        tableQuery.refetch();
                        props.handleCancelClick();
                        utilityStore.createAlert("success", `${props.table} Created!`);
                    },
                    onError: () => utilityStore.createAlert("error", `Something went wrong.`)
                }
            })
            .map((button, index) => (
                <Button
                    key={index}
                    color="inherit"
                    onClick={button.onClick}
                    disabled={["update", "delete"].includes(button.label) && !props.selected}
                >
                    {button.label}
                </Button>
            ))}
        </Box>
        <Table
            title={props.table}
            rows={getTableData(tableQuery, true)}
            columns={getTableData(tableQuery)}
            setSelected={props.setSelected}
        />
    </>
);

const ModifyEventContent = (operateProps: TabContentPropsType | any) => {
    const [eventOperation, setEventOperation] = useState<string | null>(null);
    const { event, tableQuery } = operateProps;
    return (
        <ContentContainer>
            <Typography variant="h5">
                Modify / Edit
            </Typography>
            <Typography variant="body1">
                {event.title} on {moment(event.start).format("M/d/YYYY")} @ {moment(event.start).format("h:mm a")}
            </Typography>
            <List sx={{ display: "flex", flexDirection: "row", justifyContent: "end" }}>
                <Toolbar />
                <>
                <ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <IconButton color="inherit" onClick={() => setEventOperation((eventOperation === "update") ? null : "update")}>
                                <EditIcon />
                            </IconButton>
                        </ListItemIcon>
                    </ListItem>
                    <ListItemIcon>
                        <IconButton color="error" onClick={() => setEventOperation("delete")}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemIcon>
                </ListItem>
                </>
            </List>
            {!eventOperation && (
                <Button variant='outlined' color="error" onClick={operateProps.handleCancelClick}>
                    Cancel
                </Button>
            )}
            {(eventOperation === "delete") && (
                <Box sx={{ textAlign: "right" }}>
                    <ListItemText 
                        primary={(
                            <Typography variant="body2" gutterBottom>
                                This action cannot be undone. Are you sure you want to proceed?
                            </Typography>
                        )} 
                        secondary={(<Button color="error">Delete</Button>)} 
                    />
                    <Button color="error" onClick={operateProps.handleCancelClick}>
                        Cancel
                    </Button>
                </Box>
            )}
            {(eventOperation === "update") && (
                <FormContainer
                    disableHeader
                    schema={{ table: operateProps.table, columns: getTableData(tableQuery) }}
                    mapDefaultValue={(column) => {
                        console.log("EVENT DEFAULTS: ", column, event)
                        return ({
                            ...event,
                            decription: event.resource,
                            start_time: event.start,
                            end_time: event.end
                        })[column.name] || ""}
                    }
                    handleCancelClick={operateProps.handleCancelClick}
                    handleSubmit={(values) => operateProps.supabaseMutation
                        .mutate({ 
                            operation: "update",
                            ...values.value 
                        }, operateProps.mutateOptions)
                    }
                />
            )}
        </ContentContainer>
    );
};

const CalendarTabContent = ({
    calendar,
    setCalendar,
    appointmentsQuery,
    employeesQuery,
    studentsQuery,
    supabaseMutation,
    utilityStore,
    ...operateProps
}: TabContentPropsType) => (
    <Grid size={12}>
        <Calendar
            view={calendar.view}
            date={calendar.date || new Date()}
            setCalendar={setCalendar}
            events={
                appointmentsQuery.isLoading
                    ? []
                    : appointmentsQuery?.data?.data
                    && appointmentsQuery.data.data
                        .filter(
                            (appointment: any) => operateProps.selected
                                ? (appointment.instructor === operateProps.selected.id)
                                : true
                        )
                        .map((appointment: any) => ({
                            title: appointment.title,
                            start: new Date(appointment.start_time),
                            end: new Date(appointment.end_time),
                            resource: appointment.description,
                            ...appointment //provides instructorId + studentId
                        }))
            }
            handleSelectEvent={(event: any) => utilityStore.setModal({
                open: true,
                content: <ModifyEventContent {...operateProps} event={event} />
            })}
            handleSelectSlot={(selected: any) => (calendar.view === Views.MONTH)
                ? setCalendar({ date: selected.start, view: Views.DAY, time: null })
                : (() => {
                    console.log("FROMWEEK?: ", selected)
                    setCalendar({ ...calendar, date: selected.start, time: selected.start });
                    return utilityStore.setModal({
                        open: true,
                        content: (
                            <Grid container>
                                <Grid size={12}>
                                    {/* <Search /> */}
                                </Grid>
                                <Grid size={12}>
                                    {employeesQuery.isLoading ? "Loading..." : (
                                        <FormContainer
                                            disableHeader
                                            schema={{
                                                table: "appointments",
                                                columns: [
                                                    {
                                                        name: "instructor",
                                                        enumValues: getTableData(employeesQuery, true).length
                                                            && getTableData(employeesQuery, true)
                                                                .map((instructor: any) => ({ label: `${instructor.first_name} ${instructor.last_name}` }))

                                                    },
                                                    {
                                                        name: "student",
                                                        enumValues: getTableData(studentsQuery, true).length
                                                            && getTableData(studentsQuery, true)
                                                                .map((student: any) => ({ label: `${student.email}` }))
                                                    },
                                                    { name: "date", dataType: "date" },
                                                    { name: "time", dataType: "time" }
                                                ]
                                            }}
                                            mapDefaultValue={(column) => {
                                                let instructor;
                                                if (operateProps.selected) instructor = getTableData(employeesQuery, true, operateProps.selected.id);
                                                console.log("MAPDEFAULTS: ", column)
                                                return ({
                                                    time: selected.start,
                                                    date: calendar.date,
                                                    ...instructor && {
                                                        // instructor: ({ label: `${instructor.first_name} ${instructor.last_name}` })
                                                            // || 
                                                        instructor: `${instructor.first_name} ${instructor.last_name}`
                                                        //todo -> future: add default student if in student onboarding flow
                                                    }
                                                }[column.name])
                                            }}
                                            handleCancelClick={() => {
                                                setCalendar(calendarDefault);
                                                utilityStore.setModal({ open: false, content: null });
                                            }}
                                            handleSubmit={async (values) => {
                                                const instructorName = values.value.instructor.label;
                                                const instructorId = getTableData(employeesQuery, true)
                                                    .find((
                                                        { first_name, last_name }:
                                                            { first_name: string, last_name: string }
                                                    ) => (instructorName.includes(first_name) && instructorName.includes(last_name))).id;

                                                const studentEmail = values.value.student.label;
                                                const studentId = getTableData(studentsQuery, true)
                                                    .find(({ email }: { email: string }) => (email === studentEmail)).id;

                                                const payload = {
                                                    // no table specified//default is set in queryOptions (appointments)
                                                    // no operation specified//default is insert
                                                    title: "lesson",
                                                    description: "lesson",
                                                    start_time: values.value.time,
                                                    end_time: moment(values.value.time).add(30, "minutes"),
                                                    location: "online",
                                                    student_id: studentId,
                                                    instructor: instructorId
                                                };

                                                supabaseMutation.mutate(payload, {
                                                    onSuccess: () => {
                                                        appointmentsQuery.refetch();
                                                        setCalendar(calendarDefault);
                                                        utilityStore.setModal({ open: false, content: null });
                                                        utilityStore.createAlert("success", `Booking Created!`);
                                                    },
                                                    onError: () => utilityStore.createAlert("error", `Something went wrong. Record not saved`)
                                                });
                                            }}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                        )
                    })
                })()
            }
        />
    </Grid>
);

const availabilityMock = [
    { dayOfWeek: 1, start_time: "09:00", end_time: "17:00" },
    { dayOfWeek: 2, start_time: "10:00", end_time: "16:00" },
    { dayOfWeek: 4, start_time: "13:00", end_time: "18:00" },
    { dayOfWeek: 5, start_time: "09:00", end_time: "12:00" },
];

const calendarDefault: DefaultCalendarStateType = { date: null, view: Views.MONTH, time: null };

export default function Dashboard() {
    const utilityStore = useUtilityStore();
    // todo: combine 4 queries into single useQueries()
    const studentsQuery = useQuery(queries.supabaseQuery(queryOptions.students));
    const employeesQuery = useQuery(queries.supabaseQuery(queryOptions.employees));
    const appointmentsQuery = useQuery(queries.supabaseQuery(queryOptions.appointments));
    const supabaseMutation = useMutation(queries.supabaseMutation(queryOptions.appointments));

    const [calendar, setCalendar] = useState(calendarDefault);
    const [selected, setSelected] = useState<any>(null);

    console.log("SELECTED: ", selected)

    const tabContentProps: TabContentPropsType = {
        utilityStore,
        studentsQuery,
        employeesQuery,
        appointmentsQuery,
        supabaseMutation,
        calendar,
        selected,
        setCalendar,
        setSelected,
        handleCancelClick: () => utilityStore.setModal({ open: false, content: null })
    };

    const tabs = [
        { label: "Calendar", renderContent: (label?: string) => <CalendarTabContent {...tabContentProps} table={label?.toLowerCase()} tableQuery={appointmentsQuery} /> },
        { label: "Employees", renderContent: (label?: string) => <TableTabContent {...tabContentProps} table={label?.toLowerCase()} tableQuery={employeesQuery} /> },
        { label: "Students", renderContent: (label?: string) => <TableTabContent {...tabContentProps} table={label?.toLowerCase()} tableQuery={studentsQuery} /> }
    ];

    console.log("employeesQuery: ", employeesQuery, appointmentsQuery);

    const legendLabels = [
        { color: "darkgrey", label: "Unavailable" },
        { color: "lightblue", label: "Booked" },
        { color: "lightgreen", label: "Available" }
    ];

    return (
        <Grid container spacing={2} p={2} mt={10} maxWidth={"100vw"}>
            {employeesQuery?.data?.data && (
                <Grid size={12}>
                    <Search
                        selected={selected}
                        setSelected={(selectedState: any) => {
                            if (!selectedState) setCalendar((prev) => ({ ...prev, view: Views.MONTH }))
                            else {
                                setSelected(selectedState)
                                setCalendar((prev) => ({ ...prev, view: Views.WEEK }))
                            }
                        }}
                        searchData={getTableData(employeesQuery, true)}
                    />
                </Grid>
            )}
            {selected && (
                <>
                    <Grid size={4}>
                        <EmployeeProfileCard employee={selected} />
                        <CalendarLegend items={legendLabels} />
                    </Grid>
                    <Grid size={8}>
                        <AvailabilityLayout availability={availabilityMock} />
                    </Grid>
                </>
            )}
            <Grid size={12}>
                <Box>
                    <Tabs
                        tabs={tabs}
                        onChange={() => setSelected(null)}
                        renderContent={((tabValue: number) => tabs[tabValue].renderContent(tabs[tabValue].label))}
                    />
                </Box>
            </Grid>
        </Grid>
    )
};