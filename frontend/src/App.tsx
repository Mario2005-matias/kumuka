import { AppRouter } from './app/router';
import { ThemeProvider } from "@/components/shared/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AppRouter />
    </ThemeProvider>
  )
}