import { useEffect, useRef, useState } from 'react'
import { X, RefreshCw, Camera } from 'lucide-react'
import { t } from '../i18n.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import API_BASE from '../apiConfig.js'

export default function LiveCamera({ onClose, onCapture, mode = 'live' }) { // mode: 'live' | 'capture'
  const { lang } = useLanguage()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [lastBlob, setLastBlob] = useState(null)
  const [facingMode, setFacingMode] = useState('environment') // 'user' or 'environment'
  const [isScanning, setIsScanning] = useState(true)
  const [isCapturing, setIsCapturing] = useState(false)

  // Start camera on mount
  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [facingMode])

  // Prediction loop (ONLY for live mode)
  useEffect(() => {
    let intervalId
    if (mode === 'live' && isScanning && stream) {
      intervalId = setInterval(captureAndPredict, 2000) // Predict every 2 seconds
    }
    return () => clearInterval(intervalId)
  }, [isScanning, stream, mode])

  async function startCamera() {
    stopCamera() // Ensure previous stream is stopped
    try {
      const constraints = {
        video: { facingMode: facingMode }
      }
      const newStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(newStream)
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
        videoRef.current.play()
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert(t(lang, 'camera_error') || "Could not access camera.")
      onClose()
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  function switchCamera() {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  // Used for both Live (auto) and Capture (manual) modes
  // For Capture mode, this is called only when button is pressed
  async function performCaptureAndPredict() {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    if (video.videoWidth === 0 || video.videoHeight === 0) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(null)
          return
        }
        setLastBlob(blob)
        setIsCapturing(true)

        const formData = new FormData()
        formData.append('file', blob, 'capture.jpg')
        formData.append('lang', lang)

        try {
          const res = await fetch(`${API_BASE}/predict`, {
            method: 'POST',
            body: formData
          })
          if (res.ok) {
            const data = await res.json()
            setPrediction(data)
            resolve({ data, blob })
          } else {
            resolve(null)
          }
        } catch (err) {
          console.error("Prediction failed", err)
          resolve(null)
        } finally {
          setIsCapturing(false)
        }
      }, 'image/jpeg', 0.8)
    })
  }

  async function captureAndPredict() {
    if (!isScanning) return
    await performCaptureAndPredict()
  }

  async function handleManualCapture() {
    const result = await performCaptureAndPredict()
    if (result && result.data) {
      onCapture(result.data, result.blob)
    }
  }

  const isLowConfidence = mode === 'live' && prediction && prediction.confidence < 0.5
  const hasPrediction = mode === 'live' && !!prediction

  return (
    <div className="cameraModalOverlay">
      <div className="cameraModal" style={{ maxWidth: '100%', height: '100%', borderRadius: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div className="cameraHeader" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
            {mode === 'live' ? (t(lang, 'live_scan') || 'Live Scan') : (t(lang, 'take_photo') || 'Take Photo')}
          </h3>
          <button className="btn" onClick={onClose} style={{ color: 'white', background: 'transparent', border: 'none' }}>
            <X size={24} />
          </button>
        </div>

        {/* Video Feed */}
        <div className="cameraVideoWrapper" style={{ flex: 1, position: 'relative', background: 'black', overflow: 'hidden' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Scanning Overlay (only for Live mode) */}
          {mode === 'live' && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70%',
              height: '40%',
              border: `2px solid ${isLowConfidence ? 'rgba(239, 68, 68, 0.7)' : 'rgba(255, 255, 255, 0.7)'}`,
              borderRadius: '12px',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              pointerEvents: 'none',
              zIndex: 5,
              transition: 'border-color 0.3s ease'
            }}>
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                width: '100%',
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
              }}>
                {t(lang, 'scanning') || 'Scanning...'}
              </div>
            </div>
          )}

          {/* Prediction Result Overlay (only for Live mode) */}
          {mode === 'live' && hasPrediction && (
            <div style={{
              position: 'absolute',
              bottom: '120px',
              left: '20px',
              right: '20px',
              background: 'white',
              padding: '15px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              zIndex: 20
            }}>
              {isLowConfidence ? (
                <div style={{ textAlign: 'center', color: '#b91c1c' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>
                    Low Confidence
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    {t(lang, 'low_confidence_hint')}
                  </p>
                </div>
              ) : (
                <>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: prediction.disease === 'Healthy_Leaves' ? '#10b981' : '#ef4444' }}>
                    {prediction.report?.status || prediction.disease}
                  </h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#374151' }}>
                    {prediction.report?.cause?.[0] || prediction.disease}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {t(lang, 'confidence')}: {(prediction.confidence * 100).toFixed(1)}%
                    </span>
                    <div style={{
                      height: '6px',
                      width: '100px',
                      background: '#e5e7eb',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${prediction.confidence * 100}%`,
                        background: prediction.confidence > 0.7 ? '#10b981' : '#f59e0b'
                      }} />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="cameraActions" style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'transparent',
          gap: '40px',
          zIndex: 20
        }}>
          <button className="btn" onClick={switchCamera} style={{
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            padding: 0,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            border: 'none',
            color: 'white'
          }}>
            <RefreshCw size={24} />
          </button>

          {/* Capture Button */}
          <button
            onClick={mode === 'live' ? () => {
              if (prediction && prediction.confidence >= 0.5 && lastBlob) {
                onCapture(prediction, lastBlob)
              }
            } : handleManualCapture}
            disabled={mode === 'live' ? (!hasPrediction || isLowConfidence) : isCapturing}
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: (mode === 'live' && (!hasPrediction || isLowConfidence)) ? 'rgba(255,255,255,0.5)' : 'white',
              border: '4px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: (mode === 'live' && (!hasPrediction || isLowConfidence)) ? 'not-allowed' : 'pointer',
              transition: 'transform 0.1s',
              opacity: isCapturing ? 0.7 : 1
            }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '2px solid black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Show spinner or camera icon */}
              {isCapturing ? (
                <div className="spinner" style={{ width: 24, height: 24, border: '3px solid #ccc', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              ) : (
                <Camera size={28} color="black" />
              )}
            </div>
          </button>

          {/* Spacer to balance the layout */}
          <div style={{ width: '50px' }}></div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
