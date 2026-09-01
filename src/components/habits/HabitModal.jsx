import { useState } from 'react'

import './HabitModal.css'


const categories = [
  'Health',
  'Fitness',
  'Learning',
  'Work',
  'Personal',
  'Finance',
  'Social',
  'Other',
]


const difficulties = {
  Easy: {
    xp: 10,
    gold: 5,
  },

  Medium: {
    xp: 25,
    gold: 15,
  },

  Hard: {
    xp: 50,
    gold: 25,
  },

  Epic: {
    xp: 100,
    gold: 50,
  },
}


const frequencies = [
  'Daily',
  'Weekdays',
  'Weekends',
  'Weekly',
]


const icons = [
  '🎯',
  '🏃',
  '💪',
  '📚',
  '💻',
  '🧘',
  '💧',
  '🥗',
  '💰',
  '🧠',
  '🎨',
  '🎮',
]


function HabitModal({
  onClose,
  onCreate,
}) {

  const [title, setTitle] =
    useState('')


  const [description, setDescription] =
    useState('')


  const [icon, setIcon] =
    useState('🎯')


  const [category, setCategory] =
    useState('Personal')


  const [difficulty, setDifficulty] =
    useState('Medium')


  const [frequency, setFrequency] =
    useState('Daily')


  const [error, setError] =
    useState('')


  const reward =
    difficulties[difficulty]


  const handleSubmit = (event) => {

    event.preventDefault()


    const cleanTitle =
      title.trim()


    if (!cleanTitle) {

      setError(
        'Give your quest a name first.'
      )

      return
    }


    if (
      cleanTitle.length < 2
    ) {

      setError(
        'Quest name is too short.'
      )

      return
    }


    const newHabit = {

      id:
        Date.now(),

      icon,

      title:
        cleanTitle,

      subtitle:
        description.trim() ||
        'Complete this habit',

      category,

      difficulty,

      frequency,

      xp:
        reward.xp,

      gold:
        reward.gold,

      completed:
        false,

      isDaily:
        frequency === 'Daily',

      createdAt:
        new Date().toISOString(),

    }


    onCreate(
      newHabit
    )


    onClose()

  }


  const handleOverlayClick = (
    event
  ) => {

    if (
      event.target ===
      event.currentTarget
    ) {

      onClose()

    }

  }


  return (

    <div

      className="habit-modal-overlay"

      onMouseDown={
        handleOverlayClick
      }

    >

      <div
        className="habit-modal"
      >


        {/* =================================
            HEADER
        ================================= */}

        <div className="habit-modal-header">

          <div>

            <span className="eyebrow">
              NEW QUEST
            </span>

            <h2>
              Create a Habit
            </h2>

            <p>
              Turn a real-world habit
              into an adventure.
            </p>

          </div>


          <button

            type="button"

            className="modal-close"

            onClick={onClose}

            aria-label="Close"

          >
            ×
          </button>

        </div>


        {/* =================================
            FORM
        ================================= */}

        <form
          onSubmit={handleSubmit}
        >


          {/* ===============================
              QUEST NAME
          =============================== */}

          <div className="form-group">

            <label htmlFor="habit-title">
              Quest Name
            </label>

            <input

              id="habit-title"

              type="text"

              value={title}

              onChange={(event) => {

                setTitle(
                  event.target.value
                )

                setError('')

              }}

              placeholder="e.g. Read 20 pages"

              maxLength={60}

              autoFocus

            />

          </div>


          {/* ===============================
              DESCRIPTION
          =============================== */}

          <div className="form-group">

            <label htmlFor="habit-description">
              Description
            </label>

            <input

              id="habit-description"

              type="text"

              value={description}

              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }

              placeholder="e.g. Read before going to bed"

              maxLength={100}

            />

          </div>


          {/* ===============================
              ICON
          =============================== */}

          <div className="form-group">

            <label>
              Choose Icon
            </label>


            <div className="icon-picker">

              {icons.map(
                (item) => (

                  <button

                    key={item}

                    type="button"

                    className={
                      icon === item
                        ? 'icon-option selected'
                        : 'icon-option'
                    }

                    onClick={() =>
                      setIcon(item)
                    }

                  >

                    {item}

                  </button>

                )
              )}

            </div>

          </div>


          {/* ===============================
              CATEGORY
          =============================== */}

          <div className="form-row">


            <div className="form-group">

              <label htmlFor="habit-category">
                Category
              </label>

              <select

                id="habit-category"

                value={category}

                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }

              >

                {categories.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* =============================
                FREQUENCY
            ============================= */}

            <div className="form-group">

              <label htmlFor="habit-frequency">
                Frequency
              </label>

              <select

                id="habit-frequency"

                value={frequency}

                onChange={(event) =>
                  setFrequency(
                    event.target.value
                  )
                }

              >

                {frequencies.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  )
                )}

              </select>

            </div>

          </div>


          {/* ===============================
              DIFFICULTY
          =============================== */}

          <div className="form-group">

            <label>
              Difficulty
            </label>


            <div className="difficulty-picker">

              {Object.entries(
                difficulties
              ).map(
                ([name, values]) => (

                  <button

                    key={name}

                    type="button"

                    className={
                      difficulty === name
                        ? 'difficulty-option selected'
                        : 'difficulty-option'
                    }

                    onClick={() =>
                      setDifficulty(
                        name
                      )
                    }

                  >

                    <strong>
                      {name}
                    </strong>

                    <span>
                      +{values.xp} XP
                    </span>

                    <small>
                      +{values.gold} 🪙
                    </small>

                  </button>

                )
              )}

            </div>

          </div>


          {/* ===============================
              REWARD PREVIEW
          =============================== */}

          <div className="reward-preview">

            <div>

              <span>
                QUEST REWARD
              </span>

              <strong>
                {icon} {title.trim() || 'Your Quest'}
              </strong>

            </div>


            <div className="reward-values">

              <b>
                +{reward.xp} XP
              </b>

              <b>
                +{reward.gold} 🪙
              </b>

            </div>

          </div>


          {/* ===============================
              ERROR
          =============================== */}

          {error && (

            <p className="form-error">
              ⚠️ {error}
            </p>

          )}


          {/* ===============================
              ACTIONS
          =============================== */}

          <div className="habit-modal-actions">

            <button

              type="button"

              className="modal-secondary"

              onClick={onClose}

            >
              Cancel
            </button>


            <button

              type="submit"

              className="modal-primary"

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