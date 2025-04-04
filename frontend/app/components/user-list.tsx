import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { User } from "../model/user";

interface UsersListProps {
  users: User[];
}

export default function UsersList({ users }: UsersListProps) {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Audit Trail - Users
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "white" }}>ID</TableCell>
            <TableCell sx={{ color: "white" }}>Name</TableCell>
            <TableCell sx={{ color: "white" }}>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user.id}
              sx={{
                backgroundColor: index % 2 === 0 ? "#172C43" : "transparent",
              }}
            >
              <TableCell sx={{ color: "white" }}>{user.id}</TableCell>
              <TableCell sx={{ color: "white" }}>{user.name}</TableCell>
              <TableCell sx={{ color: "white" }}>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
