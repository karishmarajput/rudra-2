"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { useState, useEffect } from "react";

import { User } from "../model/user";
import StatsAndGraph from "../components/stats-and-graph";
import UsersList from "../components/user-list";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import RouterIcon from "@mui/icons-material/Router";
import ShieldIcon from "@mui/icons-material/Shield";
import WifiIcon from "@mui/icons-material/Wifi";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 80;

export default function Dashboard() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // Track collapsed state
  const [activeComponent, setActiveComponent] = useState("dashboard"); // 'dashboard' or 'audit'
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Check if the user is logged in by verifying the presence of the auth token
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);

    // Redirect to login page if not logged in
    if (!authToken) {
      router.push("/");
    } else {
      // Fetch user data for Audit Trail
      fetch("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error("Error fetching users:", error));
    }
  }, [router]);

  const handleLogout = () => {
    // Remove auth token from local storage
    localStorage.removeItem("authToken");

    // Redirect to the login page
    router.push("/");
  };

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const handleMenuClick = (component: string) => {
    setActiveComponent(component); // Switch the displayed component
  };

  const renderMenuItem = (
    text: string,
    icon: React.ReactNode,
    component?: string // Optional for non-clickable items
  ) => (
    <ListItem
      component={'button'}
      onClick={component ? () => handleMenuClick(component) : undefined}
      sx={{
        justifyContent: collapsed ? "center" : "flex-start",
        px: 2,
        cursor: "pointer", // Change cursor to pointer on hover
      }}
    >
      <Tooltip title={collapsed ? text : ""} arrow>
        <ListItemIcon sx={{ minWidth: 0 }}>{icon}</ListItemIcon>
      </Tooltip>
      {!collapsed && <ListItemText primary={text} />}
    </ListItem>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Side Menu */}
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
            boxSizing: "border-box",
            transition: "width 0.3s ease-in-out",
          },
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "center",
            display: "flex",
            cursor: "pointer",
            height: "64px",
            backgroundColor: "#1976d2",
          }}
          onClick={toggleCollapse}
        >
          <Tooltip title="Click to toggle menu" arrow>
            <Box sx={{ textAlign: "center", color: "white" }}>
              {collapsed ? "LOGO" : "COMPANY LOGO"}
            </Box>
          </Tooltip>
        </Toolbar>
        <List>
          {/* Adding all the menu items */}
          {renderMenuItem("Dashboard", <DashboardIcon />, "dashboard")}
          {renderMenuItem("Tenants", <PeopleIcon />, undefined)}
          {renderMenuItem("Routers", <RouterIcon />, undefined)}
          {renderMenuItem("Firewall Templates", <ShieldIcon />, undefined)}
          {renderMenuItem("Hotspot Users", <WifiIcon />, undefined)}
          {renderMenuItem("Audit Trail", <ListAltIcon />, "audit")}
          {renderMenuItem("Billing", <ReceiptIcon />, undefined)}
          {renderMenuItem("Admins", <AdminPanelSettingsIcon />, undefined)}
          <ListItem
            component={'button'}
            onClick={handleLogout}
            sx={{
              justifyContent: collapsed ? "center" : "flex-start",
              px: 2,
              cursor: "pointer", // Change cursor to pointer on hover
            }}
          >
            <Tooltip title={collapsed ? "Logout" : ""} arrow>
              <ListItemIcon sx={{ minWidth: 0 }}>
                <LogoutIcon />
              </ListItemIcon>
            </Tooltip>
            {!collapsed && <ListItemText primary="Logout" />}
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {activeComponent === "dashboard" && <StatsAndGraph />}
        {activeComponent === "audit" && <UsersList users={users} />}
      </Box>
    </Box>
  );
}
