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
  prepareGameForToday,
} from '../../utils/storage'


/* =========================================
   DEFAULT QUESTS
========================================= */

const initialQuests = [
  {
    id: 1,
    icon: '💻',
    title: 'Master React',
    subtitle: 'Code for 60 minutes',
    category: 'Learning',
    difficulty: 'Hard',
    xp: 50,
    gold: 25,
    completed: true,
    isDaily: true,
  },

  {
    id: 2,
    icon: '🏃',
    title: 'Train Your Body',
    subtitle: 'Exercise for 30 minutes',
    category: 'Fitness',
    difficulty: 'Medium',
    xp: 40,
    gold: 20,
    completed: false,
    isDaily: true,
  },

  {
    id: 3,
    icon: '📚',
    title: 'Knowledge Seeker',
    subtitle: 'Read 20 pages',
    category: 'Learning',
    difficulty: 'Medium',
    xp: 25,
    gold: 15,
    completed: false,
    isDaily: true,
  },

  {
    id: 4,
    icon: '💧',
    title: 'Stay Hydrated',
    subtitle: 'Drink 2L of water',
    category: 'Health',
    difficulty: 'Easy',
    xp: 10,
    gold: 10,
    completed: false,
    isDaily: true,
  },
]


/* =========================================
   DERIVE STARTING TOTALS FROM PRE-COMPLETED
   QUESTS SO XP / GOLD NEVER GO OUT OF SYNC
========================================= */

const earnedFromCompleted = (quests, key) =>
  quests
    .filter((quest) => quest.completed)
    .reduce((total, quest) => total + quest[key], 0)


function Dashboard() {

  /*
  =========================================
  LOAD GAME
  =========================================
  */

  const rawSavedGame =
    loadGame()

  const preparedGame =
    prepareGameForToday(
      rawSavedGame
    )


  /*
  =========================================
  PLAYER STATE
  =========================================
  */

  const [quests, setQuests] =
    useState(
      preparedGame?.quests?.length
        ? preparedGame.quests
        : initialQuests
    )


  const [level, setLevel] =
    useState(
      preparedGame?.level ??
      defaultGameState.level
    )


  const [xp, setXp] =
    useState(
      preparedGame?.xp ??
      earnedFromCompleted(initialQuests, 'xp')
    )


  const [gold, setGold] =
    useState(
      preparedGame?.gold ??
      earnedFromCompleted(initialQuests, 'gold')
    )


  const [currentStreak, setCurrentStreak] =
    useState(
      preparedGame?.currentStreak ??
      defaultGameState.currentStreak
    )


  const [bestStreak, setBestStreak] =
    useState(
      preparedGame?.bestStreak ??
      defaultGameState.bestStreak
    )


  const [lastCompletionDate, setLastCompletionDate] =
    useState(
      preparedGame?.lastCompletionDate ??
      defaultGameState.lastCompletionDate
    )


  /*
  =========================================
  UI STATE
  =========================================
  */

  const [levelUpMessage, setLevelUpMessage] =
    useState('')


  const [streakMessage, setStreakMessage] =
    useState('')


  const [showHabitModal, setShowHabitModal] =
    useState(false)


  /*
  =========================================
  SAVE GAME
  =========================================
  */

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


  /*
  =========================================
  CALCULATIONS
  =========================================
  */

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


  /*
  =========================================
  CREATE HABIT
  =========================================
  */

  const createHabit = (
    newHabit
  ) => {

    const dailyHabit = {
      ...newHabit,
      isDaily: true,
      completed: false,
    }

    setQuests(
      (currentQuests) => [
        ...currentQuests,
        dailyHabit,
      ]
    )

  }


  /*
  =========================================
  DELETE QUEST
  =========================================
  */

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


  /*
  =========================================
  COMPLETE QUEST
  =========================================
  */

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


    /*
    -----------------------------------------
    MARK COMPLETE
    -----------------------------------------
    */

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
    -----------------------------------------
    STREAK
    -----------------------------------------
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
    -----------------------------------------
    STREAK BONUS
    -----------------------------------------
    */

    const streakBonus =
      streakResult.streakIncreased
        ? getStreakBonus(
            streakResult.currentStreak
          )
        : 0


    /*
    -----------------------------------------
    XP
    -----------------------------------------
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


    setXp(
      result.xp
    )


    setLevel(
      result.level
    )


    /*
    -----------------------------------------
    GOLD
    -----------------------------------------
    */

    setGold(
      (currentGold) =>
        currentGold +
        selectedQuest.gold
    )


    /*
    -----------------------------------------
    LEVEL UP
    -----------------------------------------
    */

    if (
      result.leveledUp
    ) {

      setLevelUpMessage(
        `⚔️ LEVEL UP! You are now Level ${result.level}!`
      )


      setTimeout(() => {

        setLevelUpMessage('')

      }, 3000)

    }


    /*
    -----------------------------------------
    STREAK MESSAGE
    -----------------------------------------
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


  /*
  =========================================
  RENDER
  =========================================
  */

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

            {' '}👋

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
              {new Date().toLocaleDateString(
                'en-US',
                {
                  weekday: 'long',
                }
              )}
            </strong>


            <small>

              {new Date().toLocaleDateString(
                'en-US',
                {
                  day: 'numeric',
                  month: 'long',
                }
              )}

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
          QUESTS
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


        <div className="quest-list">


          {quests.length === 0 ? (

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

                  >

                    {quest.completed
                      ? '✓'
                      : ''}

                  </button>


                  <button

                    className="quest-delete"

                    onClick={() =>
                      deleteQuest(
                        quest.id
                      )
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