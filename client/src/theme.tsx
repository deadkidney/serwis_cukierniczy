import { createTheme } from '@mui/material/styles';
import { purple, lightGreen } from '@mui/material/colors';

export const myTheme = createTheme({
	colorSchemes: {
		light: {
			palette: {
				primary: purple,
				secondary: lightGreen,
			},
		},
		dark: {
			palette: {
				primary: purple,
				secondary: lightGreen,
			},
		}
	}
});
