import React from "react";
import { Box, Typography, Card, CardContent, Avatar, Stack } from "@mui/material";
import { motion } from "framer-motion";
import type { EmployeeType } from "./types";


type EmployeeProfileCardProps = {
    employee: EmployeeType;
};

const MotionCard = motion(Card);

const EmployeeProfileCard: React.FC<EmployeeProfileCardProps> = ({ employee }) => {
    const {
        first_name,
        last_name,
        email,
        phone,
        hire_date,
        job_title,
        salary,
    } = employee;

    return (
        <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            sx={{
                maxWidth: 400,
                borderRadius: 4,
                border: '1px solid #222',
                p: 2
            }}
            elevation={0}
        >
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar sx={{ width: 64, height: 64 }}>
                        {first_name[0]}
                        {last_name[0]}
                    </Avatar>
                    <Box>
                        <Typography variant="h5">
                            {first_name} {last_name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {job_title}
                        </Typography>
                    </Box>
                </Stack>

                <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                        📧 {email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        📞 {phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        📅 Hired: {new Date(hire_date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        💰 Salary: ${salary.toLocaleString()}
                    </Typography>
                </Stack>
            </CardContent>
        </MotionCard>
    );
};

export default EmployeeProfileCard;
