import { useNavigate } from 'react-router-dom'
import { ArrowRight, BarChart3, CheckCircle2, Clock3, Sparkles } from 'lucide-react'
import { t } from '../i18n.js'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function HomePage() {
  const navigate = useNavigate()
  const { lang } = useLanguage()

  function onLearnFeatures() {
    const el = document.getElementById('features')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div>
      <div className="card hero">
        <div className="heroGrid">
          <div>
            <h1 className="title">{t(lang, 'home_title')}</h1>
            <p className="subtitle">{t(lang, 'home_subtitle')}</p>

            <div className="btnRow">
              <button className="btn btnPrimary" type="button" onClick={() => navigate('/predict')}>
                {t(lang, 'cta_upload')}
                <ArrowRight size={18} />
              </button>
              <button className="btn" type="button" onClick={onLearnFeatures}>
                {t(lang, 'cta_learn_features')}
              </button>
            </div>
          </div>

          <div className="heroArt" aria-label="Highlights">
            <div className="heroArtTop">
              <div className="kpi">
                <div className="kpiLabel">Results in seconds</div>
                <div className="kpiValue">Fast</div>
              </div>
              <div className="kpi">
                <div className="kpiLabel">Works on phone</div>
                <div className="kpiValue">Field-ready</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="muted" style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>
                {t(lang, 'highlights')}
              </div>
              <div className="muted" style={{ lineHeight: 1.65 }}>
                {t(lang, 'highlights_text')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="features" style={{ marginTop: 18 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="sectionTitle" style={{ marginTop: 0 }}>
            {t(lang, 'features_title')}
          </div>

          <div className="grid2" style={{ marginTop: 14 }}>
            <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
              <div className="row" style={{ marginBottom: 8, justifyContent: 'flex-start' }}>
                <Clock3 size={18} />
                <div style={{ fontWeight: 900 }}>{t(lang, 'feature_fast_title')}</div>
              </div>
              <div className="muted" style={{ lineHeight: 1.7 }}>{t(lang, 'feature_fast_text')}</div>
            </div>

            <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
              <div className="row" style={{ marginBottom: 8, justifyContent: 'flex-start' }}>
                <BarChart3 size={18} />
                <div style={{ fontWeight: 900 }}>{t(lang, 'feature_conf_title')}</div>
              </div>
              <div className="muted" style={{ lineHeight: 1.7 }}>{t(lang, 'feature_conf_text')}</div>
            </div>

            <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
              <div className="row" style={{ marginBottom: 8, justifyContent: 'flex-start' }}>
                <CheckCircle2 size={18} />
                <div style={{ fontWeight: 900 }}>{t(lang, 'feature_results_title')}</div>
              </div>
              <div className="muted" style={{ lineHeight: 1.7 }}>{t(lang, 'feature_results_text')}</div>
            </div>

            <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
              <div className="row" style={{ marginBottom: 8, justifyContent: 'flex-start' }}>
                <Sparkles size={18} />
                <div style={{ fontWeight: 900 }}>{t(lang, 'feature_tips_title')}</div>
              </div>
              <div className="muted" style={{ lineHeight: 1.7 }}>{t(lang, 'feature_tips_text')}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
