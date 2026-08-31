export function getXpRequired(level) {
  return 100 + (level - 1) * 50
}

export function calculateLevel(xp, startingLevel = 1) {
  let level = startingLevel
  let remainingXp = xp

  while (remainingXp >= getXpRequired(level)) {
    remainingXp -= getXpRequired(level)
    level += 1
  }

  return {
    level,
    xp: remainingXp,
    xpRequired: getXpRequired(level),
    leveledUp: level > startingLevel,
  }
}

export function addXp(currentXp, currentLevel, amount) {
  const totalXp =
    currentXp +
    amount

  return calculateLevel(
    totalXp,
    currentLevel
  )
}