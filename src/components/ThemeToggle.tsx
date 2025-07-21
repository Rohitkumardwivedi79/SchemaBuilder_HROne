import { useTheme } from '../context/ThemeContext';
import { Button } from 'antd';
import { BsSun, BsMoon } from 'react-icons/bs';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      onClick={toggleTheme}
      type="primary"
      shape="circle"
      icon={theme === 'light' ? <BsMoon style={{ fontSize: '16px' }} /> : <BsSun style={{ fontSize: '16px' }} />}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    />
  );
};

export default ThemeToggle;