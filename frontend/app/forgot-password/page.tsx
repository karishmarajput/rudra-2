"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Container, Box, Typography, TextField, Button, Alert } from "@mui/material";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
  
    try {
      const response = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to send password reset email");
      }
  
      setMessage("A password reset link has been sent to your email.");
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" mb={2}>
          Forgot Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Reset Password"}
          </Button>
          <Button
            onClick={() => router.push("/")}
            fullWidth
            variant="text"
            sx={{ mt: 1 }}
          >
            Back to Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
