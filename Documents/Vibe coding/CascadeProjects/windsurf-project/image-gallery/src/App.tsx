import { useEffect, useMemo, useState } from 'react'
import './App.css'

function App() {
  type CatalogItem = { title: string; color: string; size: string }
  const [items, setItems] = useState<CatalogItem[]>([])
  const [tagFilter, setTagFilter] = useState<string>('All')
  const [sizeFilter, setSizeFilter] = useState<string>('All')

  useEffect(() => {
    fetch('/images/catalog.json')
      .then((res) => res.json())
      .then((data: CatalogItem[]) => setItems(data))
      .catch(() => setItems([]))
  }, [])

  const colors = useMemo(() => {
    const set = new Set(items.map((i) => i.color))
    return ['All', ...Array.from(set)]
  }, [items])

  const sizes = useMemo(() => {
    const set = new Set(items.map((i) => i.size))
    return ['All', ...Array.from(set)]
  }, [items])

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const tagOk = tagFilter === 'All' || i.color === tagFilter
      const sizeOk = sizeFilter === 'All' || i.size === sizeFilter
      return tagOk && sizeOk
    })
  }, [items, tagFilter, sizeFilter])

  return (
    <div className="app">
      <h1>Image Gallery</h1>

      <div className="filters">
        <label>
          Tag
          <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
            {colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Size
          <select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)}>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid">
        {filtered.map((item) => {
          const src = `/images/${item.title}`
          const alt = `${item.title} - ${item.color}, ${item.size}`
          return (
            <div key={src} className="gallery-card">
              <img src={src} alt={alt} />
              <div className="meta">
                <div className="title">{item.title}</div>
                <div className="tags">
                  <span className="tag">{item.color}</span>
                  <span className="tag">{item.size}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
