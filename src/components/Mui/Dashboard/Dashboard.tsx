import moment from 'moment';
import React, { useState } from 'react';
import { Box, Grid2 as Grid, Stack, Typography, Button, IconButton, List, ListItem, ListItemText, ListItemIcon, Toolbar } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Table from "@custom/charts/ReusableTable";
import Calendar from "@custom/Calendar/Calendar";
import FormContainer from '@custom/forms/FormContainer';
import Search from '@custom/forms/Search';
import useUtilityStore, { type UtilityStoreType } from '@store/utilityStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queries } from '@api/index';
import { Views, type View } from 'react-big-calendar';
import Tabs from '../Tabs';


const getEmployeesData = (employeesQuery: any, isRows = false) => employeesQuery.isLoading
    ? []
    : isRows
        ? employeesQuery?.data?.data && employeesQuery.data.data || []
        : employeesQuery?.data?.data && Object
            .keys(employeesQuery.data.data[0])
            .map((columnKey) => ({
                name: columnKey,
                dataType: "text"
            }));

const ContentContainer = ({ children }: { children: React.ReactNode }) => (
    <Box sx={{ maxHeight: 600, overflow: "auto" }}>
        {children}
    </Box>
);
const buildOperateButtons = (
    { utilityStore, columns, ...operateProps }:
    { utilityStore: UtilityStoreType, columns: any, [key: string]: any }
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
                                }, operateProps.mutateOptions)
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

const TableTabContent = ({ utilityStore, tableQuery, ...props }: any) => (
    <>
        <Box sx={{ display: "flex", justifyContent: "end", px: 2 }}>
            {buildOperateButtons({
                utilityStore,
                columns: getEmployeesData(tableQuery),
                ...props,
                mutateOptions: {
                    onSuccess: (result: any) => {
                        console.log("SUCCESS: ", result)
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
            rows={getEmployeesData(tableQuery, true)}
            columns={getEmployeesData(tableQuery)}
            setSelected={props.setSelected}
        />
    </>
);

const ModifyEventContent = (operateProps: any) => {
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
                    schema={{ table: operateProps.table, columns: getEmployeesData(tableQuery) }}
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
}: any) => (
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
                    setCalendar({ ...calendar, time: selected.start });
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
                                                        enumValues: getEmployeesData(employeesQuery, true).length
                                                            && getEmployeesData(employeesQuery, true)
                                                                .map((employee: any) => ({ label: `${employee.first_name} ${employee.last_name}` }))

                                                    },
                                                    {
                                                        name: "student",
                                                        enumValues: getEmployeesData(studentsQuery, true).length
                                                            && getEmployeesData(studentsQuery, true)
                                                                .map((student: any) => ({ label: `${student.email}` }))
                                                    },
                                                    { name: "date", dataType: "date" },
                                                    { name: "time", dataType: "time" }
                                                ]
                                            }}
                                            mapDefaultValue={(column) => {
                                                console.log("mapDefaultValue.clumn: ", column, calendar)
                                                return ({
                                                    time: selected.start,
                                                    date: calendar.date
                                                }[column.name])
                                            }}
                                            handleCancelClick={() => {
                                                setCalendar(calendarDefault);
                                                utilityStore.setModal({ open: false, content: null });
                                            }}
                                            handleSubmit={async (values) => {
                                                const instructorName = values.value.instructor.label;
                                                const instructorId = getEmployeesData(employeesQuery, true)
                                                    .find((
                                                        { first_name, last_name }:
                                                            { first_name: string, last_name: string }
                                                    ) => (instructorName.includes(first_name) && instructorName.includes(last_name))).id;

                                                const studentEmail = values.value.student.label;
                                                const studentId = getEmployeesData(studentsQuery, true)
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

                                                const result = await supabaseMutation.mutate(payload, {
                                                    onSuccess: () => {
                                                        appointmentsQuery.refetch();
                                                        setCalendar(calendarDefault);
                                                        utilityStore.setModal({ open: false, content: null });
                                                        utilityStore.createAlert("success", `Booking Created!`);
                                                    },
                                                    onError: () => utilityStore.createAlert("error", `Something went wrong. Record not saved`)
                                                });
                                                console.log("HANDLESUBMIT: ", result);
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

type DefaultCalendarStateType = { date: Date | null, view: View, time: any | null };
const calendarDefault: DefaultCalendarStateType = { date: null, view: Views.MONTH, time: null };

export default function Dashboard() {
    const utilityStore = useUtilityStore();
    // todo: combine 4 queries into single useQueries()
    const studentsQuery = useQuery(queries.supabaseQuery(queryOptions.students));
    const employeesQuery = useQuery(queries.supabaseQuery(queryOptions.employees));
    const appointmentsQuery = useQuery(queries.supabaseQuery(queryOptions.appointments));
    const supabaseMutation = useMutation(queries.supabaseMutation(queryOptions.appointments));

    const [calendar, setCalendar] = useState(calendarDefault);
    const [selected, setSelected] = useState(null);

    const tabContentProps = {
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
    return (
        <Grid container spacing={2} p={2} mt={10} maxWidth={"100vw"}>
            {employeesQuery?.data?.data && (
                <Grid size={12}>
                    <Search
                        selected={selected}
                        setSelected={setSelected}
                        searchData={getEmployeesData(employeesQuery, true)}
                    />
                </Grid>
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