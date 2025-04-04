import { DirectionsCar, HomeWork, People, Router, Wifi } from "@mui/icons-material";
import { Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(...registerables);

export default function StatsAndGraph() {
  const tenantsData = [
    { no: 1, name: "Tenant A", dataUsage: 35 },
    { no: 2, name: "Tenant B", dataUsage: 45 },
    { no: 3, name: "Tenant C", dataUsage: 25 },
    { no: 4, name: "Tenant D", dataUsage: 40 },
    { no: 5, name: "Tenant E", dataUsage: 30 },
    { no: 6, name: "Tenant F", dataUsage: 30 },
  ];

  const histogramData = {
    labels: tenantsData.map((tenant) => tenant.name),
    datasets: [
      {
        label: "Data Usage (GB)",
        data: tenantsData.map((tenant) => tenant.dataUsage),
        backgroundColor: "#4984B5",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Data Usage (GB)",
        },
      },
    },
    responsive: true,
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Card
          sx={{
            flex: "1 1 300px",
            backgroundColor: "#4984B5",
            color: "white",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <People />
            <Box>
              <Typography variant="h6">Total Data Exchange</Typography>
              <Typography variant="h4">80.4 TB</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: "1 1 300px",
            backgroundColor: "#4984B5",
            color: "white",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Wifi />
            <Box>
              <Typography variant="h6">Hotspot User</Typography>
              <Typography variant="h4">23K/24.2K</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: "1 1 300px",
            backgroundColor: "#4984B5",
            color: "white",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Router />
            <Box>
              <Typography variant="h6">Online Routers</Typography>
              <Typography variant="h4">201/345</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: "1 1 300px",
            backgroundColor: "#4984B5",
            color: "white",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <DirectionsCar />
            <Box>
              <Typography variant="h6">Fleets</Typography>
              <Typography variant="h4">45</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: "1 1 300px",
            backgroundColor: "#4984B5",
            color: "white",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <HomeWork />
            <Box>
              <Typography variant="h6">Tenants</Typography>
              <Typography variant="h4">5</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box display="flex" gap={2} mt={4}>
        <Box
          sx={{
            flex: "3",
          }}
        >
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 2,
              backgroundColor: "#f5f5f5",
            }}
          >
            <Bar data={histogramData} options={options} />
          </Box>
          <Typography
            variant="subtitle1"
            mt={2}
            sx={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Tenants Data Usage Histogram
          </Typography>
        </Box>
        <Box
          sx={{
            flex: "2",
          }}
        >
          <Box
            sx={{
              maxHeight: "330px", 
              overflow: "auto", 
              border: "1px solid #ccc",
              borderRadius: 2,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "white",
                      backgroundColor: "transparent",
                    }}
                  >
                    No.
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      backgroundColor: "transparent",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      backgroundColor: "transparent",
                    }}
                  >
                    Data Usage (GB)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenantsData.map((tenant, index) => (
                  <TableRow
                    key={tenant.no}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#0C1829" : "transparent",
                    }}
                  >
                    <TableCell sx={{ color: "white" }}>{tenant.no}</TableCell>
                    <TableCell sx={{ color: "white" }}>{tenant.name}</TableCell>
                    <TableCell sx={{ color: "white" }}>{tenant.dataUsage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Typography
            variant="subtitle1"
            mt={2}
            sx={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Tenants Data Usage Table
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
