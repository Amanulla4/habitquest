import {
  useEffect,
  useState,
} from 'react'

import './Dashboard.css'

import HabitModal from '../habits/HabitModal'

import {
  addXp,
  getXpRequired,
} from '../../utils/xp'

import {
  updateStreak,
  getStreakBonus,
} from '../../utils/streak'

import {
  loadGame,
  saveGame,
  defaultGameState,
} from '../../utils/storage'


/* =========================================
   DEFAULT QUESTS
========================================= */

const initialQuests = [
  {
    id: 1,
    icon: '\u{1F4BB}',
    title: 'Master React',
    subtitle: 'Code for 60 minutes',
    category: 'Learning',
    difficulty: 'Hard',
    xp: 50,
    gold: 25,
    completed: false,
  },

  {
    id: 2,
    icon: '\u{1F3C3}',
    title: 'Train Your Body',
    subtitle: 'Exercise for 30 minutes',
    category: 'Fitness',
    difficulty: 'Medium',
    xp: 40,
    gold: 20,
    completed: false,
  },

  {
    id: 3,
    icon: '\u{1F4DA}',
    title: 'Knowledge Seeker',
    subtitle: 'Read 20 pages',
    category: 'Learning',
    difficulty: 'Medium',
    xp: 25,
    gold: 15,
    completed: false,
  },

  {
    id: 4,
    icon: '\u{1F4A7}',
    title: 'Stay Hydrated',
    subtitle: 'Drink 2L of water',
    category: 'Health',
    difficulty: 'Easy',
    xp: 10,
    gold: 10,
    completed: false,
  },
]


function Dashboard() {

  /* =========================================
     LOAD SAVED GAME
  ========================================= */

  const savedGame = loadGame()


  /* =========================================
     PLAYER STATE
  ========================================= */

  const [quests, setQuests] =
    useState(
      savedGame?.quests?.length
        ? savedGame.quests
        : initialQuests
    )

  const [level, setLevel] =
    useState(
      savedGame?.level ??
      defaultGameState.level
    )

  const [xp, setXp] =
    useState(
      savedGame?.xp ??
      defaultGameState.xp
    )

  const [gold, setGold] =
    useState(
      savedGame?.gold ??
      defaultGameState.gold
    )

  const [currentStreak, setCurrentStreak] =
    useState(
      savedGame?.currentStreak ??
      defaultGameState.currentStreak
    )

  const [bestStreak, setBestStreak] =
    useState(
      savedGame?.bestStreak ??
      defaultGameState.bestStreak
    )

  const [lastCompletionDate, setLastCompletionDate] =
    useState(
      savedGame?.lastCompletionDate ??
      defaultGameState.lastCompletionDate
    )


  /* =========================================
     UI STATE
  ========================================= */

  const [levelUpMessage, setLevelUpMessage] =
    useState('')

  const [streakMessage, setStreakMessage] =
    useState('')

  const [showHabitModal, setShowHabitModal] =
    useState(false)


  /* =========================================
     AUTO SAVE GAME
  ========================================= */

  useEffect(() => {

    saveGame({
      quests,
      level,
      xp,
      gold,
      currentStreak,
      bestStreak,
      lastCompletionDate,
    })

  }, [
    quests,
    level,
    xp,
    gold,
    currentStreak,
    bestStreak,
    lastCompletionDate,
  ])


  /* =========================================
     CALCULATIONS
  ========================================= */

  const completedQuests =
    quests.filter(
      (quest) =>
        quest.completed
    ).length

  const totalQuests =
    quests.length

  const progress =
    totalQuests > 0
      ? Math.round(
          (completedQuests /
            totalQuests) *
          100
        )
      : 0

  const currentXpRequired =
    getXpRequired(level)


  /* =========================================
     CREATE HABIT
  ========================================= */

  const createHabit = (
    newHabit
  ) => {

    setQuests(
      (currentQuests) => [
        ...currentQuests,
        newHabit,
      ]
    )

  }


  /* =========================================
     DELETE QUEST
  ========================================= */

  const deleteQuest = (
    questId
  ) => {

    const confirmed =
      window.confirm(
        'Delete this quest?'
      )

    if (!confirmed) {
      return
    }

    setQuests(
      (currentQuests) =>
        currentQuests.filter(
          (quest) =>
            quest.id !== questId
        )
    )

  }


  /* =========================================
     COMPLETE QUEST
  ========================================= */

  const completeQuest = (
    questId
  ) => {

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


    /* -------------------------------
       MARK QUEST COMPLETE
    -------------------------------- */

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


    /* -------------------------------
       UPDATE STREAK
    -------------------------------- */

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


    /* -------------------------------
       STREAK BONUS
    -------------------------------- */

    const streakBonus =
      streakResult.streakIncreased
        ? getStreakBonus(
            streakResult.currentStreak
          )
        : 0


    /* -------------------------------
       ADD XP
    -------------------------------- */

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


    /* -------------------------------
       ADD GOLD
    -------------------------------- */

    setGold(
      (currentGold) =>
        currentGold +
        selectedQuest.gold
    )


    /* -------------------------------
       LEVEL UP MESSAGE
    -------------------------------- */

    if (
      result.leveledUp
    ) {

      const levelText =
        'LEVEL UP! You are now Level ' +
        result.level +
        '!'

      setLevelUpMessage(levelText)

      setTimeout(() => {

        setLevelUpMessage('')

      }, 3000)

    }


    /* -------------------------------
       STREAK MESSAGE
    -------------------------------- */

    if (
      streakResult.streakIncreased
    ) {

      const bonusText =
        streakBonus > 0
          ? ' +' + streakBonus + ' bonus XP'
          : ''

      const streakText =
        streakResult.currentStreak +
        ' day streak!' +
        bonusText

      setStreakMessage(streakText)

      setTimeout(() => {

        setStreakMessage('')

      }, 3000)

    }

  }


  /* =========================================
     RENDER
  ========================================= */

  return (

    <div className="dashboard">


      {/* =====================================
          NOTIFICATIONS
      ===================================== */}

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


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="dashboard-header">

        <div>

          <p className="eyebrow">
            YOUR ADVENTURE
          </p>

          <h2>

            Good morning,{' '}

            <span>
              Aman
            </span>

          </h2>

          <p className="header-subtitle">

            Ready to continue your journey?

          </p>

        </div>


        <div className="date-badge">

          <span>
            📅
          </span>

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


      {/* =====================================
          PLAYER CARD
      ===================================== */}

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
                  width:
                    `${Math.min(
                      (xp /
                        currentXpRequired) *
                      100,
                      100
                    )}%`,
                }}

              />

            </div>

          </div>

        </div>


        {/* ===================================
            RESOURCES
        =================================== */}

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


      {/* =====================================
          QUICK STATS
      ===================================== */}

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


      {/* =====================================
          QUEST SECTION
      ===================================== */}

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


          <button

            className="add-habit-button"

            onClick={() =>
              setShowHabitModal(true)
            }

          >
            + Add Habit
          </button>


        </div>


        {/* ===================================
            QUEST LIST
        =================================== */}

        <div className="quest-list">


          {quests.length === 0 ? (

            /* EMPTY STATE */

            <div className="empty-quests">

              <div>
                🗺️
              </div>

              <strong>
                No quests yet
              </strong>

              <span>
                Create your first habit
                and begin your adventure.
              </span>

              <button
                onClick={() =>
                  setShowHabitModal(true)
                }
              >
                + Create First Quest
              </button>

            </div>

          ) : (

            /* QUEST CARDS */

            quests.map(
              (quest) => (

                <div

                  key={quest.id}

                  className={`quest-card ${
                    quest.completed
                      ? 'completed'
                      : ''
                  }`}

                >


                  {/* ICON */}

                  <div className="quest-icon">

                    {quest.icon}

                  </div>


                  {/* INFO */}

                  <div className="quest-info">

                    <strong>
                      {quest.title}
                    </strong>

                    <span>
                      {quest.subtitle}
                    </span>


                    <div className="quest-tags">


                      <small

                        className={`difficulty-tag ${
                          quest.difficulty
                            ?.toLowerCase()
                        }`}

                      >

                        {quest.difficulty ||
                          'Normal'}

                      </small>


                      <small>

                        {quest.category ||
                          'Habit'}

                      </small>


                    </div>

                  </div>


                  {/* REWARD */}

                  <div className="quest-reward">

                    <span>
                      +{quest.xp}
                    </span>

                    <small>
                      XP
                    </small>

                    <small>
                      +{quest.gold} 🪙
                    </small>

                  </div>


                  {/* COMPLETE */}

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


                  {/* DELETE */}

                  <button

                    className="quest-delete"

                    onClick={() =>
                      deleteQuest(
                        quest.id
                      )
                    }

                    aria-label={
                      `Delete ${quest.title}`
                    }

                  >
                    🗑️
                  </button>


                </div>

              )

            )

          )}

        </div>

      </section>


      {/* =====================================
          DAILY PROGRESS
      ===================================== */}

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

                  ? 'All quests completed!'

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


      {/* =====================================
          HABIT MODAL
      ===================================== */}

      {showHabitModal && (

        <HabitModal

          onClose={() =>
            setShowHabitModal(false)
          }

          onCreate={createHabit}

        />

      )}


    </div>

  )
}


export default Dashboard