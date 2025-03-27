import React from "react";
import {
    Box,
    Grid2 as Grid,
    Typography,
    Card,
    CardContent,
    Button,
    Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import { CheckCircle } from "@mui/icons-material";

const MotionCard = motion(Card);

const plans = [
    {
        title: "Starter plan",
        price: "$29/month",
        features: [
            "5 users",
            "Basic AI analytics",
            "10 GB of storage",
            "Access to all core features",
        ],
        buttonText: "Get started",
        highlight: false,
    },
    {
        title: "Growth plan",
        price: "$29/month",
        features: [
            "25 users",
            "Advanced AI analytics",
            "10 GB of storage",
            "Enhanced security",
        ],
        buttonText: "Get started",
        highlight: true,
    },
    {
        title: "Enterprise plan",
        price: "Contact sales",
        features: [
            "Unlimited users",
            "Full AI analytics",
            "Advanced security",
            "24/7 priority support",
        ],
        buttonText: "Contact us",
        highlight: false,
    },
];

const PricingPage: React.FC = () => {
    return (
        <Box sx={{ width: "100vw", height: "100vh", mt: 20, p: 4 }}>
            <Typography variant="overline" color="text.secondary">
                Pricing
            </Typography>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Simple, Transparent Pricing
            </Typography>

            <Grid container spacing={4} justifyContent="center" mt={4}>
                {plans.map((plan, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <MotionCard
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.3 }}
                            sx={{
                                background: plan.highlight
                                    ? "linear-gradient(145deg, #000428, #004e92)"
                                    : "linear-gradient(to bottom, #ffffff, #eef3ff)",
                                color: plan.highlight ? "white" : "black",
                                borderRadius: 4,
                                p: 3,
                                boxShadow: plan.highlight ? 8 : 3,
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {plan.title}
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    {plan.price}
                                </Typography>

                                <Stack spacing={1} mb={3} alignItems="flex-start">
                                    {plan.features.map((feature, i) => (
                                        <Stack direction="row" alignItems="center" spacing={1} key={i}>
                                            <CheckCircle
                                                fontSize="small"
                                                sx={{ color: plan.highlight ? "#90caf9" : "green" }}
                                            />
                                            <Typography variant="body2">{feature}</Typography>
                                        </Stack>
                                    ))}
                                </Stack>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        backgroundColor: plan.highlight ? "white" : "black",
                                        color: plan.highlight ? "black" : "white",
                                        fontWeight: 600,
                                        borderRadius: 8,
                                        py: 1.2,
                                        '&:hover': {
                                            backgroundColor: plan.highlight ? "#f0f0f0" : "#333",
                                        },
                                    }}
                                >
                                    {plan.buttonText}
                                </Button>
                            </CardContent>
                        </MotionCard>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default PricingPage;