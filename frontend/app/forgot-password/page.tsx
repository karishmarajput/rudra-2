"use client";

import { Alert, Box, Button, Container, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/forgot-password`, {
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
    <Container
      maxWidth="sm"
      sx={{
        backgroundColor: "#0045851F",
        borderRadius: "16px",
        padding: 3,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        width: "400px", 
        position: "absolute", 
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)", 
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="FutureKonnect.png" 
          alt="Logo"
          style={{ width: "505px", height: "auto", marginBottom: "16px" }}
        />
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
            InputLabelProps={{ style: { color: "white" } }}
            sx={{
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "#ccc",
                },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              background: "linear-gradient(90deg, #5A93C1A3, #235D8CA3)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(90deg, #235D8CA3, #5A93C1A3)",
              },
            }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Reset Password"}
          </Button>
          <Button
            onClick={() => router.push("/")}
            fullWidth
            variant="text"
            sx={{
              mt: 1,
              color: "white",
            }}
          >
            Back to Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
