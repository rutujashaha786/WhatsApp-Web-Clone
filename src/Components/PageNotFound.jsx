import React from 'react'
import {Link} from 'react-router-dom'

function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dense"
      >
        Go back to Home
      </Link>
    </div>
  )
}

export default PageNotFound