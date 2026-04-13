import { useState, useRef, useCallback } from 'react'
import html2canvas from 'html2canvas'
import './App.css'

const PRESET_COLORS = [
  '#1a1a2e', '#16213e', '#0f3460',
  '#e94560', '#ff6b6b', '#ffd93d',
  '#6bcb77', '#4d96ff', '#ffffff',
  '#2d2d2d', '#845ec2', '#ff9671',
]

export default function App() {
  const [headline, setHeadline] = useState('Your Headline Here')
  const [body, setBody] = useState('Add your message here. Keep it short and impactful for better engagement.')
  const [bgColor, setBgColor] = useState('#1a1a2e')
  const [photo, setPhoto] = useState(null)
  const [downloading, setDownloading] = useState(false)

  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  const handlePhotoUpload = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }, [])

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current || downloading) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 540,
        height: 540,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = 'social-post.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(false)
    }
  }, [downloading])

  const textColor = isLightColor(bgColor) ? '#1a1a1a' : '#ffffff'

  return (
    <div className="app">
      <header className="header">
        <h1>Post Builder</h1>
        <p>1080 × 1080 social template</p>
      </header>

      <main className="workspace">
        {/* Preview */}
        <div className="preview-area">
          <div className="preview-wrapper">
            <div
              ref={canvasRef}
              className="post-canvas"
              style={{ backgroundColor: bgColor }}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {photo && (
                <div className="photo-layer">
                  <img src={photo} alt="uploaded" className="photo-img" />
                </div>
              )}
              <div className="post-content" style={{ color: textColor }}>
                <p className="post-headline">{headline || 'Your Headline Here'}</p>
                <p className="post-body">{body}</p>
              </div>
            </div>
          </div>
          <p className="preview-hint">Preview scaled to 540×540 — export is full 1080×1080</p>
        </div>

        {/* Controls */}
        <aside className="controls">
          <section className="control-section">
            <label className="control-label">Headline</label>
            <input
              className="control-input"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Enter headline..."
              maxLength={80}
            />
          </section>

          <section className="control-section">
            <label className="control-label">Body Text</label>
            <textarea
              className="control-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter body text..."
              maxLength={300}
              rows={4}
            />
          </section>

          <section className="control-section">
            <label className="control-label">Background Color</label>
            <div className="color-picker-row">
              <input
                type="color"
                className="color-swatch-input"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                title="Custom color"
              />
              <span className="color-value">{bgColor}</span>
            </div>
            <div className="color-presets">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  className={`color-preset${bgColor === c ? ' active' : ''}`}
                  style={{ backgroundColor: c, border: c === '#ffffff' ? '1px solid #ddd' : 'none' }}
                  onClick={() => setBgColor(c)}
                  title={c}
                />
              ))}
            </div>
          </section>

          <section className="control-section">
            <label className="control-label">Photo</label>
            <div
              className="upload-zone"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {photo ? (
                <div className="upload-preview">
                  <img src={photo} alt="preview" />
                  <button
                    className="remove-photo"
                    onClick={(e) => { e.stopPropagation(); setPhoto(null) }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">↑</span>
                  <span>Click or drag to upload</span>
                  <span className="upload-hint">PNG, JPG, WEBP</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
          </section>

          <button
            className="download-btn"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Exporting…' : 'Download PNG'}
          </button>
        </aside>
      </main>
    </div>
  )
}

function isLightColor(hex) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}
