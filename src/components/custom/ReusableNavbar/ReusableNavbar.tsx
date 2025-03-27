import React from 'react';
import { useLocation, useNavigate } from "react-router";
import {
    AppBar, Avatar, Box, Button, ListItemText,
    ListItem, ListItemAvatar, ListItemButton, 
    Toolbar, Typography 
} from '@mui/material';
import { appRoutes } from "@custom/routes/Router";
import useUtilityStore from "@store/utilityStore";
import { useSupabaseStore } from "@store/supabaseStore";

const ButtonWrapper = (props: any) => <Button variant="outlined" {...props} />;

type NavItemsType = {
    label: string;
    path?: string; // if includes path. Will be included in navitems as route
    element?: any;
    onClick?: (stores: any) => void;
    show?: (props: any) => boolean;
};

const assignNavItemsByType = (navItems: any) => {
    const type = typeof navItems;
    if (type === "function") return navItems(appRoutes);
    if (Array.isArray(navItems)) return navItems
    else if (type === "object") return [navItems]
    else if (type === "string") return [{label: navItems}]
    else return [];
};

type NavbarPropsType = {
    navItems: 
        (appRoutes: NavItemsType[]) => NavItemsType[]
        | NavItemsType[]
        | NavItemsType
        | string 
}

export const Navbar = (props: NavbarPropsType) => {
    const utilityStore = useUtilityStore();
    const supabaseStore = useSupabaseStore();
    const navigate = useNavigate();
    const location = useLocation();
    const navItems = assignNavItemsByType(props.navItems);
    return (
        <AppBar
            sx={{
                zIndex: 100,
                backdropFilter: "blur(12px)",
                bgcolor: "transparent",
                border: "none",
                boxShadow: "none",
                "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: "-20px", // Adjust if needed
                    height: "80px", // Controls how far the blur radiates
                    background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.2), transparent)",
                    pointerEvents: "none",
                },
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar src={"headshot"} />
                    </ListItemAvatar>
                    <ListItemText 
                        primary={
                            <Typography color="inherit" variant="h6" component="h6">
                                ScheduleTime
                            </Typography>
                        }
                        secondary={"your company"}
                    />
                </ListItem>

                <Box sx={{ display: "flex", width: "100%" }}>
                    {navItems.map((listItem: NavItemsType, index: number) => !listItem?.show || (listItem?.show && listItem.show({ location, supabaseStore }))
                        ? (
                            <ListItemButton
                                key={index}
                                // // @ts-expect-error
                                // primary={(index > 2) 
                                //     ? <ButtonWrapper></ButtonWrapper>
                                //     : <ListItemButton></ListItemButton>
                                // } 
                                children={listItem.label}
                                onClick={
                                    (listItem?.path && !listItem.path.includes(":"))
                                        ? () => listItem.path && navigate(listItem.path)
                                        : () => listItem.onClick && listItem.onClick({ navigate, utilityStore, supabaseStore })
                                }
                            />
                        )
                    : null)}
                </Box>
            </Toolbar>
        </AppBar>
    );
};