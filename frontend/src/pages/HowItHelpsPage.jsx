import { Leaf, Users, Clock, Lightbulb } from 'lucide-react'
import { t } from '../i18n.js'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function HowItHelpsPage() {
  const { lang } = useLanguage()

  return (
    <div>
      <div className="card" style={{ padding: 20, marginTop: 12 }}>
        <div className="sectionTitle" style={{ marginTop: 0 }}>
          {t(lang, 'help_title')}
        </div>
        <div className="muted" style={{ lineHeight: 1.75, marginBottom: 24 }}>
          {t(lang, 'help_subtitle')}
        </div>

        <div className="grid2" style={{ gap: 20 }}>
          <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
            <div className="row" style={{ marginBottom: 10 }}>
              <Users size={20} />
              <div style={{ fontWeight: 900, fontSize: 15, marginLeft: 8 }}>
                {t(lang, 'help_who')}
              </div>
            </div>
            <div className="muted" style={{ lineHeight: 1.7 }}>
              {t(lang, 'help_who_text')}
            </div>
          </div>

          <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
            <div className="row" style={{ marginBottom: 10 }}>
              <Clock size={20} />
              <div style={{ fontWeight: 900, fontSize: 15, marginLeft: 8 }}>
                {t(lang, 'help_when')}
              </div>
            </div>
            <div className="muted" style={{ lineHeight: 1.7 }}>
              {t(lang, 'help_when_text')}
            </div>
          </div>

          <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
            <div className="row" style={{ marginBottom: 10 }}>
              <Lightbulb size={20} />
              <div style={{ fontWeight: 900, fontSize: 15, marginLeft: 8 }}>
                {t(lang, 'help_how')}
              </div>
            </div>
            <div className="muted" style={{ lineHeight: 1.7 }}>
              {t(lang, 'help_how_text')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
