"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Container, Box, Typography, TextField, Button, Alert } from "@mui/material";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
  
    // Check that passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to sign up! Please try again.");
      }
  
      const data = await response.json();
  
      // Store the auth token in local storage
      localStorage.setItem("authToken", data.authToken);
  
      // Navigate to dashboard on successful registration
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="h1" variant="h5" mb={2}>
          Signup
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
