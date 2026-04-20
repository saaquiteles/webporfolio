import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import SkillsSection from "./sections/SkillsSection";
import Contact from "./sections/Contact";
import ScrollProgress from "./components/layout/ScrollProgress";
import ThemeToggle from "./components/ui/ThemeToggle";
import { ThemeProvider } from './context/ThemeContext'
function App() {
  return (
    <ThemeProvider>
      <div className="relative">
        <ThemeToggle />
        <main>
          <ScrollProgress />
          <Hero />
          <About />
          <Projects />
        </main>
        <Contact />
      </div>
    </ThemeProvider>
  );
}

export default App;