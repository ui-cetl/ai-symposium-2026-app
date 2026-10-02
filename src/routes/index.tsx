import type { CSSProperties } from 'react'

import { Link, createFileRoute } from '@tanstack/react-router'

import { MySchedule } from '../components/MySchedule/MySchedule'
import { NextSectionPager } from '../components/NextSectionPager/NextSectionPager'
import { SessionCard } from '../components/Schedule/SessionCard'
import { heroImage } from '../data/homePhotos'
import { getAllSessions, listMaterials, listPresenters } from '../data/schedule/sessions'
import { schedule } from '../data/schedule/loadSchedule'
import { useMySchedule } from '../hooks/useMySchedule'
import styles from './index.module.css'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { selectedSessions, isSelected, toggle } = useMySchedule(schedule)

  const allSessions = getAllSessions(schedule)
  const earliestStart = allSessions.reduce(
    (min, session) => (session.start < min ? session.start : min),
    allSessions[0]?.start ?? '',
  )
  const upNext = allSessions.filter((session) => session.start === earliestStart)

  const presenterCount = listPresenters(allSessions).length
  const materials = listMaterials(allSessions)
  const fileCount = materials.reduce((total, entry) => total + entry.links.length, 0)

  return (
    <>
      <section
        className={styles.heroWallpaper}
        style={heroImage ? ({ '--hero-img': `url("${heroImage}")` } as CSSProperties) : undefined}
      >
        <div className={styles.heroInner}>
          <h1 className={styles.title}>
            Navigating AI Together: Opportunities, Challenges, and Responsibilities
          </h1>
          <p className={styles.lede}>
            A one-day, hybrid symposium for on-site and remote attendees &mdash; talks,
            abstracts, resources, and handouts, all in one place. Build your day below by
            picking the sessions you want to attend, or browse the full schedule to see
            everything on offer.
          </p>
          <dl className={styles.heroFacts}>
            <div>
              <dt>Date</dt>
              <dd>Thursday, October 29, 2026</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>9:00 AM &ndash; 4:30 PM</dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>Bruce Pitman Center, International Ballroom</dd>
            </div>
          </dl>
          <Link to="/schedule" className={styles.cta}>
            View full schedule
          </Link>
        </div>
      </section>

      <div className={styles.page}>
        {upNext.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Up next</h2>
            <p className={styles.upNextNote}>{upNext[0].timeRange}</p>
            <ol className={styles.upNextList}>
              {upNext.map((session) => (
                <SessionCard
                  key={session.id}
                  id={session.id}
                  timeRange={session.timeRange}
                  location={session.location}
                  title={session.title}
                  speakers={session.speakers}
                  track={session.track}
                  abstract={session.abstract}
                  joinInfo={session.joinInfo}
                  isSelected={isSelected(session.id)}
                  onToggleSelect={() => toggle(session.id)}
                  elevated
                />
              ))}
            </ol>
            <Link to="/schedule" className={styles.seeAll}>
              See the full schedule
              <svg className={styles.seeAllArrow} viewBox="0 0 16 10" aria-hidden="true" focusable="false">
                <path
                  d="M0 5h14M9 1l5 4-5 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </section>
        )}

        <MySchedule schedule={schedule} sessions={selectedSessions} />

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>In this program</h2>
          <ul className={styles.contents}>
            <li>
              <Link to="/schedule" className={styles.contentsLink}>
                <span className={styles.contentsTitleRow}>
                  <span className={styles.contentsTitle}>Schedule</span>
                  <svg className={styles.contentsArrow} viewBox="0 0 16 10" aria-hidden="true" focusable="false">
                    <path
                      d="M0 5h14M9 1l5 4-5 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className={styles.contentsDesc}>
                  Every session by time and room. Search, filter, or build your own program.
                </span>
                <span className={styles.contentsMeta}>{allSessions.length} sessions</span>
              </Link>
            </li>
            <li>
              <Link to="/presenters" className={styles.contentsLink}>
                <span className={styles.contentsTitleRow}>
                  <span className={styles.contentsTitle}>Presenters</span>
                  <svg className={styles.contentsArrow} viewBox="0 0 16 10" aria-hidden="true" focusable="false">
                    <path
                      d="M0 5h14M9 1l5 4-5 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className={styles.contentsDesc}>Who&apos;s speaking, with links to their sessions.</span>
                <span className={styles.contentsMeta}>{presenterCount} presenters</span>
              </Link>
            </li>
            <li>
              <Link to="/materials" className={styles.contentsLink}>
                <span className={styles.contentsTitleRow}>
                  <span className={styles.contentsTitle}>Materials</span>
                  <svg className={styles.contentsArrow} viewBox="0 0 16 10" aria-hidden="true" focusable="false">
                    <path
                      d="M0 5h14M9 1l5 4-5 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className={styles.contentsDesc}>Slides, handouts, and readings from each session.</span>
                <span className={styles.contentsMeta}>
                  {fileCount} {fileCount === 1 ? 'file' : 'files'} so far
                </span>
              </Link>
            </li>
          </ul>
        </section>

        <div className={styles.notices}>
          <p>On-site at the Bruce Pitman Center, or join remotely &mdash; no login required.</p>
          <p>Sessions are not recorded. Zoom links are emailed to registered attendees only.</p>
        </div>

        <NextSectionPager label="Schedule" to="/schedule" />
      </div>
    </>
  )
}
