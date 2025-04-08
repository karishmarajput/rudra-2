"use client";

import { Alert, Box, Button, Container, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
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
      localStorage.setItem("authToken", data.authToken);
      router.push("/dashboard");
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
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
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
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            fullWidth
            variant="outlined"
            sx={{
              mt: 1,
              borderColor: "white",
              color: "white",
              "&:hover": { backgroundColor: "#ccc", borderColor: "#ccc", color: "#121212" },
            }}
          >
            Sign Up
          </Button>
          <Button
            onClick={() => router.push("/forgot-password")}
            fullWidth
            variant="text"
            sx={{ mt: 1, color: "white" }}
          >
            Forgot Password?
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
