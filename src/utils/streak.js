/*
=========================================
STREAK UTILITIES
=========================================
*/

export function getDateKey(date = new Date()) {
  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
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
  const yesterday = new Date()

  yesterday.setDate(
    yesterday.getDate() - 1
  )

  return getDateKey(yesterday)
}


/*
=========================================
CHECK IF DATE IS YESTERDAY
=========================================
*/

export function isYesterday(dateString) {
  return (
    dateString ===
    getYesterdayKey()
  )
}


/*
=========================================
STREAK BONUS MULTIPLIER
=========================================
*/

export function getStreakBonus(streak) {
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
  const today = getDateKey()

  /*
  FIRST COMPLETION
  */

  if (!lastCompletionDate) {
    return {
      currentStreak: 1,
      lastCompletionDate: today,
    }
  }


  /*
  ALREADY COMPLETED TODAY
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
  COMPLETED YESTERDAY
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
  STREAK BROKEN
  */

  return {
    currentStreak: 1,
    lastCompletionDate: today,
  }
}


/*
=========================================
STREAK MESSAGE
=========================================
*/

export function getStreakMessage(
  streak
) {
  if (streak >= 100) {
    return '👑 LEGENDARY! 100 DAY STREAK!'
  }

  if (streak >= 60) {
    return '💎 60 DAYS! UNSTOPPABLE!'
  }

  if (streak >= 30) {
    return '👑 30 DAYS! LEGENDARY STREAK!'
  }

  if (streak >= 14) {
    return '⚔️ TWO WEEKS! WARRIOR MODE!'
  }

  if (streak >= 7) {
    return '🔥 ONE WEEK! KEEP GOING!'
  }

  if (streak >= 3) {
    return '🔥 THREE DAYS! MOMENTUM UNLOCKED!'
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
STREAK MILESTONES

Each milestone has:
- xp: the ACTUAL numeric XP granted
  when the milestone is reached
- reward: a display-only string
  (kept in sync with xp, used for
  the notification text)

Kept in ascending order of `days` -
several helpers below rely on this.
=========================================
*/

export const STREAK_MILESTONES = [
  {
    days: 3,
    icon: '🔥',
    title: 'Momentum',
    xp: 50,
    reward: '50 XP',
  },

  {
    days: 7,
    icon: '⚔️',
    title: 'Warrior',
    xp: 100,
    reward: '100 XP',
  },

  {
    days: 14,
    icon: '🛡️',
    title: 'Elite',
    xp: 200,
    reward: '200 XP',
  },

  {
    days: 30,
    icon: '👑',
    title: 'Legend',
    xp: 500,
    reward: '500 XP',
  },

  {
    days: 60,
    icon: '💎',
    title: 'Unstoppable',
    xp: 1000,
    reward: '1000 XP',
  },

  {
    days: 100,
    icon: '🏆',
    title: 'Master',
    xp: 2500,
    reward: '2500 XP',
  },
]


/*
=========================================
GET REACHED MILESTONE

Exact match only - true when the streak
count is EXACTLY on a milestone day.
Used to trigger the one-time reward /
notification.
=========================================
*/

export function getStreakMilestone(
  streak
) {
  return (
    STREAK_MILESTONES.find(
      (milestone) =>
        milestone.days === streak
    ) || null
  )
}


/*
=========================================
GET NEXT MILESTONE

The next milestone still ahead of the
current streak.
=========================================
*/

export function getNextStreakMilestone(
  streak
) {
  return (
    STREAK_MILESTONES.find(
      (milestone) =>
        milestone.days > streak
    ) || null
  )
}


/*
=========================================
GET PREVIOUS MILESTONE

The most recent milestone the streak
has already passed (or is currently
on), regardless of whether the streak
lands exactly on it. Used as the
"floor" for progress-bar math so the
bar fill is accurate between two
milestones (e.g. streak 5 is between
the 3-day and 7-day milestones).

Returns null if no milestone has been
reached yet (streak < 3).
=========================================
*/

export function getPreviousStreakMilestone(
  streak
) {
  let previous = null

  for (
    let index = 0;
    index < STREAK_MILESTONES.length;
    index++
  ) {

    const milestone =
      STREAK_MILESTONES[index]

    if (milestone.days <= streak) {
      previous = milestone
    } else {
      break
    }

  }

  return previous
}