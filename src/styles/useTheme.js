import {useState} from 'react';

export const useTheme = () => {
    let initTheme = 'light';
    const localSettingTheme = localStorage.getItem('theme');

    if (localSettingTheme) {
        initTheme = localSettingTheme;
    }

    const [theme, setTheme] = useState(initTheme);

    const setMode = mode => {
        window.localStorage.setItem('theme', mode === 'light' ? 'dark' : 'light')
        setTheme(mode)
    };

    const toggleTheme = () => setMode(theme === 'light' ? 'dark' : 'light');

    return [theme, toggleTheme];
};