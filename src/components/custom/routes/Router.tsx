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
import SupabaseDefaultAuth from '@components/Auth/SupabaseDefault';
import { supabase } from '@api/supabase';
import PricingPage from '@components/EmployeeTime/PricingPage';
import PaymentPage from '@components/EmployeeTime/PaymentPage';
import SuccessPage from '@components/EmployeeTime/SuccessPage';
import { useSupabaseStore } from '@store/supabaseStore';

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
        // onClick: ({ navigate }: { navigate: (path: string, options?: any) => void }) => navigate('/'),
        onClick: () => supabase.auth.signOut(),
        show: ({ supabaseStore }: any) => supabaseStore?.session
    }
];

// const authed = false;
const AuthGuard = ({ children }: any) => {
    // const supabaseStore = useSupabaseStore();
    const navigate = useNavigate();
    // if (!supabaseStore?.session) navigate('/');
    return children;
};

// todo => this can go in a global app config
export const appRoutes = [
    {
        label: "Home",
        path: "/",
        element: (<Dashboard />)
    },
    {
        label: "Payment",
        path: "/payment",
        element: (<PaymentPage />)
    },
    {
        label: "Success",
        path: "/success",
        element: (<SuccessPage />)
    },
    {
        path: "/cancel",
        element: (<SuccessPage />),
        // show: false
    },
].map((route) => ({ 
    ...route, 
    id: route.path,
    element: (
        <AuthGuard>
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
        </AuthGuard>
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