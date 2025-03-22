import { Box, Divider, Container, Grid2 as Grid, Typography, Button } from '@mui/material';
import Table from "@custom/charts/ReusableTable";
import Calendar from "@custom/Calendar/Calendar";
import FormContainer from '@custom/forms/FormContainer';
import useUtilityStore, { type UtilityStoreType } from '@store/utilityStore';


const buildOperateButtons = ({ utilityStore }: { utilityStore: UtilityStoreType }) => [
    {
        label: "add",
        onClick: () => utilityStore.setModal({
            open: true,
            content: (
                <FormContainer
                    schema={{
                        table: "employees",
                        columns: [
                            { name: "firstname", dataType: "text" },
                            { name: "lastname", dataType: "text" },
                            { name: "pay", dataType: "text" },
                            { name: "role", dataType: "text" },
                        ]
                    }}
                    handleCancelClick={() => utilityStore.setModal({ open: false, content: null })}
                />
            )
        })
    },
    {
        label: "update",
        onClick: () => utilityStore.setModal({
            open: true,
            content: (
                <FormContainer
                    schema={{
                        table: "employees",
                        columns: [
                            { name: "firstname", dataType: "text" },
                            { name: "lastname", dataType: "text" },
                            { name: "pay", dataType: "text" },
                            { name: "role", dataType: "text" },
                        ]
                    }}
                    handleCancelClick={() => utilityStore.setModal({ open: false, content: null })}
                />
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

export default function Dashboard() {
    const utilityStore = useUtilityStore();
    return (
        <Grid container spacing={2} p={2} mt={10}>
            <Grid size={12}>
                <Box sx={{ display: "flex", justifyContent: "end", px: 2}}>
                    {buildOperateButtons({utilityStore})
                        .map((button, index) => (
                            <Button
                                key={index}
                                color="inherit"
                                onClick={button.onClick}
                            >
                                {button.label}
                            </Button>
                        ))
                    }
                </Box>
                <Table
                    title={"Employees"}
                    rows={[]}
                    columns={[
                        { headerName: "Name" }
                    ]}
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