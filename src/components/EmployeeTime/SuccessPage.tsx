import React, { useEffect, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const MotionBox = motion(Box);

const SuccessPage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
            }

            confetti({
                origin: { x: Math.random(), y: Math.random() - 0.2 },
                particleCount: 5,
                spread: 60,
                colors: ["#00C9A7", "#2196f3", "#ff9800"],
            });
        }, 200);
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                // backgroundColor: "#f7faff",
                px: 2,
            }}
        >
            <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                textAlign="center"
                p={4}
                sx={{
                    // backgroundColor: "white",
                    borderRadius: 4,
                    boxShadow: 4,
                    maxWidth: 500,
                }}
            >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    🎉 Payment Successful!
                </Typography>
                <Typography variant="body1" mb={3}>
                    Thank you for booking your music lessons. We'll send you a confirmation email shortly.
                </Typography>
                <Button variant="contained" color="primary" size="large" href="/">
                    Back to Home
                </Button>
            </MotionBox>
        </Box>
    );
};

export default SuccessPage;
