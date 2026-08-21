import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthProvider from './authContext.tsx'
import MixRecipesProvider from './mixRecipesContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { myTheme } from './theme.tsx'
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AuthProvider>
			<MixRecipesProvider>
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<ThemeProvider theme={myTheme}>
							<CssBaseline enableColorScheme/>
							<App />
						</ThemeProvider>
					</BrowserRouter>
				</QueryClientProvider>
			</MixRecipesProvider>
		</AuthProvider>
	</StrictMode>
)
