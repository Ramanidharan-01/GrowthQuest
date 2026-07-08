import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
