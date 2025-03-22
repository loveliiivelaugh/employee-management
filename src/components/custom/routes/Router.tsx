import { type UtilityStoreType } from '@store/utilityStore';
import {
    createBrowserRouter,
    RouterProvider,
    useNavigate
} from "react-router";
// import App from "@components/App/App";
import Providers from "@custom/providers/Providers";
import { Navbar } from '@custom/ReusableNavbar/ReusableNavbar';
import { PageTransitionWrapper } from "@theme/ThemeProvider";
import BlurOnScroll from '@theme/BlurOnScroll';
import AuthForm from '@components/Auth/AuthForm';
import Dashboard from '@components/Mui/Dashboard/Dashboard';

type NavItemsType = {
    label: string;
    path?: string; // if includes path. Will be included in navitems as route
    element?: any;
    onClick?: (stores: any) => void;
    show?: (props: any) => boolean;
};

const extraNavItems: NavItemsType[] = [
    {
        label: "Logout",
        onClick: ({ navigate }: { navigate: (path: string, options?: any) => void }) => navigate('/'),
        show: ({ location }: any) => (location.pathname !== "/")
    }
];

// todo => this can go in a global app config
export const appRoutes = [
    {
        path: "/",
        element: (<AuthForm />)
    },
    {
        path: "/dashboard",
        element: (<Dashboard />)
    },
].map((route) => ({ 
    ...route, 
    id: route.path,
    element: (
        <>
            <Navbar 
                navItems={(routes) => [
                    ...routes,
                    // .filter((_, routeIndex) => (routeIndex !== 1)),
                    ...extraNavItems
                ]}
            />
                {route.element}
            {/* <BlurOnScroll>
            </BlurOnScroll> */}
        </>
    )
}));

const appRouter = createBrowserRouter(appRoutes);

export function AppRouter() {
    return (
        <PageTransitionWrapper>
            <Providers>
                {(initialData) => <RouterProvider router={appRouter} />}
            </Providers>
        </PageTransitionWrapper>
    )
};