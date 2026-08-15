import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthProvider from './authContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material'
import { myTheme } from './theme.tsx'
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<ThemeProvider theme={myTheme}>
						<CssBaseline enableColorScheme/>
						<App />
					</ThemeProvider>
				</BrowserRouter>
			</QueryClientProvider>
		</AuthProvider>
	</StrictMode>
)
