"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Box, Typography, TextField, Button, Alert } from "@mui/material";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Automatically redirect to dashboard if the auth token is present
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password. Please try again!");
      }

      const data = await response.json();

      // Store the auth token in localStorage
      localStorage.setItem("authToken", data.authToken);

      // Navigate to the dashboard on successful login
      router.push("/dashboard");
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
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
          >
            Sign Up
          </Button>
          <Button
            onClick={() => router.push("/forgot-password")}
            fullWidth
            variant="text"
            sx={{ mt: 1 }}
          >
            Forgot Password?
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
