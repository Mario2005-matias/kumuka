import { AppRouter } from '../src/app/router';
import { ThemeProvider } from "@/components/shared/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRouter />
    </ThemeProvider>
  )
}