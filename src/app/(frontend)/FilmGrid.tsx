'use client'
import { useState } from 'react'

export default function FilmGrid() {
  const [activeFilm, setActiveFilm] = useState<number | null>(null)

  return (
    <div className='grid grid-cols-12 gap-4'>
      {/* La Mémoire Column */}
      <div className='col-span-3 bg-gray-100 p-4'>
        <div>La Mémoire</div>
      </div>

      {/* Films Column */}
      <div
        className={`col-span-${
          activeFilm ? 6 : 9
        } bg-gray-50 p-4 transition-all duration-300`}
      >
        <div className='grid grid-cols-3 gap-2'>
          {[1, 2, 3].map((film) => (
            <div
              key={film}
              className='border p-2 hover:bg-gray-200 cursor-pointer'
              onClick={() => setActiveFilm(film)}
            >
              Festival Preview {film}
            </div>
          ))}
        </div>
      </div>

      {/* Content Column */}
      {activeFilm && (
        <div className='col-span-3 bg-white p-4 shadow-lg transition-all duration-300'>
          <button
            className='text-red-500 mb-4'
            onClick={() => setActiveFilm(null)}
          >
            Close
          </button>
          <p>Details for Film {activeFilm}</p>
        </div>
      )}
    </div>
  )
}
