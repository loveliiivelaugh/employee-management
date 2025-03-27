import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Stack,
    Chip,
} from "@mui/material";
import { motion } from "framer-motion";

type DailyAvailability = {
    dayOfWeek: number; // 0 (Sunday) - 6 (Saturday)
    start_time: string; // '09:00'
    end_time: string;   // '17:00'
};

type AvailabilityLayoutProps = {
    availability: DailyAvailability[];
    employeeName?: string;
};

const daysMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const MotionCard = motion(Card);

const AvailabilityLayout: React.FC<AvailabilityLayoutProps> = ({
    availability,
    employeeName,
}) => {
    const availabilityByDay = Array.from({ length: 7 }, (_, i) =>
        availability.filter((slot) => slot.dayOfWeek === i)
    );

    return (
        <MotionCard
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            sx={{ maxWidth: 700, borderRadius: 4, border: '1px solid #222', color: "inherit", p: 2 }}
            elevation={0}
        >
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {employeeName ? `${employeeName}'s Availability` : "Weekly Availability"}
                </Typography>

                <Grid container spacing={2}>
                    {availabilityByDay.map((slots, dayIndex) => (
                        <Grid item xs={12} sm={6} md={4} key={dayIndex}>
                            <Stack spacing={1}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {daysMap[dayIndex]}
                                </Typography>

                                {slots.length > 0 ? (
                                    slots.map((slot, i) => (
                                        <Chip
                                            key={i}
                                            label={`${slot.start_time} - ${slot.end_time}`}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        Unavailable
                                    </Typography>
                                )}
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </MotionCard>
    );
};

export default AvailabilityLayout;
