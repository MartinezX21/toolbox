'use client'

import { createContext, useMemo, useState } from "react"
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";

export type AppTheme = 'dark' | 'light'

export interface IThemeContext {
    theme: AppTheme,
    setTheme: React.Dispatch<React.SetStateAction<IThemeContext['theme']>>
}

export const ThemeContext = createContext<IThemeContext | null>(null)

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<IThemeContext['theme']>('light')

    const value = useMemo(() => ({theme, setTheme}), [theme])
    const muiTheme = useMemo(() => {
        return createTheme({
            palette: {
                mode: value.theme,
            }
        })
    }, [value.theme])
    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
        </MuiThemeProvider>
    )
}