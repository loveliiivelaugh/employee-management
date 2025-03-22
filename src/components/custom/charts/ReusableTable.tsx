import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";


interface ReusableTableProps { 
    title: string, 
    rows: any[], 
    columns: any[] 
}

const ReusableTable = ({ title, rows, columns }: ReusableTableProps) => {

    return (
        <Box sx={{ height: 400, width: '100%', my: 4 }}>
            <Typography variant="h6">{title}</Typography>
                <DataGrid
                    rows={rows}
                    columns={columns.map((field: any) => ({
                        // ...field,
                        field: field.name,
                        headerName: field.name,
                        width: 150,
                        editable: true,
                        // ...(field.name === "messages") && {
                        //     renderCell: (params) => <ReusablePopover params={params} />
                        // }
                    }))}
                    // pageSize={5}
                    // rowsPerPageOptions={[5]}
                    sx={{ height: 400, width: '100%' }}
                />
        </Box>
    );
};

export default ReusableTable;