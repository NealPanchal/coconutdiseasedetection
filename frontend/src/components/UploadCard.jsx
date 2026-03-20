import { useEffect, useMemo, useRef, useState } from 'react'
import { Camera, ImageUp, RefreshCw, Trash2, Upload } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner.jsx'
import { t } from '../i18n.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import API_BASE from '../apiConfig.js'

function fileFromBlob(blob) {
  return new File([blob], 'capture.jpg', { type: 'image/jpeg' })
}

// Resize large images client-side to max 1024px (speeds up upload, avoids huge files)
async function resizeImageFile(file, maxDim = 1024) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const { naturalWidth: w, naturalHeight: h } = img
      if (w <= maxDim && h <= maxDim) { resolve(file); return }
      const scale = maxDim / Math.max(w, h)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(w * scale)
      canvas.height = Math.round(h * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        resolve(blob ? new File([blob], file.name, { type: 'image/jpeg' }) : file)
      }, 'image/jpeg', 0.92)
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
}

function getPredictErrorMessage(status, body) {
  const text = String(body || '').trim()
  const lowered = text.toLowerCase()
  const proxyConnectionFailed =
    (status === 500 && !text) ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    lowered.includes('econnrefused') ||
    lowered.includes('proxy error')

  if (proxyConnectionFailed) {
    return (
      'Backend API is not running on http://127.0.0.1:8000. ' +
      'Start it from project root with: env/bin/uvicorn inference.inference.infer:app --host 127.0.0.1 --port 8000 --reload'
    )
  }

  if (text) return text
  return `Request failed (${status})`
}

// Converts a File/Blob to a data-URL string (for the HTML report download)
function fileToDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(file)
  })
}

export default function UploadCard({ onPredicted }) {
  const { lang } = useLanguage()
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState('') // 'uploading' | 'analysing' | 'done'
  const [error, setError] = useState('')
  const [cameraFacingMode, setCameraFacingMode] = useState('environment')
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [cameraDevices, setCameraDevices] = useState([])
  const [selectedCameraId, setSelectedCameraId] = useState('')

  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const canUseMediaDevices = useMemo(() => {
    return typeof navigator !== 'undefined' && !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia
  }, [])

  useEffect(() => {
    if (!file) {
      setPreviewUrl('')
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  // Auto-predict whenever a new file is selected
  useEffect(() => {
    if (file) runPrediction(file)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraStream])

  async function getCameraDevices() {
    if (!canUseMediaDevices) return []
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      return videoDevices
    } catch {
      return []
    }
  }

  async function startCamera(deviceId = '') {
    if (!canUseMediaDevices) {
      cameraInputRef.current?.click()
      return
    }
    try {
      const constraints = {
        video: deviceId 
          ? { deviceId: { exact: deviceId } }
          : { facingMode: cameraFacingMode }
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setCameraStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setShowCameraModal(true)
    } catch (err) {
      console.warn('Camera access failed, falling back to file input', err)
      cameraInputRef.current?.click()
    }
  }

  async function switchCamera(deviceId) {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
    }
    setSelectedCameraId(deviceId)
    await startCamera(deviceId)
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setShowCameraModal(false)
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      if (blob) {
        const file = fileFromBlob(blob)
        setFile(file)
        stopCamera()
      }
    }, 'image/jpeg', 0.9)
  }

  async function runPrediction(selectedFile) {
    setError('')
    setLoading(true)
    setLoadingStage('uploading')
    try {
      // Resize large images before sending for faster, more reliable prediction
      const optimised = await resizeImageFile(selectedFile)
      const form = new FormData()
      form.append('file', optimised)
      form.append('lang', lang)

      setLoadingStage('analysing')
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        body: form
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(getPredictErrorMessage(res.status, text))
      }

      setLoadingStage('done')
      const json = await res.json()
      // Generate base64 client-side for use in report downloads (no round-trip needed)
      const imageBase64 = await fileToDataURL(optimised)
      onPredicted?.({ ...json, image_base64: imageBase64 })
    } catch (e) {
      setError(e?.message || 'Prediction failed')
    } finally {
      setLoading(false)
      setLoadingStage('')
    }
  }

  function onPickFile(e) {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragActive(false)
    const f = e.dataTransfer.files?.[0]
    if (f) setFile(f)
  }

  async function tryOpenCamera() {
    setError('')
    const devices = await getCameraDevices()
    setCameraDevices(devices)
    if (devices.length > 0) {
      setSelectedCameraId(devices[0].deviceId)
      await startCamera(devices[0].deviceId)
    } else {
      cameraInputRef.current?.click()
    }
  }

  async function onCameraPicked(e) {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  async function predictNow() {
    if (!file || loading) return
    await runPrediction(file)
  }

  async function clearAll() {
    setError('')
    setFile(null)
    onPredicted?.(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  return (
    <>
      {showCameraModal && (
        <div className="cameraModalOverlay" onClick={stopCamera}>
          <div className="cameraModal" onClick={(e) => e.stopPropagation()}>
            <div className="cameraHeader">
              <h3>{t(lang, 'camera')}</h3>
              <button className="btn" onClick={stopCamera}>✕</button>
            </div>
            <div className="cameraVideoWrapper">
              <video ref={videoRef} autoPlay playsInline muted />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            {cameraDevices.length > 1 && (
              <div className="cameraSelector">
                <select
                  value={selectedCameraId}
                  onChange={(e) => switchCamera(e.target.value)}
                  className="cameraSelect"
                >
                  {cameraDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || t(lang, 'camera')}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="cameraActions">
              <button className="btn btnPrimary" onClick={capturePhoto}>
                {t(lang, 'capture_photo')}
              </button>
              <button className="btn" onClick={stopCamera}>
                {t(lang, 'cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
      <section className="card" style={{ padding: 18 }} aria-label="Upload leaf image">
        <div className="row" style={{ marginBottom: 10 }}>
          <div>
            <div className="muted" style={{ fontWeight: 900, fontSize: 12, letterSpacing: '0.02em' }}>
              {t(lang, 'upload_or_capture')}
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, marginTop: 4 }}>
              {t(lang, 'coconut_leaf_image')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn" type="button" onClick={() => fileInputRef.current?.click()}>
              <ImageUp size={18} />
              {t(lang, 'choose_file')}
            </button>
            <button className="btn" type="button" onClick={tryOpenCamera}>
              <Camera size={18} />
              {t(lang, 'camera')}
            </button>
          </div>
        </div>

      <div
        className={`dropZone ${dragActive ? 'dropZoneActive' : ''}`}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragActive(false)
        }}
        onDrop={onDrop}
      >
        {previewUrl ? (
          <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <img className="previewImg" src={previewUrl} alt="Leaf preview" style={{ display: 'block', width: '100%', opacity: loading ? 0.55 : 1, transition: 'opacity 0.3s' }} />
            {loading && (
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 10,
                background: 'rgba(0,0,0,0.35)', borderRadius: 10
              }}>
                <LoadingSpinner />
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '0.02em' }}>
                  {loadingStage === 'uploading' ? 'Uploading image…' : 'Analysing leaf…'}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 900 }}>
              <Upload size={18} />
              {t(lang, 'drag_drop')}
            </div>
            <div className="muted" style={{ marginTop: 8, lineHeight: 1.6 }}>
              {t(lang, 'supported_formats')}
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onPickFile}
          style={{ display: 'none' }}
        />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onCameraPicked}
          style={{ display: 'none' }}
        />
      </div>

      <div className="btnRow">
        <button className={`btn btnPrimary`} type="button" onClick={predictNow} disabled={!file || loading}>
          {loading ? <LoadingSpinner /> : <RefreshCw size={16} />}
          {loading
            ? loadingStage === 'uploading'
              ? 'Uploading…'
              : loadingStage === 'analysing'
              ? 'Analysing…'
              : 'Preparing…'
            : t(lang, 'predict')}
        </button>
        <button className="btn" type="button" onClick={clearAll} disabled={loading && !file}>
          <Trash2 size={18} />
          {t(lang, 'clear')}
        </button>
      </div>

      {error ? (
        <div className="alert" style={{ borderColor: 'rgba(220, 38, 38, 0.25)', background: 'rgba(220, 38, 38, 0.10)', color: '#7f1d1d' }}>
          {error}
        </div>
      ) : null}
      </section>
    </>
  )
}
