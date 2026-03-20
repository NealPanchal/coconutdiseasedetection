import { useEffect, useRef, useState } from 'react'
import { Send, Mic, MicOff, Volume2, VolumeX, MessageCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { LANGUAGES, t } from '../i18n.js'

// Language code → SpeechRecognition locale
const LANG_TO_LOCALE = {
  en: 'en-US',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  ur: 'ur-PK',
  or: 'or-IN',
}

const API_BASE = 'http://localhost:8000'

// Simple markdown-like renderer for bot messages (**bold**, newlines, bullets)
function BotText({ text }) {
  const lines = text.split('\n')
  return (
    <span>
      {lines.map((line, i) => {
        // Bold **text**
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <span key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
            {i < lines.length - 1 && <br />}
          </span>
        )
      })}
    </span>
  )
}

export default function Chatbot() {
  const { lang, setLang } = useLanguage()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [voiceOn, setVoiceOn] = useState(false)
  const [micError, setMicError] = useState('')
  const [apiError, setApiError] = useState('')
  const bottomRef = useRef(null)
  const recogRef = useRef(null)

  const SpeechRecognition =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null
  const micSupported = Boolean(SpeechRecognition)

  // Greet on mount
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        role: 'bot',
        text: t(lang, 'chatbot_welcome'),
      },
    ])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recogRef.current) {
        recogRef.current.abort()
      }
    }
  }, [])

  async function sendMessage(text) {
    const trimmed = (text || input).trim()
    if (!trimmed) return
    setInput('')
    setApiError('')
    const userMsg = { id: Date.now(), role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, language: lang }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const botMsg = { id: Date.now() + 1, role: 'bot', text: data.reply }
      setMessages((prev) => [...prev, botMsg])
      if (voiceOn) speakText(data.reply, lang)
    } catch {
      const errMsg = t(lang, 'chatbot_api_error')
      setApiError(errMsg)
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'bot', text: errMsg, isError: true },
      ])
    } finally {
      setLoading(false)
    }
  }

  function speakText(text, langCode) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    // Strip emoji and markdown
    const clean = text.replace(/[^\p{L}\p{N}\s.,!?•\n]/gu, '').trim()
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = LANG_TO_LOCALE[langCode] || 'en-US'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  function startListening() {
    if (!micSupported) {
      setMicError(t(lang, 'chatbot_mic_unsupported'))
      return
    }
    setMicError('')
    const recognition = new SpeechRecognition()
    recogRef.current = recognition
    recognition.lang = LANG_TO_LOCALE[lang] || 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      // Auto send
      setTimeout(() => sendMessage(transcript), 100)
    }

    recognition.onerror = (event) => {
      setListening(false)
      if (event.error === 'no-speech') {
        setMicError(t(lang, 'chatbot_mic_no_speech'))
      } else if (event.error === 'not-allowed') {
        setMicError(t(lang, 'chatbot_mic_denied'))
      } else {
        setMicError(t(lang, 'chatbot_mic_error'))
      }
    }

    recognition.start()
  }

  function stopListening() {
    if (recogRef.current) {
      recogRef.current.stop()
    }
    setListening(false)
  }

  function toggleMic() {
    if (listening) {
      stopListening()
    } else {
      startListening()
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chatContainer">
      {/* Header */}
      <div className="chatHeader card">
        <div className="chatHeaderLeft">
          <div className="chatIconWrap">
            <MessageCircle size={20} color="#16a34a" />
          </div>
          <div>
            <div className="chatHeaderTitle">{t(lang, 'chatbot_title')}</div>
            <div className="chatHeaderSub">{t(lang, 'chatbot_subtitle')}</div>
          </div>
        </div>
        <div className="chatHeaderRight">
          {/* Language selector */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="chatLangSelect"
            aria-label="Chat language"
            id="chat-language-select"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
          {/* Voice toggle */}
          <button
            id="voice-toggle-btn"
            className={`voiceToggleBtn ${voiceOn ? 'voiceToggleOn' : ''}`}
            onClick={() => {
              setVoiceOn((v) => !v)
              if (voiceOn) window.speechSynthesis?.cancel()
            }}
            title={voiceOn ? t(lang, 'chatbot_voice_off') : t(lang, 'chatbot_voice_on')}
            type="button"
          >
            {voiceOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{voiceOn ? t(lang, 'chatbot_voice_off') : t(lang, 'chatbot_voice_on')}</span>
          </button>
        </div>
      </div>

      {/* Messages window */}
      <div className="chatWindow" id="chat-window" role="log" aria-live="polite">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chatBubbleWrap ${msg.role === 'user' ? 'chatBubbleWrapUser' : 'chatBubbleWrapBot'}`}
          >
            {msg.role === 'bot' && (
              <div className="chatAvatar" aria-hidden="true">🌴</div>
            )}
            <div
              className={`chatBubble ${
                msg.role === 'user' ? 'chatBubbleUser' : msg.isError ? 'chatBubbleError' : 'chatBubbleBot'
              }`}
            >
              {msg.role === 'bot' ? <BotText text={msg.text} /> : msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chatBubbleWrap chatBubbleWrapBot">
            <div className="chatAvatar" aria-hidden="true">🌴</div>
            <div className="chatBubble chatBubbleBot chatTyping">
              <span className="typingDot" />
              <span className="typingDot" />
              <span className="typingDot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Mic error */}
      {micError && (
        <div className="chatMicError" role="alert">
          {micError}
          <button
            type="button"
            className="chatMicErrorDismiss"
            onClick={() => setMicError('')}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* Listening indicator */}
      {listening && (
        <div className="chatListening" role="status" aria-live="polite">
          <span className="listeningDot" />
          {t(lang, 'chatbot_listening')}
        </div>
      )}

      {/* API error retry banner */}
      {apiError && (
        <div className="chatApiError" role="alert">
          ⚠️ {t(lang, 'chatbot_retry')}
        </div>
      )}

      {/* Input row */}
      <div className="chatInputRow">
        <input
          id="chat-input"
          className="chatInput"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={listening ? t(lang, 'chatbot_listening') : t(lang, 'chatbot_placeholder')}
          disabled={loading}
          aria-label={t(lang, 'chatbot_placeholder')}
        />

        {micSupported && (
          <button
            id="mic-btn"
            type="button"
            className={`micBtn ${listening ? 'micBtnListening' : ''}`}
            onClick={toggleMic}
            title={listening ? t(lang, 'chatbot_stop_mic') : t(lang, 'chatbot_start_mic')}
            disabled={loading}
            aria-label={listening ? t(lang, 'chatbot_stop_mic') : t(lang, 'chatbot_start_mic')}
          >
            {listening ? <MicOff size={20} /> : <Mic size={20} />}
            {listening && <span className="micPulseRing" aria-hidden="true" />}
          </button>
        )}

        <button
          id="send-btn"
          type="button"
          className="sendBtn btn btnPrimary"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          aria-label={t(lang, 'chatbot_send')}
        >
          <Send size={18} />
          <span className="sendLabel">{t(lang, 'chatbot_send')}</span>
        </button>
      </div>
    </div>
  )
}
