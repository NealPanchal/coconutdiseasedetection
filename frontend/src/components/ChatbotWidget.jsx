import { useEffect, useRef, useState } from 'react'
import { Send, Mic, MicOff, Volume2, VolumeX, X, MessageCircle, ChevronDown } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { t } from '../i18n.js'

const LANG_TO_LOCALE = {
  en: 'en-US', hi: 'hi-IN', mr: 'mr-IN', ta: 'ta-IN', te: 'te-IN',
  kn: 'kn-IN', ml: 'ml-IN', bn: 'bn-IN', gu: 'gu-IN', pa: 'pa-IN',
  ur: 'ur-PK', or: 'or-IN',
}

function BotText({ text }) {
  const lines = text.split('\n')
  return (
    <span>
      {lines.map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <span key={i}>
            {parts.map((part, j) => (j % 2 === 1 ? <strong key={j}>{part}</strong> : part))}
            {i < lines.length - 1 && <br />}
          </span>
        )
      })}
    </span>
  )
}

export default function ChatbotWidget() {
  const { lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [voiceOn, setVoiceOn] = useState(false)
  const [micError, setMicError] = useState('')
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef(null)
  const recogRef = useRef(null)
  const inputRef = useRef(null)

  const SpeechRecognition =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null
  const micSupported = Boolean(SpeechRecognition)

  // Greet once on first open
  const greetedRef = useRef(false)
  useEffect(() => {
    if (open && !greetedRef.current) {
      greetedRef.current = true
      setMessages([{ id: Date.now(), role: 'bot', text: t(lang, 'chatbot_welcome') }])
    }
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open, lang])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => () => recogRef.current?.abort(), [])

  async function sendMessage(text) {
    const trimmed = (text ?? input).trim()
    if (!trimmed) return
    setInput('')
    setMicError('')
    const userMsg = { id: Date.now(), role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, language: lang }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      const botMsg = { id: Date.now() + 1, role: 'bot', text: data.reply }
      setMessages((prev) => [...prev, botMsg])
      if (voiceOn) speakText(data.reply, lang)
      if (!open) setUnread((n) => n + 1)
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'bot', text: t(lang, 'chatbot_api_error'), isError: true },
      ])
    } finally {
      setLoading(false)
    }
  }

  function speakText(text, langCode) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const clean = text.replace(/[^\p{L}\p{N}\s.,!?•\n]/gu, '').trim()
    const u = new SpeechSynthesisUtterance(clean)
    u.lang = LANG_TO_LOCALE[langCode] || 'en-US'
    u.rate = 0.9
    window.speechSynthesis.speak(u)
  }

  function startListening() {
    if (!micSupported) { setMicError(t(lang, 'chatbot_mic_unsupported')); return }
    setMicError('')
    const recognition = new SpeechRecognition()
    recogRef.current = recognition
    recognition.lang = LANG_TO_LOCALE[lang] || 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onresult = (e) => {
      const t2 = e.results[0][0].transcript
      setInput(t2)
      setTimeout(() => sendMessage(t2), 80)
    }
    recognition.onerror = (e) => {
      setListening(false)
      if (e.error === 'no-speech') setMicError(t(lang, 'chatbot_mic_no_speech'))
      else if (e.error === 'not-allowed') setMicError(t(lang, 'chatbot_mic_denied'))
      else setMicError(t(lang, 'chatbot_mic_error'))
    }
    recognition.start()
  }

  function toggleMic() {
    if (listening) { recogRef.current?.stop(); setListening(false) }
    else startListening()
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        id="chatbot-fab"
        className={`chatFab ${open ? 'chatFabOpen' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat assistant'}
        title="CocoGuard Assistant"
      >
        {open ? <ChevronDown size={22} /> : <MessageCircle size={22} />}
        {!open && unread > 0 && (
          <span className="chatFabBadge">{unread}</span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="chatWidget" role="dialog" aria-label="CocoGuard chat assistant">
          {/* Widget header */}
          <div className="chatWidgetHeader">
            <div className="chatWidgetHeaderLeft">
              <div className="chatWidgetIcon">🌴</div>
              <div>
                <div className="chatWidgetTitle">{t(lang, 'chatbot_title')}</div>
                <div className="chatWidgetSub">{t(lang, 'chatbot_subtitle')}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {/* Voice toggle */}
              <button
                id="widget-voice-btn"
                className={`widgetVoiceBtn ${voiceOn ? 'widgetVoiceBtnOn' : ''}`}
                onClick={() => { setVoiceOn((v) => !v); if (voiceOn) window.speechSynthesis?.cancel() }}
                title={voiceOn ? t(lang, 'chatbot_voice_off') : t(lang, 'chatbot_voice_on')}
                type="button"
              >
                {voiceOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>
              {/* Close */}
              <button
                id="chatbot-close-btn"
                className="chatWidgetClose"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chatWidgetMessages" id="chat-window" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatWidgetRow ${msg.role === 'user' ? 'chatWidgetRowUser' : 'chatWidgetRowBot'}`}
              >
                {msg.role === 'bot' && <div className="chatWidgetAvatar">🌴</div>}
                <div
                  className={`chatWidgetBubble ${
                    msg.role === 'user' ? 'chatWidgetBubbleUser'
                    : msg.isError ? 'chatWidgetBubbleError'
                    : 'chatWidgetBubbleBot'
                  }`}
                >
                  {msg.role === 'bot' ? <BotText text={msg.text} /> : msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chatWidgetRow chatWidgetRowBot">
                <div className="chatWidgetAvatar">🌴</div>
                <div className="chatWidgetBubble chatWidgetBubbleBot chatWidgetTyping">
                  <span className="typingDot" /><span className="typingDot" /><span className="typingDot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Mic error */}
          {micError && (
            <div className="chatWidgetAlert" role="alert">
              {micError}
              <button type="button" onClick={() => setMicError('')} className="chatWidgetAlertClose">×</button>
            </div>
          )}

          {/* Listening indicator */}
          {listening && (
            <div className="chatWidgetListening" role="status">
              <span className="listeningDot" />
              {t(lang, 'chatbot_listening')}
            </div>
          )}

          {/* Input row */}
          <div className="chatWidgetInput">
            <input
              id="chat-input"
              ref={inputRef}
              type="text"
              className="chatWidgetInputBox"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder={listening ? t(lang, 'chatbot_listening') : t(lang, 'chatbot_placeholder')}
              disabled={loading}
              aria-label={t(lang, 'chatbot_placeholder')}
            />
            {micSupported && (
              <button
                id="mic-btn"
                type="button"
                className={`chatWidgetMic ${listening ? 'chatWidgetMicOn' : ''}`}
                onClick={toggleMic}
                disabled={loading}
                aria-label={listening ? t(lang, 'chatbot_stop_mic') : t(lang, 'chatbot_start_mic')}
                title={listening ? t(lang, 'chatbot_stop_mic') : t(lang, 'chatbot_start_mic')}
              >
                {listening ? <MicOff size={16} /> : <Mic size={16} />}
                {listening && <span className="micPulseRing" aria-hidden="true" />}
              </button>
            )}
            <button
              id="send-btn"
              type="button"
              className="chatWidgetSend btn btnPrimary"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              aria-label={t(lang, 'chatbot_send')}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
