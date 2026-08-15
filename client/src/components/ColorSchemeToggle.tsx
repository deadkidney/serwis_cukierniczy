import { useColorScheme } from '@mui/material/styles';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import DevicesIcon from '@mui/icons-material/Devices';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function ColorSchemeToggle() {
	const { mode, setMode } = useColorScheme();
	if (!mode) {
		return null;
	}
	return (
				<ToggleButtonGroup
					value={mode}
					exclusive
					onChange={(e, mode) => setMode(mode)}
					aria-label="color theme toggle"
					size="small"
				>
					<ToggleButton value="system" aria-label='system' >
						<DevicesIcon/>
					</ToggleButton>
					<ToggleButton value="light" aria-label='light'>
						<LightModeIcon/>
					</ToggleButton>
					<ToggleButton value="dark" aria-label='dark'>
						<DarkModeIcon/>
					</ToggleButton>
				</ToggleButtonGroup>
	);
}