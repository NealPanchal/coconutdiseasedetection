import { NavLink } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { LANGUAGES, t } from '../i18n.js'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function Navbar() {
  const { lang, setLang } = useLanguage()

  return (
    <header className="nav">
      <div className="navInner">
        <div className="brand" aria-label="Project">
          <div className="brandMark" aria-hidden="true">
            <Leaf size={18} />
          </div>
          <div>
            {t(lang, 'brand')}
          </div>
        </div>

        <nav className="navLinks" aria-label="Primary">
          <NavLink
            to="/"
            className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}
          >
            {t(lang, 'nav_home')}
          </NavLink>
          <NavLink
            to="/predict"
            className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}
          >
            {t(lang, 'nav_predict')}
          </NavLink>
          <NavLink
            to="/help"
            className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}
          >
            {t(lang, 'nav_help')}
          </NavLink>
          <NavLink
            to="/project"
            className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}
          >
            {t(lang, 'nav_project')}
          </NavLink>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Language"
            className="navLink"
            style={{ background: 'transparent', cursor: 'pointer' }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </nav>
      </div>
    </header>
  )
}
