import { useMemo } from 'react'

import './History.css'

import {
  loadGame,
} from '../utils/storage'


function getDateKey(date) {

  const year =
    date.getFullYear()

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, '0')

  const day =
    String(
      date.getDate()
    ).padStart(2, '0')

  return year + '-' + month + '-' + day
}


function formatDate(dateString) {

  const date =
    new Date(
      dateString + 'T00:00:00'
    )

  return date.toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }
  )
}


function getDateLabel(dateString) {

  const today =
    new Date()

  const todayKey =
    getDateKey(today)


  if (
    dateString === todayKey
  ) {

    return 'TODAY'

  }


  const yesterday =
    new Date(today)

  yesterday.setDate(
    today.getDate() - 1
  )


  if (
    dateString === getDateKey(
      yesterday
    )
  ) {

    return 'YESTERDAY'

  }


  return formatDate(
    dateString
  )

}


function History() {

  const game =
    loadGame()


  const history =
    Array.isArray(
      game?.history
    )
      ? game.history
      : []


  /*
  =========================================
  SUMMARY STATISTICS
  =========================================
  */

  const totalCompleted =
    history.length


  const totalXp =
    history.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.xp || 0
        ),
      0
    )


  const totalGold =
    history.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.gold || 0
        ),
      0
    )


  /*
  =========================================
  7 DAY ACTIVITY
  =========================================
  */

  const activityDays =
    useMemo(() => {

      const today =
        new Date()


      const days = []


      for (
        let index = 6;
        index >= 0;
        index--
      ) {

        const date =
          new Date(today)


        date.setDate(
          today.getDate() -
          index
        )


        const key =
          getDateKey(date)


        const completions =
          history.filter(
            (item) =>
              item.date === key
          ).length


        days.push({

          key,

          day:
            date.toLocaleDateString(
              'en-US',
              {
                weekday: 'short',
              }
            ),

          date:
            date.toLocaleDateString(
              'en-US',
              {
                day: 'numeric',
              }
            ),

          completions,

        })

      }


      return days

    }, [history])


  const activeDays =
    activityDays.filter(
      (day) =>
        day.completions > 0
    ).length


  const maxActivity =
    Math.max(
      ...activityDays.map(
        (day) =>
          day.completions
      ),
      1
    )


  /*
  =========================================
  GROUP HISTORY BY DATE
  =========================================
  */

  const groupedHistory =
    useMemo(() => {

      const groups = {}


      history.forEach(
        (item) => {

          const date =
            item.date ||
            'unknown'


          if (
            !groups[date]
          ) {

            groups[date] = []

          }


          groups[date].push(
            item
          )

        }
      )


      return Object.entries(
        groups
      ).sort(
        (
          [dateA],
          [dateB]
        ) =>
          dateB.localeCompare(
            dateA
          )
      )

    }, [history])


  /*
  =========================================
  EMPTY STATE
  =========================================
  */

  if (
    history.length === 0
  ) {

    return (

      <div className="history-page">

        <div className="history-header">

          <div>

            <p className="eyebrow">
              ADVENTURE LOG
            </p>

            <h1>
              Quest History
            </h1>

            <p className="history-subtitle">
              Your completed quests will
              appear here.
            </p>

          </div>

        </div>


        <div className="history-empty">

          <div className="history-empty-icon">
            📜
          </div>

          <h2>
            Your adventure log is empty
          </h2>

          <p>
            Complete your first quest
            and your journey will be
            recorded here.
          </p>

          <div className="empty-decoration">
            ⚔️ ⭐ 🪙
          </div>

        </div>

      </div>

    )

  }


  return (

    <div className="history-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="history-header">

        <div>

          <p className="eyebrow">
            ADVENTURE LOG
          </p>

          <h1>
            Quest History
          </h1>

          <p className="history-subtitle">
            Every quest you've conquered,
            recorded for your journey.
          </p>

        </div>


        <div className="history-scroll-icon">
          📜
        </div>

      </div>


      {/* =====================================
          SUMMARY
      ===================================== */}

      <div className="history-stats">

        <div className="history-stat">

          <div className="history-stat-icon">
            ⚔️
          </div>

          <div>

            <strong>
              {totalCompleted}
            </strong>

            <span>
              Quests Completed
            </span>

          </div>

        </div>


        <div className="history-stat">

          <div className="history-stat-icon">
            ⭐
          </div>

          <div>

            <strong>
              {totalXp}
            </strong>

            <span>
              XP Earned
            </span>

          </div>

        </div>


        <div className="history-stat">

          <div className="history-stat-icon">
            🪙
          </div>

          <div>

            <strong>
              {totalGold}
            </strong>

            <span>
              Gold Earned
            </span>

          </div>

        </div>

      </div>


      {/* =====================================
          7 DAY ACTIVITY
      ===================================== */}

      <section className="activity-card">

        <div className="activity-header">

          <div>

            <p className="eyebrow">
              RECENT ACTIVITY
            </p>

            <h2>
              Last 7 Days
            </h2>

          </div>


          <div className="activity-summary">

            <strong>
              {activeDays}/7
            </strong>

            <span>
              active days
            </span>

          </div>

        </div>


        <div className="activity-grid">

          {activityDays.map(
            (day) => {

              const height =
                day.completions === 0
                  ? 8
                  : Math.max(
                      18,
                      (
                        day.completions /
                        maxActivity
                      ) * 100
                    )


              return (

                <div
                  key={day.key}
                  className={
                    'activity-day' +
                    (day.completions > 0
                      ? ' has-activity'
                      : '')
                  }
                >

                  <div className="activity-bar-wrapper">

                    <div
                      className="activity-bar"
                      style={{
                        height: height + '%',
                      }}
                    >

                      {day.completions > 0 && (

                        <span>
                          {day.completions}
                        </span>

                      )}

                    </div>

                  </div>


                  <strong>
                    {day.day}
                  </strong>

                  <small>
                    {day.date}
                  </small>

                </div>

              )

            }
          )}

        </div>


        <div className="activity-legend">

          <span>
            Less activity
          </span>

          <div className="legend-blocks">

            <i />
            <i />
            <i />
            <i className="active" />

          </div>

          <span>
            More activity
          </span>

        </div>

      </section>


      {/* =====================================
          HISTORY TIMELINE
      ===================================== */}

      <div className="history-timeline">

        {groupedHistory.map(
          (
            [date, entries]
          ) => {

            const dayXp =
              entries.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  Number(
                    item.xp || 0
                  ),
                0
              )


            const dayGold =
              entries.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  Number(
                    item.gold || 0
                  ),
                0
              )


            return (

              <section
                key={date}
                className="history-day"
              >

                <div className="history-day-header">

                  <div>

                    <span className="history-day-label">
                      {getDateLabel(
                        date
                      )}
                    </span>

                    <strong>
                      {formatDate(
                        date
                      )}
                    </strong>

                  </div>


                  <div className="history-day-reward">

                    <span>
                      +{dayXp} XP
                    </span>

                    <small>
                      +{dayGold} 🪙
                    </small>

                  </div>

                </div>


                <div className="history-day-list">

                  {entries.map(
                    (item) => (

                      <article
                        key={
                          item.id ||
                          (item.questId + '-' + item.date)
                        }
                        className="history-item"
                      >

                        <div className="history-item-icon">
                          {item.icon || '🎯'}
                        </div>


                        <div className="history-item-content">

                          <strong>
                            {item.title ||
                              'Completed Quest'}
                          </strong>


                          <div className="history-item-meta">

                            {item.category && (
                              <span>
                                {item.category}
                              </span>
                            )}

                            {item.difficulty && (
                              <span>
                                {item.difficulty}
                              </span>
                            )}

                          </div>

                        </div>


                        <div className="history-item-reward">

                          <strong>
                            +{item.xp || 0} XP
                          </strong>

                          <span>
                            +{item.gold || 0} 🪙
                          </span>

                        </div>


                        <div className="history-item-check">
                          ✓
                        </div>

                      </article>

                    )
                  )}

                </div>

              </section>

            )

          }
        )}

      </div>


      {/* =====================================
          FOOTER
      ===================================== */}

      <div className="history-footer">

        <span>
          🗺️
        </span>

        <p>
          Keep completing quests.
          Your adventure is just beginning.
        </p>

      </div>


    </div>

  )

}


export default History