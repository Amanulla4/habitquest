import './Achievements.css'

import {
  ACHIEVEMENTS,
  getAchievementProgress,
} from '../utils/achievements'

import {
  loadGame,
} from '../utils/storage'


function Achievements() {

  const game =
    loadGame()

  const unlockedAchievements =
    Array.isArray(
      game?.unlockedAchievements
    )
      ? game.unlockedAchievements
      : []

  const history =
    Array.isArray(game?.history)
      ? game.history
      : []

  const stats = {
    completedQuestCount:
      history.length,
    currentStreak:
      game?.currentStreak ?? 0,
    level:
      game?.level ?? 1,
  }

  const unlockedCount =
    unlockedAchievements.length

  const totalCount =
    ACHIEVEMENTS.length


  return (

    <div className="achievements-page">


      {/* HEADER */}

      <div className="achievements-header">

        <div>

          <p className="eyebrow">
            HALL OF FAME
          </p>

          <h1>
            Achievements
          </h1>

          <p className="achievements-subtitle">
            Track every milestone on your
            adventure.
          </p>

        </div>


        <div className="achievements-count">

          <strong>
            {unlockedCount} / {totalCount}
          </strong>

          <span>
            Unlocked
          </span>

        </div>

      </div>


      {/* GRID */}

      <div className="achievements-grid">

        {ACHIEVEMENTS.map(
          (achievement) => {

            const isUnlocked =
              unlockedAchievements.includes(
                achievement.id
              )

            const progress =
              getAchievementProgress(
                achievement,
                stats
              )

            const progressPercent =
              Math.round(
                (progress /
                  achievement.requirement) *
                100
              )

            return (

              <div
                key={achievement.id}
                className={
                  'achievement-card' +
                  (isUnlocked
                    ? ' unlocked'
                    : '')
                }
              >

                <div className="achievement-icon">
                  {isUnlocked
                    ? achievement.icon
                    : '🔒'}
                </div>


                <div className="achievement-info">

                  <strong>
                    {achievement.title}
                  </strong>

                  <span>
                    {achievement.description}
                  </span>


                  {!isUnlocked && (

                    <div className="achievement-progress">

                      <div className="achievement-progress-bar">

                        <div
                          style={{
                            width:
                              progressPercent + '%',
                          }}
                        />

                      </div>

                      <small>
                        {progress} / {achievement.requirement}
                      </small>

                    </div>

                  )}


                  <div className="achievement-reward">

                    <small>
                      +{achievement.rewardXp} XP
                    </small>

                    <small>
                      +{achievement.rewardGold} 🪙
                    </small>

                  </div>

                </div>


                {isUnlocked && (
                  <div className="achievement-check">
                    ✓
                  </div>
                )}

              </div>

            )

          }
        )}

      </div>

    </div>

  )

}


export default Achievements