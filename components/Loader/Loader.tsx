'use client'

import React from 'react'

export function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-s-black border-t-transparent" />
    </div>
  )
}
