import { useState, useRef, useCallback } from 'react'
import html2canvas from 'html2canvas'
import './App.css'

const PAYSEND_LOGO = "https://www.figma.com/api/mcp/asset/1f6bb5a5-6415-4795-b56b-8a7068910934"
const PA360_LOGO   = "https://www.figma.com/api/mcp/asset/339d6e4e-d220-4e90-a96a-d17bc820c2ef"
const CALENDAR_ICON = "https://www.figma.com/api/mcp/asset/3eb32829-0f5c-4a72-9929-15f08bca2f6d"
const PIN_ICON     = "https://www.figma.com/api/mcp/asset/d57df5ea-1a96-48c6-896d-f8d458555fdf"
const DIVIDER      = "https://www.figma.com/api/mcp/asset/241e08a9-08aa-4208-ae69-a314d03ec4dd"
const DEFAULT_PHOTO = "https://www.figma.com/api/mcp/asset/100f910c-97ac-4dca-bb4a-edee278a8ffc"

export default function App() {
  const [headline, setHeadline]       = useState('Level up your payments game with Paysend\nat ICE Barcelona!')
  const [subheadline, setSubheadline] = useState('Discover how Paysend can power your business!')
  const [date, setDate]               = useState('January 19–21, 2026')
  const [location, setLocation]       = useState('Barcelona, Spain')
  const [personTitle, setPersonTitle] = useState('Head of Commercial EMEA')
  const [personName, setPersonName]   = useState('Danny May')
  const [photo, setPhoto]             = useState(null)
  const [downloading, setDownloading] = useState(false)

  const canvasRef   = useRef(null)
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
      const el = canvasRef.current
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: el.offsetWidth,
        height: el.offsetHeight,
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

  return (
    <div className="app">
      <header className="header">
        <h1>Post Builder</h1>
        <p>1080 × 1350 LinkedIn template</p>
      </header>

      <main className="workspace">

        {/* ── Canvas preview ── */}
        <div className="preview-area">
          <div className="preview-wrapper">
            <div
              ref={canvasRef}
              className="post-canvas"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {/* Top bar: logos + badges */}
              <div className="post-header">
                <div className="post-logos">
                  <img src={PAYSEND_LOGO} alt="Paysend" className="logo-paysend" crossOrigin="anonymous" />
                  <img src={DIVIDER}      alt=""        className="logo-divider"  crossOrigin="anonymous" />
                  <img src={PA360_LOGO}   alt="Pay360"  className="logo-pa360"   crossOrigin="anonymous" />
                </div>
                <div className="post-badges">
                  <div className="badge">
                    <img src={CALENDAR_ICON} alt="" className="badge-icon" crossOrigin="anonymous" />
                    <span>{date}</span>
                  </div>
                  <div className="badge">
                    <img src={PIN_ICON} alt="" className="badge-icon" crossOrigin="anonymous" />
                    <span>{location}</span>
                  </div>
                </div>
              </div>

              {/* Text area */}
              <div className="post-text-area">
                <p className="post-subheadline">{subheadline}</p>
                <p className="post-headline">{headline}</p>
              </div>

              {/* Photo card */}
              <div className="post-card">
                <div className="post-photo-bg">
                  <img
                    src={photo || DEFAULT_PHOTO}
                    alt="Speaker"
                    className="post-photo"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="post-nameplate">
                  <p className="post-person-title">{personTitle}</p>
                  <p className="post-person-name">{personName}</p>
                </div>
              </div>
            </div>
          </div>
          <p className="preview-hint">Preview at 540×675 — exports 1080×1350</p>
        </div>

        {/* ── Controls ── */}
        <aside className="controls">
          <section className="control-section">
            <label className="control-label">Headline</label>
            <textarea
              className="control-textarea"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              rows={3}
            />
          </section>

          <section className="control-section">
            <label className="control-label">Subheadline</label>
            <input className="control-input" type="text" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} />
          </section>

          <section className="control-section">
            <label className="control-label">Date</label>
            <input className="control-input" type="text" value={date} onChange={(e) => setDate(e.target.value)} />
          </section>

          <section className="control-section">
            <label className="control-label">Location</label>
            <input className="control-input" type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
          </section>

          <section className="control-section">
            <label className="control-label">Person Title</label>
            <input className="control-input" type="text" value={personTitle} onChange={(e) => setPersonTitle(e.target.value)} />
          </section>

          <section className="control-section">
            <label className="control-label">Person Name</label>
            <input className="control-input" type="text" value={personName} onChange={(e) => setPersonName(e.target.value)} />
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
                  <button className="remove-photo" onClick={(e) => { e.stopPropagation(); setPhoto(null) }}>
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
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
          </section>

          <button className="download-btn" onClick={handleDownload} disabled={downloading}>
            {downloading ? 'Exporting…' : 'Download PNG'}
          </button>
        </aside>
      </main>
    </div>
  )
}
