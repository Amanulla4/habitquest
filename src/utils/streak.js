/*
=========================================
STREAK UTILITIES
=========================================
*/

/*
=========================================
GET DATE KEY
=========================================
*/
export function getDateKey(date = new Date()) {
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

/*
=========================================
GET YESTERDAY KEY
=========================================
*/
export function getYesterdayKey() {
  const yesterday =
    new Date()
  yesterday.setDate(
    yesterday.getDate() - 1
  )
  return getDateKey(
    yesterday
  )
}

/*
=========================================
CHECK IF DATE IS YESTERDAY
=========================================
*/
export function isYesterday(
  dateString
) {
  return (
    dateString ===
    getYesterdayKey()
  )
}

/*
=========================================
GET STREAK BONUS (MULTIPLIER)
=========================================
*/
export function getStreakBonus(
  streak
) {
  if (streak >= 30) {
    return 1.5
  }
  if (streak >= 14) {
    return 1.35
  }
  if (streak >= 7) {
    return 1.25
  }
  if (streak >= 3) {
    return 1.1
  }
  return 1
}

/*
=========================================
UPDATE STREAK
=========================================
*/
export function updateStreak(
  currentStreak,
  lastCompletionDate
) {
  const today =
    getDateKey()

  /*
  First ever completion
  */
  if (
    !lastCompletionDate
  ) {
    return {
      currentStreak: 1,
      lastCompletionDate:
        today,
    }
  }

  /*
  Already completed today
  */
  if (
    lastCompletionDate ===
    today
  ) {
    return {
      currentStreak,
      lastCompletionDate,
    }
  }

  /*
  Completed yesterday
  */
  if (
    isYesterday(
      lastCompletionDate
    )
  ) {
    return {
      currentStreak:
        currentStreak + 1,
      lastCompletionDate:
        today,
    }
  }

  /*
  Streak was broken
  */
  return {
    currentStreak: 1,
    lastCompletionDate:
      today,
  }
}

/*
=========================================
GET STREAK MESSAGE
=========================================
*/
export function getStreakMessage(
  streak
) {
  if (streak >= 30) {
    return '🔥 LEGENDARY STREAK!'
  }
  if (streak >= 14) {
    return '🔥 TWO WEEK WARRIOR!'
  }
  if (streak >= 7) {
    return '🔥 ONE WEEK STREAK!'
  }
  if (streak >= 3) {
    return '🔥 KEEP THE MOMENTUM!'
  }
  if (streak === 2) {
    return '🔥 TWO DAYS STRONG!'
  }
  if (streak === 1) {
    return '🔥 STREAK STARTED!'
  }
  return 'Start your streak today!'
}

/*
=========================================
GET STREAK MILESTONE
=========================================
*/
export function getStreakMilestone(
  streak
) {
  const milestones = [
    3,
    7,
    14,
    30,
    60,
    100,
  ]
  return milestones.find(
    (milestone) =>
      milestone === streak
  ) || null
}