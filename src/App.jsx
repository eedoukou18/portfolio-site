import { useState, useEffect } from 'react'

const projects = [
    { category: 'creative', tag: 'Brand Design', title: 'Album Merch Design',
    desc: 'I designed a merch collection for a Ghanaian music artist, my bro(BaggyTheScribe), including t-shirts and singlet.',
    meta: '2026 · Photoshop, Illustrator, Pinterest, My Creative mind',
        files: [
      { src: '/work/concept 3.jpeg', name: 'INTRO GRAPHIC', date: '24/10/2026 9:36 am', type: 'JPG File' },
      { src: '/work/concept.jpeg', name: 'CONCEPT 2.jpg', date: '08/11/2026 3:34 am', type: 'JPEG File' },
      { src: '/work/merch1.jpeg', name: 'merch 2', date: '08/11/2026 4:17 am', type: 'JPG File' },
    ] },
  { category: 'creative', tag: 'Brand Identity', title: 'Nocturne Coffee — full rebrand',
    desc: 'Logo system, pacfkaging, and a print-first brand book for a small-batch roaster.',
    meta: '2025 · Illustrator, Figma' },
  { category: 'creative', tag: 'UI / Product', title: 'Fieldnote — journaling app',
    desc: 'Design system and iOS UI for a 40k-user journaling app, from wireframe to shipped build.',
    meta: '2024 · Figma, SwiftUI' },
  { category: 'creative', tag: 'Editorial', title: 'Undercurrent — zine, issue 04',
    desc: 'Layout, typesetting, and cover illustration for an independent quarterly zine.',
    meta: '2024 · InDesign, Procreate' },
  { category: 'engineering', tag: 'Product Design', title: 'Modular drone gimbal mount',
    desc: '3-axis mount designed for tolerance stack-up and vibration damping, CNC-verified.',
    meta: '2025 · SolidWorks, FEA, 6061-T6' },
  { category: 'engineering', tag: 'DFM', title: 'Injection-molded enclosure',
    desc: 'Redesigned a machined housing for injection molding, cutting unit cost by 61%.',
    meta: '2024 · Fusion 360, DFM review' },
  { category: 'engineering', tag: 'Automation', title: 'Pick-and-place test fixture',
    desc: 'Pneumatic fixture for end-of-line testing, cut cycle time from 40s to 12s per unit.',
    meta: '2023 · SolidWorks, pneumatics' },
]

const skills = {
  creative: ['Figma', 'Illustrator', 'Photoshop', 'Motion Design','Art Covers', 'Brand Systems', 'Typography', 'UI Design'],
  engineering: ['Autodesk Inventor','Autodesk CFD', 'AutoCAD', 'SolidWorks', 'Fusion 360', 'GD&T', 'MATLAB', 'FEA', 'DFM', 'CNC', '3D Printing'],
}

const categories = [
  { id: 'creative', label: 'Creative Design' },
  { id: 'engineering', label: 'Mechanical Engineering design' },
]

const rates = {
  creative: [
    { name: 'Logo design', ghs: 500, usd: 60, unit: 'per design' },
    { name: 'Packaging design', ghs: 500, usd: 40, unit: 'per design package'},
    { name:'Merch design', ghs: 1000, usd: 100, unit: 'per design'},
    { name: 'Poster / flyer', ghs: 600, usd: 50, unit: 'per design' },
    { name: 'UI/UX design project', ghs: 2500, usd: 130, unit: 'per project' },
    { name: 'Brand identity pack', ghs: 1800, usd: 300, unit: 'per project' },
  ],
  engineering: [
    { name: 'Engineering Design project', ghs: 8000, usd: 70, unit: 'per design project' },
    { name: 'Technical drawings (GD&T)', ghs: 600, usd: 50, unit: 'per drawing' },
    { name: 'DFM review', ghs: 1800, usd: 150, unit: 'per review' },
    { name: 'FEA simulation', ghs: 2500, usd: 220, unit: 'per study' },
    { name: 'Consulting', ghs: 400, usd: 35, unit: 'per hour' },
  ],
}



const pages = ['home', 'work', 'rates', 'about', 'contact']

export default function App() {
  const [page, setPage] = useState('home')          // which top tab is open
  const [category, setCategory] = useState('creative') // which Work sub-tab is open
  const [currency, setCurrency] = useState('GHS')
  const [showPolicy, setShowPolicy] = useState(false)
    const [openProject, setOpenProject] = useState(null) // which project window is open
  const [maxed, setMaxed] = useState(false)            // is the window full-screen?

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpenProject(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
    const [usdRate, setUsdRate] = useState(null)   // how many dollars 1 cedi is worth
  const [rateError, setRateError] = useState(false)

  useEffect(() => {
    async function loadRate() {
      try {
        // reuse a saved rate if it is less than 6 hours old
        const saved = JSON.parse(localStorage.getItem('ghsUsd') || 'null')
        if (saved && Date.now() - saved.time < 6 * 60 * 60 * 1000) {
          setUsdRate(saved.rate)
          return
        }
        const res = await fetch('https://open.er-api.com/v6/latest/GHS')
        const data = await res.json()
        if (data.result !== 'success') throw new Error('bad response')
        const rate = data.rates.USD
        setUsdRate(rate)
        localStorage.setItem('ghsUsd', JSON.stringify({ rate, time: Date.now() }))
      } catch {
        setRateError(true)
      }
    }
    loadRate()
  }, [])

  function priceFor(ghs) {
    if (currency === 'GHS') return `₵ ${ghs.toLocaleString()}`
    if (usdRate === null) return rateError ? `₵ ${ghs.toLocaleString()}` : '…'
    return `$ ${Math.round(ghs * usdRate).toLocaleString()}`
  }

  const visibleProjects = projects.filter((p) => p.category === category)

  return (
    <div className= {page ==='home' ? 'is-home' : ''}>
      <header>
        <nav className="nav">
          {pages.map((p) => (
            <button
              key={p == 'rates' ? 'rate card' :p}
              className={page === p ? 'active' : ''}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
                  <StatusIcons />
        </nav>
      </header>

      <main className="wrap">
        {page === 'home' && (
          <div className="home">
            <h1>Emmanuel Edoukou</h1>
            <p>Creative design &amp; mechanical engineering design</p>
          </div>
        )}
    
                {page === 'work' && (
          <div>
            <div className="subtabs">
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={category === c.id ? 'active' : ''}
                  onClick={() => setCategory(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="caption">Selected works</div>

                        <div className="desk-grid">
              {visibleProjects.map((p) => (
                <div className="desk-icon" key={p.title} onClick={() => {setOpenProject(p); setMaxed(false)}}>
                  <PixelFolder size={88} />
                  <div className="desk-tag">{p.tag}</div>
                  <div className="desk-title">{p.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
                {page === 'rates' && (
          <div className="rates">
            <h2 className="rates-title">how much do i charge for my services?</h2>

            <div className="subtabs">
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={category === c.id ? 'active' : ''}
                  onClick={() => setCategory(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="rate-controls">
              <label>
                Currency:{' '}
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="GHS">GHS ₵</option>
                  <option value="USD">USD $</option>
                </select>
              </label>
              <p>
                Read my{' '}
                <button className="linklike" onClick={() => setShowPolicy(!showPolicy)}>policy</button>{' '}
                here
              </p>
              {showPolicy && (
                <div className="policy">
                  50% deposit to start. Two rounds of revisions included. Final files are delivered after full payment.
                </div>
              )}
            </div>

            <div className="rate-list">
              {rates[category].map((r) => (
                <div className="rate-row" key={r.name}>
                  <span className="rate-name">{r.name}</span>
                  <div className="rate-price">
                    <strong>{priceFor(r.ghs)}</strong>
                    <small>{r.unit}</small>
                  </div>
                </div>
              ))}
            </div>

            <p className="rate-note">
              {currency === 'USD' && usdRate && (
                <>Prices are set in cedis. 1 GHS ≈ {usdRate.toFixed(4)} USD at the current market rate. </>
              )}
              {currency === 'USD' && rateError && (
                <>Live rate unavailable right now, so cedi prices are shown. </>
              )}
              <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer">
                Rates By Exchange Rate API
              </a>
            </p>
          </div>
        )}
        {page === 'about' && (
          <div className="text-page">
            <h2>About</h2>
            <p>My name is Emmanuel, popularly known as Lipton, a Ghanaian designer and entrepreneur.
              I split my time between two disciplines that turn out to share the same instinct: DESIGN.</p> 
              <p>On the creative design side that has visual identity, aesthetic, ease of use and functionality; 
              on the engineering side, it means a designing a part/assembly that solves clients' problem through design.</p>
              <p>I look up to <b>Virgil Abloh <i>(your legacy lives on)</i></b> he made me believe it is possible to combine two different disciplinary into one(engineering design & creative design).</p>
              
            <p>And now I am a <b>multidsicplinary designer</b> based in Accra, working with clients and teams worldwide. Open to freelance and contract work in either discipline, or projects that need both.</p>
            {categories.map((c) => (
              <div key={c.id}>
                <h3>{c.label}</h3>
                <div className="skills">
                  {skills[c.id].map((s) => <span key={s}>{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {page === 'contact' && (
          <div className="text-page">
            <h2>Contact</h2>
            <p>Let's talk — <a href="mailto:assuahackah083@gmail.com">assuahackah083@gmail.com</a></p>
          </div>
        )}

                    {page === 'work' && openProject && (
        <div className="xp-backdrop" onClick={() => setOpenProject(null)}>
          <div className={maxed ? 'xp-window max' : 'xp-window'} onClick={(e) => e.stopPropagation()}>
            <div className="xp-titlebar">
              <span className="xp-star">☆</span>
              <span className="xp-title">{openProject.title}</span>
              <div className="xp-buttons">
                <button className="xp-btn" aria-label="Minimize" onClick={() => setOpenProject(null)}>
                  <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="7" width="6" height="2" fill="#fff" /></svg>
                </button>
                <button className="xp-btn" aria-label="Maximize" onClick={() => setMaxed(!maxed)}>
                  <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" fill="none" stroke="#fff" strokeWidth="1.2" /><rect x="1" y="1" width="8" height="2.5" fill="#fff" /></svg>
                </button>
                <button className="xp-btn xp-close" aria-label="Close" onClick={() => setOpenProject(null)}>
                  <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 2L8 8M8 2L2 8" stroke="#fff" strokeWidth="1.8" /></svg>
                </button>
              </div>
            </div>
            <div className="xp-body">
              <div className="xp-tag">{openProject.tag}</div>
              <h2>{openProject.title}</h2>
              <XPFiles key={openProject.title} project={openProject} />
              <p>{openProject.desc}</p>
              <div className="xp-meta">{openProject.meta}</div>
            </div>
          </div>
        </div>
      )}
      </main>
     </div>
  )

  function StatusIcons() {
  return (
    <div className="status" aria-hidden="true">
      {/* signal bars */}
      <svg width="20" height="15" viewBox="0 0 16 12" shapeRendering="crispEdges" fill="currentColor">
        <rect x="0" y="9" width="3" height="3" />
        <rect x="4" y="6" width="3" height="6" />
        <rect x="8" y="3" width="3" height="9" />
        <rect x="12" y="0" width="3" height="12" />
      </svg>
      {/* battery */}
      <svg width="30" height="15" viewBox="0 0 24 12" shapeRendering="crispEdges" fill="currentColor">
        <rect x="1" y="1" width="18" height="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="20" y="3" width="3" height="6" />
        <rect x="3" y="3" width="4" height="6" />
        <rect x="8" y="3" width="4" height="6" />
        <rect x="13" y="3" width="4" height="6" />
      </svg>
    </div>
  )
}
}

function XPGallery({ images, title }) {
  const [i, setI] = useState(0)
  const [zoom, setZoom] = useState(false)
  const n = images.length

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setI((v) => (v - 1 + n) % n)
      if (e.key === 'ArrowRight') setI((v) => (v + 1) % n)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [n])

  return (
    <div className="xp-film">
      <div className="xp-stage">
        {n > 1 && (
          <button className="xp-arrow left" aria-label="Previous" onClick={() => setI((i - 1 + n) % n)}>‹</button>
        )}
        <img src={images[i]} alt={`${title} ${i + 1}`} onClick={() => setZoom(true)} />
        {n > 1 && (
          <button className="xp-arrow right" aria-label="Next" onClick={() => setI((i + 1) % n)}>›</button>
        )}
      </div>
      <div className="xp-status">{i + 1} of {n} · click the picture to enlarge</div>

      {n > 1 && (
        <div className="xp-thumbs">
          {images.map((src, k) => (
            <button key={src} className={k === i ? 'active' : ''} onClick={() => setI(k)}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {zoom && (
        <div className="xp-zoom" onClick={() => setZoom(false)}>
          <img src={images[i]} alt={title} />
          <span>Click anywhere to close</span>
        </div>
      )}
    </div>
  )
}

// Each letter = one pixel. K=black L=light yellow Y=yellow
// O=orange B=brown W=white G=gray  .=empty
const FOLDER_ART = [
  '.KKKKKKKKKKKK..........',
  'KLLLLLLLBBBBKK.........',
  'KOYYYYYYYYLLLKK........',
  'KOYYYYYYYYYYYLKK.......',
  'KOYYYYYYYYYYYYLKK......',
  'KOYYYYYYYYYYYYYLKKKKKK.',
  'KOYYYYYYYYYYYYYYLKWKGBK',
  'KOYYYYYYYYYYYYYYYKWKGBK',
  'KOYYYYYYYYYYYYYYYKWKGBK',
  'KOYYYYYYYYYYYYYYYKWKGBK',
  'KOYYYYYYYYYYYYYYYKWKGBK',
  'KOYYYYYYYYYYYYYYYKWKGBK',
  'KOYYYYYYYYYYYYYYYKWKGBK',
  'KOOOOOOOOOOOOOOOOKWKGBK',
  '.KKKKKKKKKKKKKKKKKKKKK.',
]

const FOLDER_COLORS = {
  K: '#000000', L: '#fde58a', Y: '#f7c33a', O: '#e08a2c',
  B: '#b0612a', W: '#ffffff', G: '#cfcfc6',
}

function PixelFolder({ size = 72 }) {
  return (
    <svg width={size} height={(size * 15) / 23} viewBox="0 0 23 15" shapeRendering="crispEdges" aria-hidden="true">
      {FOLDER_ART.map((row, y) =>
        row.split('').map((c, x) =>
          FOLDER_COLORS[c] ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={FOLDER_COLORS[c]} /> : null
        )
      )}
    </svg>
  )
}


function fileTypeOf(f) {
  if (f.type) return f.type
  const ext = (f.src.split('.').pop() || '').toLowerCase()
  if (ext === 'jpg') return 'JPG File'
  if (ext === 'jpeg') return 'JPEG File'
  return ext.toUpperCase() + ' File'
}

function FileIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true">
      <path d="M2 1h11l5 5v15H2z" fill="#fff" stroke="#5a6b9a" />
      <path d="M13 1v5h5" fill="#dfe6f8" stroke="#5a6b9a" />
      <rect x="4.5" y="9" width="11" height="9" fill="#3b7bf5" />
      <path d="M4.5 18l3.5-4 2.5 2.5 2-2 3 3.5z" fill="#fff" />
    </svg>
  )
}

function XPFiles({ project }) {
  const [viewing, setViewing] = useState(null)
  const files = project.files
    || (project.images || []).map((src) => ({ src, name: src.split('/').pop() }))

  if (files.length === 0) {
    return <div className="xp-image">This folder is empty.</div>
  }

  return (
    <div className="xp-files">
      <div className="xp-list-head">
        <span />
        <span>Name</span>
        <span>Date modified</span>
        <span>Type</span>
      </div>

      {files.map((f) => (
        <button key={f.src} className="xp-row" onClick={() => setViewing(f)}>
          <FileIcon />
          <span className="xp-name">{f.name}</span>
          <span className="xp-date">{f.date || '—'}</span>
          <span className="xp-type">{fileTypeOf(f)}</span>
        </button>
      ))}

      <div className="xp-statusbar">{files.length} object{files.length === 1 ? '' : 's'}</div>

      {viewing && (
        <div className="xp-zoom" onClick={() => setViewing(null)}>
          <img src={viewing.src} alt={viewing.name} />
          <span>{viewing.name} · click anywhere to close</span>
        </div>
      )}
    </div>
  )
}