import { useState } from 'react'
import { Camera, ScanLine } from 'lucide-react'
import UploadCard from '../components/UploadCard.jsx'
import PredictionResultCard from '../components/PredictionResultCard.jsx'
import LiveCamera from '../components/LiveCamera.jsx'
import ChatbotWidget from '../components/ChatbotWidget.jsx'
import { t } from '../i18n.js'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function PredictPage() {
  const [result, setResult] = useState(null)
  const [showLiveCamera, setShowLiveCamera] = useState(false)
  const [cameraMode, setCameraMode] = useState('live') // 'live' | 'capture'
  const { lang } = useLanguage()

  if (showLiveCamera) {
    return (
      <LiveCamera
        mode={cameraMode}
        onClose={() => setShowLiveCamera(false)}
        onCapture={(prediction) => {
          setResult(prediction)
          setShowLiveCamera(false)
        }}
      />
    )
  }

  return (
    <div>
      <div className="grid2">
        <div>
          <UploadCard onPredicted={setResult} />

          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {/* Live Scan Button */}
            <button
              className="btn"
              onClick={() => {
                setCameraMode('live')
                setShowLiveCamera(true)
              }}
              style={{ justifyContent: 'center', padding: '15px' }}
            >
              <ScanLine size={20} />
              <span style={{ marginLeft: 8 }}>{t(lang, 'live_scan')}</span>
            </button>

            {/* Take Photo Button */}
            <button
              className="btn"
              onClick={() => {
                setCameraMode('capture')
                setShowLiveCamera(true)
              }}
              style={{ justifyContent: 'center', padding: '15px', background: 'var(--blue)', borderColor: 'var(--blue)', color: 'white' }}
            >
              <Camera size={20} />
              <span style={{ marginLeft: 8 }}>{t(lang, 'take_photo')}</span>
            </button>
          </div>

        </div>
        <PredictionResultCard result={result} />
      </div>

      <div className="card" style={{ padding: 18, marginTop: 18 }}>
        <div className="sectionTitle" style={{ marginTop: 0 }}>
          {t(lang, 'tips_title')}
        </div>
        <div className="muted" style={{ lineHeight: 1.75 }}>
          1. {t(lang, 'tips_1')}
          <br />
          2. {t(lang, 'tips_2')}
          <br />
          3. {t(lang, 'tips_3')}
        </div>
      </div>

      {/* Floating chatbot widget — bottom-left */}
      <ChatbotWidget />
    </div>
  )
}
