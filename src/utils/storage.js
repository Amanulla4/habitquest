const STORAGE_KEY = 'habitquest_save'

export const defaultGameState = {
  quests: [],
  level: 1,
  xp: 0,
  gold: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastCompletionDate: null,
}

export function loadGame() {
  try {
    const saved =
      localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return null
    }

    return {
      ...defaultGameState,
      ...JSON.parse(saved),
    }
  } catch (error) {
    console.error(
      'Failed to load HabitQuest save:',
      error
    )

    return null
  }
}

export function saveGame(gameState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(gameState)
    )
  } catch (error) {
    console.error(
      'Failed to save HabitQuest:',
      error
    )
  }
}

export function clearGame() {
  localStorage.removeItem(
    STORAGE_KEY
  )
}