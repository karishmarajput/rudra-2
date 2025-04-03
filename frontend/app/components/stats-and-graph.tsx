import { Box, Card, CardContent, Typography } from "@mui/material";

export default function StatsAndGraph() {
  return (
    <Box>
      {/* Stats Section */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Card sx={{ flex: "1 1 300px" }}>
          <CardContent>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">1,234</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: "1 1 300px" }}>
          <CardContent>
            <Typography variant="h6">Active Users</Typography>
            <Typography variant="h4">567</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: "1 1 300px" }}>
          <CardContent>
            <Typography variant="h6">New Signups</Typography>
            <Typography variant="h4">89</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Graph Section */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Sample Graph
        </Typography>
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            height: "300px",
            backgroundColor: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1" color="textSecondary">
            Graph Placeholder
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
