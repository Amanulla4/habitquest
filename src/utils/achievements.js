/*
=========================================
HABITQUEST ACHIEVEMENT SYSTEM
=========================================
*/

export const ACHIEVEMENTS = [
  {
    id: 'first-step',
    icon: '🌱',
    title: 'First Step',
    description: 'Complete your first quest.',
    requirement: 1,
    type: 'quests',
    rewardXp: 25,
    rewardGold: 10,
  },

  {
    id: 'quest-warrior',
    icon: '⚔️',
    title: 'Quest Warrior',
    description: 'Complete 10 quests.',
    requirement: 10,
    type: 'quests',
    rewardXp: 75,
    rewardGold: 30,
  },

  {
    id: 'quest-master',
    icon: '🏆',
    title: 'Quest Master',
    description: 'Complete 50 quests.',
    requirement: 50,
    type: 'quests',
    rewardXp: 250,
    rewardGold: 100,
  },

  {
    id: 'on-fire',
    icon: '🔥',
    title: 'On Fire',
    description: 'Reach a 3-day streak.',
    requirement: 3,
    type: 'streak',
    rewardXp: 50,
    rewardGold: 20,
  },

  {
    id: 'warrior-streak',
    icon: '⚔️',
    title: 'Warrior',
    description: 'Reach a 7-day streak.',
    requirement: 7,
    type: 'streak',
    rewardXp: 100,
    rewardGold: 40,
  },

  {
    id: 'elite-streak',
    icon: '🛡️',
    title: 'Elite',
    description: 'Reach a 14-day streak.',
    requirement: 14,
    type: 'streak',
    rewardXp: 200,
    rewardGold: 75,
  },

  {
    id: 'legend',
    icon: '👑',
    title: 'Legend',
    description: 'Reach a 30-day streak.',
    requirement: 30,
    type: 'streak',
    rewardXp: 500,
    rewardGold: 200,
  },

  {
    id: 'centurion',
    icon: '💯',
    title: 'Centurion',
    description: 'Complete 100 quests.',
    requirement: 100,
    type: 'quests',
    rewardXp: 500,
    rewardGold: 250,
  },

  {
    id: 'level-five',
    icon: '✨',
    title: 'Rising Hero',
    description: 'Reach Level 5.',
    requirement: 5,
    type: 'level',
    rewardXp: 150,
    rewardGold: 50,
  },

  {
    id: 'level-ten',
    icon: '🧙',
    title: 'Master Adventurer',
    description: 'Reach Level 10.',
    requirement: 10,
    type: 'level',
    rewardXp: 500,
    rewardGold: 150,
  },
]


/*
=========================================
GET ACHIEVEMENT BY ID
=========================================
*/

export function getAchievement(
  achievementId
) {
  return (
    ACHIEVEMENTS.find(
      (achievement) =>
        achievement.id ===
        achievementId
    ) || null
  )
}


/*
=========================================
CHECK ACHIEVEMENTS
=========================================
*/

export function checkAchievements({
  completedQuestCount = 0,
  currentStreak = 0,
  level = 1,
  unlockedAchievements = [],
}) {
  const unlocked = new Set(
    unlockedAchievements
  )

  const newlyUnlocked = []

  ACHIEVEMENTS.forEach(
    (achievement) => {
      if (
        unlocked.has(
          achievement.id
        )
      ) {
        return
      }

      let progress = 0

      if (
        achievement.type ===
        'quests'
      ) {
        progress =
          completedQuestCount
      }

      if (
        achievement.type ===
        'streak'
      ) {
        progress =
          currentStreak
      }

      if (
        achievement.type ===
        'level'
      ) {
        progress = level
      }

      if (
        progress >=
        achievement.requirement
      ) {
        newlyUnlocked.push(
          achievement
        )
      }
    }
  )

  return newlyUnlocked
}


/*
=========================================
GET ACHIEVEMENT PROGRESS
=========================================
*/

export function getAchievementProgress(
  achievement,
  {
    completedQuestCount = 0,
    currentStreak = 0,
    level = 1,
  }
) {
  let progress = 0

  if (
    achievement.type ===
    'quests'
  ) {
    progress =
      completedQuestCount
  }

  if (
    achievement.type ===
    'streak'
  ) {
    progress =
      currentStreak
  }

  if (
    achievement.type ===
    'level'
  ) {
    progress = level
  }

  return Math.min(
    progress,
    achievement.requirement
  )
}