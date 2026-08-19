import { createTheme } from '@mui/material/styles';
import { purple, teal } from '@mui/material/colors';

export const myTheme = createTheme({
	colorSchemes: {
		light: {
			palette: {
				primary: purple,
				secondary: teal,
			},
		},
		dark: {
			palette: {
				primary: purple,
				secondary: teal,
			},
		}
	}
});
