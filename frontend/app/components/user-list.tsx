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
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
