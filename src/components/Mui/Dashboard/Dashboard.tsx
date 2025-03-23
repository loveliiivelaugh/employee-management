import { Box, Divider, Container, Grid2 as Grid, Typography, Button } from '@mui/material';
import Table from "@custom/charts/ReusableTable";
import Calendar from "@custom/Calendar/Calendar";
import FormContainer from '@custom/forms/FormContainer';
import useUtilityStore, { type UtilityStoreType } from '@store/utilityStore';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@api/index';
import React from 'react';

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
const buildOperateButtons = ({ utilityStore, columns }: { utilityStore: UtilityStoreType, columns: any }) => [
    {
        label: "add",
        onClick: () => utilityStore.setModal({
            open: true,
            content: (
                <ContentContainer>
                    <FormContainer
                        schema={{ table: "employees", columns }}
                        handleCancelClick={() => utilityStore.setModal({ open: false, content: null })}
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
                    <FormContainer
                        schema={{ table: "employees", columns }}
                        handleCancelClick={() => utilityStore.setModal({ open: false, content: null })}
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
                    <Typography variant='body1' color="error">
                        Delete {`[employee]`}?
                    </Typography>
                    Are you sure?
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
    }
};

export default function Dashboard() {
    const employeesQuery = useQuery(queries.supabaseQuery(queryOptions.employees));
    const appointmentsQuery = useQuery(queries.supabaseQuery(queryOptions.appointments));
    const utilityStore = useUtilityStore();
    console.log("employeesQuery: ", employeesQuery);
    return (
        <Grid container spacing={2} p={2} mt={10} maxWidth={"100vw"}>
            <Grid size={12}>
                <Box sx={{ display: "flex", justifyContent: "end", px: 2}}>
                    {buildOperateButtons({
                        utilityStore, 
                        columns: getEmployeesData(employeesQuery)
                    })
                    .map((button, index) => (
                        <Button
                            key={index}
                            color="inherit"
                            onClick={button.onClick}
                        >
                            {button.label}
                        </Button>
                    ))}
                </Box>
                <Table
                    title={"Employees"}
                    rows={getEmployeesData(employeesQuery, true)}
                    columns={getEmployeesData(employeesQuery)}
                />
            </Grid>
            <Grid size={12}>
                <Calendar />
            </Grid>
            <Divider />
        </Grid>
    )
};

export const Footer = () => (
    <Grid size={12} sx={{ bgcolor: "transparent", backdropFilter: "blur(8px)" }} mt={2} mb={2}>
        <Container maxWidth="sm" sx={{ justifyContent: "space-between", display: "flex" }} >
            <Typography variant="body1">From Chicago with ❤️</Typography>
            <Typography variant="body1">Ⓒ 2025 Michael Woodward</Typography>
        </Container>
    </Grid>
);