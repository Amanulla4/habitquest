import { useState } from 'react'
import './Dashboard.css'

import {
  addXp,
  getXpRequired,
} from '../../utils/xp'

import {
  updateStreak,
  getStreakBonus,
} from '../../utils/streak'

const initialQuests = [
  {
    id: 1,
    icon: '💻',
    title: 'Master React',
    subtitle: 'Code for 60 minutes',
    xp: 50,
    gold: 25,
    completed: true,
  },
  {
    id: 2,
    icon: '🏃',
    title: 'Train Your Body',
    subtitle: 'Exercise for 30 minutes',
    xp: 40,
    gold: 20,
    completed: false,
  },
  {
    id: 3,
    icon: '📚',
    title: 'Knowledge Seeker',
    subtitle: 'Read 20 pages',
    xp: 25,
    gold: 15,
    completed: false,
  },
  {
    id: 4,
    icon: '💧',
    title: 'Stay Hydrated',
    subtitle: 'Drink 2L of water',
    xp: 10,
    gold: 10,
    completed: false,
  },
]

const earnedFromCompleted = (quests, key) =>
  quests
    .filter((quest) => quest.completed)
    .reduce((total, quest) => total + quest[key], 0)

function Dashboard() {
  const [quests, setQuests] =
    useState(initialQuests)

  const [level, setLevel] =
    useState(1)

  const [xp, setXp] = useState(
    earnedFromCompleted(initialQuests, 'xp')
  )

  const [gold, setGold] = useState(
    earnedFromCompleted(initialQuests, 'gold')
  )

  const [currentStreak, setCurrentStreak] =
    useState(1)

  const [bestStreak, setBestStreak] =
    useState(1)

  const [lastCompletionDate, setLastCompletionDate] =
    useState(null)

  const [levelUpMessage, setLevelUpMessage] =
    useState('')

  const [streakMessage, setStreakMessage] =
    useState('')

  const completedQuests =
    quests.filter(
      (quest) => quest.completed
    ).length

  const totalQuests =
    quests.length

  const earnedToday =
    quests
      .filter(
        (quest) => quest.completed
      )
      .reduce(
        (total, quest) =>
          total + quest.xp,
        0
      )

  const progress =
    Math.round(
      (completedQuests /
        totalQuests) *
        100
    )

  const currentXpRequired =
    getXpRequired(level)

  const completeQuest = (questId) => {
    const selectedQuest =
      quests.find(
        (quest) =>
          quest.id === questId
      )

    if (
      !selectedQuest ||
      selectedQuest.completed
    ) {
      return
    }

    setQuests(
      (currentQuests) =>
        currentQuests.map(
          (quest) =>
            quest.id === questId
              ? {
                  ...quest,
                  completed: true,
                }
              : quest
        )
    )

    /*
     * STREAK
     */

    const streakResult =
      updateStreak(
        currentStreak,
        bestStreak,
        lastCompletionDate
      )

    setCurrentStreak(
      streakResult.currentStreak
    )

    setBestStreak(
      streakResult.bestStreak
    )

    setLastCompletionDate(
      streakResult.lastCompletionDate
    )

    /*
     * STREAK BONUS
     */

    const streakBonus =
      streakResult.streakIncreased
        ? getStreakBonus(
            streakResult.currentStreak
          )
        : 0

    /*
     * XP
     */

    const totalQuestXp =
      selectedQuest.xp +
      streakBonus

    const result =
      addXp(
        xp,
        level,
        totalQuestXp
      )

    setXp(result.xp)

    setLevel(result.level)

    /*
     * GOLD
     */

    setGold(
      (currentGold) =>
        currentGold +
        selectedQuest.gold
    )

    /*
     * LEVEL UP MESSAGE
     */

    if (result.leveledUp) {
      setLevelUpMessage(
        `⚔️ LEVEL UP! You are now Level ${result.level}!`
      )

      setTimeout(() => {
        setLevelUpMessage('')
      }, 3000)
    }

    /*
     * STREAK MESSAGE
     */

    if (
      streakResult.streakIncreased
    ) {
      const bonusText =
        streakBonus > 0
          ? ` +${streakBonus} bonus XP`
          : ''

      setStreakMessage(
        `🔥 ${streakResult.currentStreak} day streak!${bonusText}`
      )

      setTimeout(() => {
        setStreakMessage('')
      }, 3000)
    }
  }

  return (
    <div className="dashboard">

      {/* NOTIFICATIONS */}

      {levelUpMessage && (
        <div className="level-up-message">
          {levelUpMessage}
        </div>
      )}

      {streakMessage && (
        <div className="streak-message">
          {streakMessage}
        </div>
      )}

      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <p className="eyebrow">
            YOUR ADVENTURE
          </p>

          <h2>
            Good morning,{' '}
            <span>Aman</span> 👋
          </h2>

          <p className="header-subtitle">
            Ready to continue your journey?
          </p>

        </div>

        <div className="date-badge">

          <span>📅</span>

          <div>

            <strong>
              Monday
            </strong>

            <small>
              31 August
            </small>

          </div>

        </div>

      </div>

      {/* PLAYER CARD */}

      <section className="hero-card">

        <div className="hero-glow" />

        <div className="character">

          <div className="character-ring">

            <div className="character-avatar">
              🧙
            </div>

          </div>

          <div className="character-info">

            <span className="character-title">
              NOVICE ADVENTURER
            </span>

            <h3>
              Aman
            </h3>

            <div className="level-row">

              <span>
                LEVEL {level}
              </span>

              <span>
                {xp} / {currentXpRequired} XP
              </span>

            </div>

            <div className="xp-bar">

              <div
                className="xp-fill"
                style={{
                  width: `${
                    Math.min(
                      (xp /
                        currentXpRequired) *
                        100,
                      100
                    )
                  }%`,
                }}
              />

            </div>

          </div>

        </div>

        {/* RESOURCES */}

        <div className="resources">

          <div className="resource">

            <span className="resource-icon">
              ❤️
            </span>

            <div>

              <small>
                HP
              </small>

              <strong>
                100 / 100
              </strong>

            </div>

          </div>

          <div className="resource">

            <span className="resource-icon">
              ⚡
            </span>

            <div>

              <small>
                ENERGY
              </small>

              <strong>
                85 / 100
              </strong>

            </div>

          </div>

          <div className="resource">

            <span className="resource-icon">
              🪙
            </span>

            <div>

              <small>
                GOLD
              </small>

              <strong>
                {gold}
              </strong>

            </div>

          </div>

          <div className="resource">

            <span className="resource-icon">
              💎
            </span>

            <div>

              <small>
                GEMS
              </small>

              <strong>
                0
              </strong>

            </div>

          </div>

        </div>

      </section>

      {/* QUICK STATS */}

      <div className="quick-stats">

        <div className="quick-stat">

          <div className="quick-stat-icon">
            🔥
          </div>

          <div>

            <strong>
              {currentStreak} Day
            </strong>

            <span>
              Current Streak
            </span>

          </div>

        </div>

        <div className="quick-stat">

          <div className="quick-stat-icon">
            ⚔️
          </div>

          <div>

            <strong>
              {completedQuests} / {totalQuests}
            </strong>

            <span>
              Today's Quests
            </span>

          </div>

        </div>

        <div className="quick-stat">

          <div className="quick-stat-icon">
            🏆
          </div>

          <div>

            <strong>
              {bestStreak} Days
            </strong>

            <span>
              Best Streak
            </span>

          </div>

        </div>

      </div>

      {/* QUESTS */}

      <section className="quests-section">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              DAILY MISSIONS
            </p>

            <h3>
              Today's Quests
            </h3>

          </div>

          <span className="quest-count">
            {completedQuests}/
            {totalQuests}
          </span>

        </div>

        <div className="quest-list">

          {quests.map(
            (quest) => (

              <div
                key={quest.id}
                className={`quest-card ${
                  quest.completed
                    ? 'completed'
                    : ''
                }`}
              >

                <div className="quest-icon">
                  {quest.icon}
                </div>

                <div className="quest-info">

                  <strong>
                    {quest.title}
                  </strong>

                  <span>
                    {quest.subtitle}
                  </span>

                </div>

                <div className="quest-reward">

                  <span>
                    +{quest.xp}
                  </span>

                  <small>
                    XP
                  </small>

                </div>

                <button
                  className={`quest-check ${
                    quest.completed
                      ? 'checked'
                      : ''
                  }`}
                  onClick={() =>
                    completeQuest(
                      quest.id
                    )
                  }
                  disabled={
                    quest.completed
                  }
                  aria-label={
                    quest.completed
                      ? `${quest.title} completed`
                      : `Complete ${quest.title}`
                  }
                >
                  {quest.completed
                    ? '✓'
                    : ''}
                </button>

              </div>

            )
          )}

        </div>

      </section>

      {/* DAILY PROGRESS */}

      <section className="daily-progress-card">

        <div className="progress-icon">
          🏆
        </div>

        <div className="progress-content">

          <div className="progress-header">

            <div>

              <span>
                DAILY PROGRESS
              </span>

              <strong>
                {progress === 100
                  ? 'All quests completed! 🎉'
                  : 'Keep going, Adventurer!'}
              </strong>

            </div>

            <b>
              {progress}%
            </b>

          </div>

          <div className="daily-progress-bar">

            <div
              style={{
                width:
                  `${progress}%`,
              }}
            />

          </div>

        </div>

      </section>

    </div>
  )
}

export default Dashboard