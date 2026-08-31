export function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

export function getYesterdayKey() {
  const date = new Date()

  date.setDate(date.getDate() - 1)

  return date.toISOString().split('T')[0]
}

export function updateStreak(
  currentStreak,
  bestStreak,
  lastCompletionDate
) {
  const today = getTodayKey()
  const yesterday = getYesterdayKey()

  // Already completed today
  if (lastCompletionDate === today) {
    return {
      currentStreak,
      bestStreak,
      lastCompletionDate,
      streakIncreased: false,
    }
  }

  // Continuing yesterday's streak
  if (lastCompletionDate === yesterday) {
    const newStreak = currentStreak + 1

    return {
      currentStreak: newStreak,
      bestStreak: Math.max(
        bestStreak,
        newStreak
      ),
      lastCompletionDate: today,
      streakIncreased: true,
    }
  }

  // Starting a new streak
  return {
    currentStreak: 1,
    bestStreak: Math.max(bestStreak, 1),
    lastCompletionDate: today,
    streakIncreased: true,
  }
}

export function getStreakBonus(streak) {
  if (streak >= 30) return 50
  if (streak >= 14) return 30
  if (streak >= 7) return 20
  if (streak >= 3) return 10
  if (streak >= 2) return 5

  return 0
}