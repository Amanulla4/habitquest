const STORAGE_KEY = 'habitquest_save'


const getTodayKey = () => {
  const now = new Date()

  const year = now.getFullYear()

  const month = String(
    now.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    now.getDate()
  ).padStart(2, '0')

  return year + '-' + month + '-' + day
}


/*
=========================================
DEFAULT GAME STATE
=========================================
*/

export const defaultGameState = {
  quests: [],
  level: 1,
  xp: 0,
  gold: 0,

  currentStreak: 0,
  bestStreak: 0,

  lastCompletionDate: null,

  lastPlayedDate:
    getTodayKey(),
}


/*
=========================================
LOAD GAME
=========================================
*/

export function loadGame() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      )

    if (!saved) {
      return null
    }

    const parsed =
      JSON.parse(saved)

    return {
      ...defaultGameState,
      ...parsed,
    }

  } catch (error) {

    console.error(
      'Failed to load HabitQuest save:',
      error
    )

    return null
  }
}


/*
=========================================
SAVE GAME
=========================================
*/

export function saveGame(
  gameState
) {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...gameState,

        lastPlayedDate:
          getTodayKey(),
      })
    )

  } catch (error) {

    console.error(
      'Failed to save HabitQuest:',
      error
    )

  }

}


/*
=========================================
RESET DAILY QUESTS
=========================================
*/

export function resetDailyQuests(
  quests
) {

  return quests.map(
    (quest) => {

      if (
        quest.isDaily === false
      ) {
        return quest
      }

      return {
        ...quest,
        completed: false,
      }

    }
  )

}


/*
=========================================
CHECK NEW DAY
=========================================
*/

export function prepareGameForToday(
  game
) {

  if (!game) {
    return null
  }

  const today =
    getTodayKey()

  const lastPlayed =
    game.lastPlayedDate

  /*
   * Same day
   */

  if (
    !lastPlayed ||
    lastPlayed === today
  ) {

    return {
      ...game,
      lastPlayedDate: today,
    }

  }


  /*
   * New day
   */

  return {
    ...game,

    quests:
      resetDailyQuests(
        game.quests
      ),

    lastPlayedDate:
      today,
  }

}


/*
=========================================
CLEAR GAME
=========================================
*/

export function clearGame() {

  localStorage.removeItem(
    STORAGE_KEY
  )

}