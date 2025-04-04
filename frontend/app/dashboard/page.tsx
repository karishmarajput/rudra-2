"use client";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RouterIcon from "@mui/icons-material/Router";
import ShieldIcon from "@mui/icons-material/Shield";
import WifiIcon from "@mui/icons-material/Wifi";
import StatsAndGraph from "../components/stats-and-graph";
import UsersList from "../components/user-list";
import { User } from "../model/user";

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 80;

export default function Dashboard() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      router.push("/");
      return;
    }

    fetch("http://localhost:5000/users", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Unexpected data format:", data);
          setUsers([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setUsers([]);
      });
  }, [router]);


  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const handleMenuClick = (component: string) => {
    setActiveComponent(component);
  };

  const renderMenuItem = (
    text: string,
    icon: React.ReactNode,
    component?: string
  ) => (
    <ListItem
      component={'button'}
      onClick={component ? () => handleMenuClick(component) : undefined}
      sx={{
        justifyContent: collapsed ? "center" : "flex-start",
        px: 2,
        cursor: "pointer",
        backgroundColor: activeComponent === component ? "#3577AF" : "transparent",
        "&:hover": {
          backgroundColor: activeComponent === component ? "#3577AF" : "#1A3A5D",
        },
        color: "white",
      }}
    >
      <Tooltip title={collapsed ? text : ""} arrow>
        <ListItemIcon sx={{ minWidth: 0, color: "white" }}>{icon}</ListItemIcon>
      </Tooltip>
      {!collapsed && <ListItemText primary={text} />}
    </ListItem>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
            boxSizing: "border-box",
            backgroundColor: "#122744",
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
            backgroundColor: "#122744",
          }}
          onClick={toggleCollapse}
        >
          <Tooltip title="Click to toggle menu" arrow>
            <img
              src={collapsed ? "fkSmall.png" : "FutureKonnect.png"}
              alt="Company Logo"
              style={{
                backgroundColor: 'transparent',
                width: collapsed ? "30px" : "200px",
                height: "auto",
                transition: "width 0.3s ease-in-out",
              }}
            />
          </Tooltip>
        </Toolbar>
        <List>
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
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#1A3A5D",
              },
              color: "white",
            }}
          >
            <Tooltip title={collapsed ? "Logout" : ""} arrow>
              <ListItemIcon sx={{ minWidth: 0, color: "white" }}>
                <LogoutIcon />
              </ListItemIcon>
            </Tooltip>
            {!collapsed && <ListItemText primary="Logout" />}
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {activeComponent === "dashboard" && <StatsAndGraph />}
        {activeComponent === "audit" && <UsersList users={users} />}
      </Box>
    </Box>
  );
}
