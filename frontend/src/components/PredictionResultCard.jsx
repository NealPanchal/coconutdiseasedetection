import { AlertTriangle, CheckCircle2, Download, Printer, XCircle } from 'lucide-react'
import { t } from '../i18n.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { getDiseaseInfo } from '../diseaseInfo.js'

function isHealthyLabel(label) {
  return String(label || '').toLowerCase().includes('healthy')
}

function pct(conf) {
  return Math.round(Number(conf) * 1000) / 10
}

function linesToHtml(lines) {
  if (!Array.isArray(lines) || lines.length === 0) return '<p>Not available.</p>'
  return `<ul>${lines.map((l) => `<li>${l}</li>`).join('')}</ul>`
}

function buildReportHTML({ report, diseaseKey, confidence, lang, imageBase64 }) {
  const confPct = pct(confidence ?? 0)
  const code = String(lang || 'en').toLowerCase()
  const info = report || getDiseaseInfo(diseaseKey, code, null)
  const r = info || {}

  const html = `
<!DOCTYPE html>
<html lang="${code}" dir="${code === 'ar' || code === 'ur' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t(code, 'disease_report')} - ${diseaseKey}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e0e0e0; }
        .title { color: #2c3e50; font-size: 2em; margin: 0; }
        .subtitle { color: #7f8c8d; margin: 5px 0; }
        .image-container { text-align: center; margin: 20px 0; }
        .uploaded-image { max-width: 100%; max-height: 400px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .stats { display: flex; justify-content: space-between; background: #ecf0f1; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .stat-item { text-align: center; }
        .stat-label { font-weight: bold; color: #34495e; }
        .stat-value { font-size: 1.2em; color: #2c3e50; }
        .section { margin: 25px 0; }
        .section-title { color: #2c3e50; font-size: 1.3em; margin-bottom: 10px; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; }
        .section-content { padding-left: 10px; }
        ul { margin: 0; padding-left: 20px; }
        li { margin-bottom: 5px; }
        .note { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #7f8c8d; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">${t(code, 'disease_report')}</h1>
            <p class="subtitle">${t(code, 'generated_on')} ${new Date().toLocaleDateString(code === 'en' ? 'en-US' : code)}</p>
        </div>

        ${imageBase64 ? `<div class="image-container">
            <img src="${imageBase64}" alt="Uploaded coconut leaf image" class="uploaded-image" />
            <p style="margin-top: 10px; color: #7f8c8d; font-size: 0.9em;">${t(code, 'uploaded_image')}</p>
        </div>` : ''}

        <div class="stats">
            <div class="stat-item">
                <div class="stat-label">${t(code, 'predicted_class')}</div>
                <div class="stat-value">${diseaseKey ?? 'N/A'}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">${t(code, 'confidence')}</div>
                <div class="stat-value">${confPct}%</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">${t(code, 'status')}</div>
                <div class="stat-value">${r.status ?? 'N/A'}</div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">${t(code, 'likely_cause')}</h2>
            <div class="section-content">${linesToHtml(r.cause)}</div>
        </div>

        <div class="section">
            <h2 class="section-title">${t(code, 'symptoms')}</h2>
            <div class="section-content">${linesToHtml(r.symptoms)}</div>
        </div>

        <div class="section">
            <h2 class="section-title">${t(code, 'remedies')}</h2>
            <div class="section-content">${linesToHtml(r.remedy || r.remedies)}</div>
        </div>

        <div class="section">
            <h2 class="section-title">${t(code, 'prevention')}</h2>
            <div class="section-content">${linesToHtml(r.prevention)}</div>
        </div>

        <div class="section">
            <h2 class="section-title">${t(code, 'fertilizers')}</h2>
            <div class="section-content">${linesToHtml(r.fertilizers)}</div>
        </div>

        <div class="note">
            <strong>${t(code, 'note_report')}</strong>
        </div>

        <div class="footer">
            <p>${t(code, 'report_generated_by')} CocoGuard AI</p>
        </div>
    </div>
</body>
</html>
  `
  return html
}

function buildReportText({ report, diseaseKey, confidence, lang }) {
  const confPct = pct(confidence ?? 0)
  const code = String(lang || 'en').toLowerCase()
  const info = report || getDiseaseInfo(diseaseKey, code, null)
  const r = info || {}

  return [
    `${t(code, 'disease_report')}`,
    '-----------------------------------',
    `Predicted class: ${diseaseKey ?? 'N/A'}`,
    `${t(code, 'confidence')}: ${confPct}%`,
    `Status: ${r.status ?? 'N/A'}`,
    '',
    `${t(code, 'likely_cause')}`,
    linesToText(r.cause),
    '',
    `${t(code, 'symptoms')}`,
    linesToText(r.symptoms),
    '',
    `${t(code, 'remedies')}`,
    linesToText(r.remedy || r.remedies),
    '',
    `${t(code, 'fertilizers')}`,
    linesToText(r.fertilizers),
    '',
    `${t(code, 'prevention')}`,
    linesToText(r.prevention),
    '',
    `${t(code, 'note_report')}`
  ].join('\n')
}

function linesToText(lines) {
  if (!Array.isArray(lines) || lines.length === 0) return '  - Not available.'
  return lines.map((l) => `  - ${l}`).join('\n')
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function downloadHTML(filename, html) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function PredictionResultCard({ result }) {
  if (!result) return null

  const { lang } = useLanguage()

  const info = getDiseaseInfo(result.disease, lang, null)
  // Merge backend fertilizers if local info lacks them
  let report = info || result.report
  if (result.report?.fertilizers && (!report?.fertilizers || report.fertilizers.length === 0)) {
    report = { ...report, fertilizers: result.report.fertilizers }
  }

  const confidence = Number(result.confidence ?? 0)
  const healthy = isHealthyLabel(result.disease)
  const badgeClass = healthy ? 'badgeHealthy' : 'badgeDiseased'
  const Icon = healthy ? CheckCircle2 : XCircle

  const fillColor = healthy ? 'var(--green)' : 'var(--red)'
  const statusText = report?.status || (healthy ? 'Healthy' : 'Diseased')

  function onDownloadHTML() {
    const safeName = String(result.disease || 'report').replace(/\s+/g, '_')
    downloadHTML(
      `${safeName}_report_${String(lang || 'en').toLowerCase()}.html`,
      buildReportHTML({
        report,
        diseaseKey: result.disease,
        confidence: result.confidence,
        lang,
        imageBase64: result.image_base64
      })
    )
  }

  function onDownload() {
    const safeName = String(result.disease || 'report').replace(/\s+/g, '_')
    downloadText(
      `${safeName}_report_${String(lang || 'en').toLowerCase()}.txt`,
      buildReportText({ report, diseaseKey: result.disease, confidence: result.confidence, lang })
    )
  }

  function onPrint() {
    const text = buildReportText({ report, diseaseKey: result.disease, confidence: result.confidence, lang })
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<pre style="white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;padding:16px;line-height:1.5;">${text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</pre>`)
    w.document.close()
    w.focus()
    w.print()
  }

  return (
    <section className="card" style={{ padding: 18 }} aria-label="Prediction result">
      <div className="row">
        <div>
          <div className="muted" style={{ fontWeight: 800, fontSize: 12, letterSpacing: '0.02em' }}>
            {t(lang, 'prediction_result')}
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>
            {info?.label || result.disease}
          </div>
        </div>

        <div className={`badge ${badgeClass}`}>
          <Icon size={16} />
          {statusText}
        </div>
      </div>

      <div className="progressWrap">
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="muted" style={{ fontWeight: 800, fontSize: 13 }}>
            {t(lang, 'confidence')}
          </div>
          <div style={{ fontWeight: 900 }}>
            {pct(confidence)}%
          </div>
        </div>
        <div className="progressBar" role="progressbar" aria-valuenow={pct(confidence)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="progressFill"
            style={{ width: `${Math.min(100, Math.max(0, confidence * 100))}%`, background: fillColor }}
          />
        </div>

        {confidence < 0.6 ? (
          <div className="alert">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={18} />
              <div>
                {t(lang, 'low_conf_warning')}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
        <div className="row" style={{ marginBottom: 10 }}>
          <div className="muted" style={{ fontWeight: 900, fontSize: 13 }}>
            {t(lang, 'disease_report')}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn" type="button" onClick={onDownload}>
              <Download size={18} />
              {t(lang, 'download_report')}
            </button>
            <button className="btn" type="button" onClick={onPrint}>
              <Printer size={18} />
              {t(lang, 'print')}
            </button>
          </div>
        </div>

        <div className="grid2">
          <div className="card" style={{ padding: 14, boxShadow: 'none' }}>
            <div className="muted" style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>
              {t(lang, 'likely_cause')}
            </div>
            <div className="muted" style={{ lineHeight: 1.7 }}>
              {Array.isArray(report?.cause) && report.cause.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {report.cause.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              ) : (
                'Not available.'
              )}
            </div>
          </div>

          <div className="card" style={{ padding: 14, boxShadow: 'none' }}>
            <div className="muted" style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>
              {t(lang, 'symptoms')}
            </div>
            <div className="muted" style={{ lineHeight: 1.7 }}>
              {Array.isArray(report?.symptoms) && report.symptoms.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {report.symptoms.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              ) : (
                'Not available.'
              )}
            </div>
          </div>

          <div className="card" style={{ padding: 14, boxShadow: 'none' }}>
            <div className="muted" style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>
              {t(lang, 'remedies')}
            </div>
            <div className="muted" style={{ lineHeight: 1.7 }}>
              {Array.isArray(report?.remedy) && report.remedy.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {report.remedy.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              ) : Array.isArray(report?.remedies) && report.remedies.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {report.remedies.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              ) : (
                'Not available.'
              )}
            </div>
          </div>

          <div className="card" style={{ padding: 14, boxShadow: 'none' }}>
            <div className="muted" style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>
              {t(lang, 'prevention')}
            </div>
            <div className="muted" style={{ lineHeight: 1.7 }}>
              {Array.isArray(report?.prevention) && report.prevention.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {report.prevention.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              ) : (
                'Not available.'
              )}
            </div>
          </div>

          <div className="card" style={{ padding: 14, boxShadow: 'none' }}>
            <div className="muted" style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>
              {t(lang, 'fertilizers')}
            </div>
            <div className="muted" style={{ lineHeight: 1.7 }}>
              {Array.isArray(report?.fertilizers) && report.fertilizers.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {report.fertilizers.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              ) : (
                'Not available.'
              )}
            </div>
          </div>
        </div>

        <div className="muted" style={{ marginTop: 12, lineHeight: 1.65, fontSize: 13 }}>
          {t(lang, 'note_report')}
        </div>
      </div>
    </section>
  )
}
