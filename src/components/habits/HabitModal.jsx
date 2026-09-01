import { useState, useEffect } from 'react'
import './HabitModal.css'

const ICONS = [
  '💪',
  '📚',
  '💧',
  '🧘',
  '💻',
  '🏃',
  '🥗',
  '😴',
  '🎯',
  '🎨',
  '🎸',
  '📝',
]

const CATEGORIES = [
  'Health',
  'Fitness',
  'Learning',
  'Productivity',
  'Mindfulness',
  'Personal',
]

const DIFFICULTIES = {
  Easy: {
    xp: 15,
    gold: 10,
  },
  Medium: {
    xp: 30,
    gold: 20,
  },
  Hard: {
    xp: 50,
    gold: 35,
  },
}

function HabitModal({ onClose, onCreate }) {
  const [name, setName] = useState('')

  const [icon, setIcon] =
    useState('🎯')

  const [category, setCategory] =
    useState('Personal')

  const [difficulty, setDifficulty] =
    useState('Medium')

  const [error, setError] =
    useState('')

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [onClose])

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedName =
      name.trim()

    if (!trimmedName) {
      setError(
        'Give your habit a name.'
      )
      return
    }

    if (trimmedName.length > 40) {
      setError(
        'Habit name must be 40 characters or less.'
      )
      return
    }

    const reward =
      DIFFICULTIES[difficulty]

    const newHabit = {
      id: Date.now(),

      icon,

      title: trimmedName,

      subtitle: `Daily ${category.toLowerCase()} quest`,

      category,

      difficulty,

      xp: reward.xp,

      gold: reward.gold,

      completed: false,
    }

    onCreate(newHabit)

    onClose()
  }

  return (
    <div
      className="habit-modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose()
        }
      }}
    >

      <div
        className="habit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="habit-modal-title"
      >

        {/* HEADER */}

        <div className="habit-modal-header">

          <div>

            <span className="habit-modal-eyebrow">
              NEW QUEST
            </span>

            <h2 id="habit-modal-title">
              Create Habit
            </h2>

            <p>
              Turn a real-life habit
              into an adventure.
            </p>

          </div>

          <button
            type="button"
            className="habit-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>

        </div>

        <form
          className="habit-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="form-group">

            <label htmlFor="habit-name">
              HABIT NAME
            </label>

            <input
              id="habit-name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setError('')
              }}
              placeholder="e.g. Read 20 pages"
              maxLength={40}
              autoFocus
            />

            <div className="input-meta">

              <span>
                Make it specific and achievable.
              </span>

              <small>
                {name.length}/40
              </small>

            </div>

          </div>

          {/* ICON */}

          <div className="form-group">

            <label>
              QUEST ICON
            </label>

            <div className="icon-picker">

              {ICONS.map(
                (item) => (

                  <button
                    key={item}
                    type="button"
                    className={
                      icon === item
                        ? 'selected'
                        : ''
                    }
                    onClick={() =>
                      setIcon(item)
                    }
                    aria-label={
                      `Select ${item}`
                    }
                  >
                    {item}
                  </button>

                )
              )}

            </div>

          </div>

          {/* CATEGORY */}

          <div className="form-group">

            <label>
              CATEGORY
            </label>

            <div className="category-grid">

              {CATEGORIES.map(
                (item) => (

                  <button
                    key={item}
                    type="button"
                    className={
                      category === item
                        ? 'selected'
                        : ''
                    }
                    onClick={() =>
                      setCategory(item)
                    }
                  >
                    {item}
                  </button>

                )
              )}

            </div>

          </div>

          {/* DIFFICULTY */}

          <div className="form-group">

            <label>
              DIFFICULTY
            </label>

            <div className="difficulty-grid">

              {Object.entries(
                DIFFICULTIES
              ).map(
                ([item, reward]) => (

                  <button
                    key={item}
                    type="button"
                    className={
                      difficulty === item
                        ? 'selected'
                        : ''
                    }
                    onClick={() =>
                      setDifficulty(item)
                    }
                  >

                    <strong>
                      {item}
                    </strong>

                    <span>
                      +{reward.xp} XP
                    </span>

                    <small>
                      +{reward.gold} 🪙
                    </small>

                  </button>

                )
              )}

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="habit-form-error">
              ⚠️ {error}
            </div>
          )}

          {/* ACTIONS */}

          <div className="habit-form-actions">

            <button
              type="button"
              className="habit-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="habit-create-button"
            >
              ⚔️ Create Quest
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default HabitModal