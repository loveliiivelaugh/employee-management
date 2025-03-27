import React from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Stack,
    Divider,
    Grid2 as Grid
} from "@mui/material";
import { motion } from "framer-motion";
import { AccessTime, Person } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { queries } from "@api/index";

const MotionCard = motion(Card);

const PaymentPage: React.FC = () => {
    const mutateQuery = useMutation(queries.mutate(({ stripe }: { stripe: string }) => stripe))
    const lessonRate = 35;
    const lessonsPerWeek = 1;
    const totalMonthly = lessonRate * lessonsPerWeek * 4;

    return (
        <Box sx={{ mt: 10, p: 4 }}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Typography variant="h4" fontWeight="bold" textAlign="left" gutterBottom>
                        Checkout
                    </Typography>
                </Grid>
                <Grid size={12}>
                    <MotionCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        sx={{ borderRadius: 4, boxShadow: 3, p: 3, mb: 4 }}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Lesson Plan Overview
                            </Typography>
                            <Stack spacing={1} mb={2}>
                                <Typography variant="body1">🎵 Music Lessons</Typography>
                                <Typography variant="body2">$35 per session</Typography>
                                <Typography variant="body2">1 session per week</Typography>
                                <Typography variant="body2">Billed monthly</Typography>
                            </Stack>
                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" gutterBottom>
                                Booking Details
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                <Person color="primary" />
                                <Typography variant="body2">Instructor: Sarah Thompson</Typography>
                            </Stack>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <AccessTime color="primary" />
                                <Typography variant="body2">Every Tuesday at 4:00 PM</Typography>
                            </Stack>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                                ${totalMonthly}
                            </Typography>
                            <Grid size={{ xs: 12}}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    fullWidth
                                    sx={{ borderRadius: 3, py: 1.5, my: 1 }}
                                    onClick={() => mutateQuery.mutate({}, {
                                        onSuccess: (data) => {
                                            console.log("SHOULD HAVE OPENED STRIPE CHECKOUT", data)
                                            window.location.href = data.redirect;
                                        }
                                    })}
                                >
                                    Complete Payment
                                </Button>
                                <Typography variant="subtitle2" textAlign={"right"}>
                                    Powered by Stripe
                                </Typography>
                            </Grid>
                        </CardContent>
                    </MotionCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PaymentPage;
