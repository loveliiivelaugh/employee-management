import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { PageTransitionWrapper, ThemeProvider } from '@theme/index';
import QueryWrapper from '@custom/wrappers/QueryWrapper/QueryWrapper';
import Drawer from '@mui2/Drawer/Drawer';
import AlertProvider from './AlertProvider';
import { ConfirmProvider } from './Confirm';
import ModalProvider from './ModalProvider';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
// import { server } from '@testing/msw/node';

const queryClient = new QueryClient();

const Providers = (
    { children, path }: 
    { 
        children: (callback?: { data: any }) => React.ReactNode
        path?: (paths: any) => string | boolean,
    }
) => {
    // server.listen(); //Testing Framework to intercept and mock network requests
    const handlePath = (paths: any) => path ? path(paths) : "";
    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <ThemeProvider>
                        <PageTransitionWrapper>
                            {((typeof(path) === "boolean") && !path)
                                ? children()
                                : (
                                    <QueryWrapper path={handlePath as (paths: any) => string}>
                                        {({ data }) => children(data)}
                                    </QueryWrapper>
                                )
                            }
                            <AlertProvider />
                            <ConfirmProvider />
                            <Drawer />
                            <ModalProvider />
                        </PageTransitionWrapper>
                    </ThemeProvider>
                </LocalizationProvider>
            </ErrorBoundary>
        </QueryClientProvider>
    )
}

export default Providers
export type Providers = ReturnType<typeof Providers>