import { Link, createFileRoute } from '@tanstack/react-router'

import { NextSectionPager } from '../components/NextSectionPager/NextSectionPager'
import { getAllSessions, listPresenters } from '../data/schedule/sessions'
import { schedule } from '../data/schedule/loadSchedule'
import styles from './presenters.module.css'

export const Route = createFileRoute('/presenters')({ component: PresentersPage })

function PresentersPage() {
  const presenters = listPresenters(getAllSessions(schedule))

  const groups: Array<{ letter: string; presenters: typeof presenters }> = []
  for (const presenter of presenters) {
    const letter = presenter.name[0]?.toUpperCase() ?? '#'
    const group = groups.at(-1)
    if (group && group.letter === letter) {
      group.presenters.push(presenter)
    } else {
      groups.push({ letter, presenters: [presenter] })
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Presenters</h1>
      <p className={styles.lede}>
        Everyone speaking or leading a session, with links to what they&apos;re presenting.
      </p>

      {groups.map((group) => (
        <section key={group.letter} className={styles.group} aria-labelledby={`letter-${group.letter}`}>
          <h2 id={`letter-${group.letter}`} className={styles.letter}>
            {group.letter}
          </h2>
          <div className={styles.people}>
            {group.presenters.map((presenter) => (
              <div key={presenter.name} className={styles.person}>
                <h3 className={styles.personName}>{presenter.name}</h3>
                <ul className={styles.sessionList}>
                  {presenter.sessions.map((session) => (
                    <li key={session.id}>
                      <Link
                        to="."
                        search={(prev: Record<string, unknown>) => ({ ...prev, session: session.id })}
                        resetScroll={false}
                      >
                        {session.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}

      <NextSectionPager label="Materials" to="/materials" />
    </div>
  )
}
