import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getAlgo, getCategory, loadComponent, COURSE_LABELS, courseNeighbors } from '../registry.js'
import { useLang } from '../i18n.jsx'
import { CONTENT } from '../content.js'
import ReadPage from '../components/ReadPage.jsx'

export default function AlgoPage() {
  const { slug } = useParams()
  const { t, tk } = useLang()
  const algo = getAlgo(slug)

  if (!algo) {
    return <div className="empty">Topic "{slug}" not found.</div>
  }

  const cat = getCategory(algo.category)
  const Component = loadComponent(slug)
  const content = CONTENT[slug]
  const tldr = content?.tldr
  const { prev, next, index, total } = courseNeighbors(slug)

  return (
    <div>
      <div className="page-head">
        <div className="crumb">
          <span className="chip" style={{ background: cat.color + '22', color: cat.color }}>
            {cat.name}
          </span>
          <span>&middot;</span>
          <span>{t(COURSE_LABELS[algo.course]) || algo.course}</span>
        </div>
        <h1 className="page-title">{algo.star ? '★ ' : ''}{algo.name}</h1>
        {algo.tagline && <p className="page-desc">{t(algo.tagline)}</p>}
      </div>

      {tldr && (
        <div className="tldr">
          <span className="tldr-label">TL;DR</span>
          <span className="tldr-text" dangerouslySetInnerHTML={{ __html: t(tldr) }} />
        </div>
      )}

      {Component ? (
        <Component content={content} slug={slug} />
      ) : content ? (
        <ReadPage {...content} />
      ) : (
        <div className="panel">
          <p className="muted">{tk('notImplemented')}</p>
        </div>
      )}

      {prev && next && (
        <div className="chapter-nav">
          <Link to={`/algo/${prev.slug}`} className="chapter-nav-btn prev">
            <span className="chapter-nav-arrow">←</span>
            <span className="chapter-nav-text">
              <span className="chapter-nav-label">{tk('prevChapter')}</span>
              <span className="chapter-nav-name">{prev.name}</span>
            </span>
          </Link>
          <span className="chapter-nav-count">{index + 1} / {total}</span>
          <Link to={`/algo/${next.slug}`} className="chapter-nav-btn next">
            <span className="chapter-nav-text">
              <span className="chapter-nav-label">{tk('nextChapter')}</span>
              <span className="chapter-nav-name">{next.name}</span>
            </span>
            <span className="chapter-nav-arrow">→</span>
          </Link>
        </div>
      )}
    </div>
  )
}
