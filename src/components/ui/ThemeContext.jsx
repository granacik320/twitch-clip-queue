import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { colorSchemeToggled, selectColorScheme } from '../../features/settings/settingsSlice';

// Create a context
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const dispatch = useAppDispatch();
    const [mounted, setMounted] = useState(false);

    // Get the preferred color scheme from the browser
    const preferredColorScheme = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';

    // Get the color scheme from Redux
    const colorScheme = useAppSelector((state) => selectColorScheme(state, preferredColorScheme));

    // Toggle theme
    const toggleTheme = () => {
        dispatch(colorSchemeToggled(preferredColorScheme));
    };

    // After mounting, we can show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (colorScheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [colorScheme]);

    // Prevent flash of unstyled content
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme: colorScheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom hook for using the theme context
export function useTheme() {
    return useContext(ThemeContext);
}

// Hook to detect preferred color scheme
function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const handler = (event) => {
            setMatches(event.matches);
        };

        mediaQuery.addEventListener('change', handler);

        return () => {
            mediaQuery.removeEventListener('change', handler);
        };
    }, [query]);

    return matches;
}
