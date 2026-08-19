import { Backdrop, CircularProgress } from "@mui/material";

export default function LoadingScreen () {
	return (
		<Backdrop
				sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
				open
			>
				<CircularProgress color="secondary" />
			</Backdrop>
		);
}	