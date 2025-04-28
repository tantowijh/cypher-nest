import { LangSwitcher } from "./lang-switcher"
import { DropdownNavigation } from "./navigation-menu"
import { ThemeToggle } from "./theme-toggle"

const NavigationBar = () => {
    return (
        <div className="absolute top-4 flex items-center gap-2 backdrop-blur-md bg-card/50 p-2 rounded-lg shadow-md z-10">
            <DropdownNavigation />
            <LangSwitcher />
            <ThemeToggle />
        </div>
    )
}

export default NavigationBar