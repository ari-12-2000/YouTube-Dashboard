"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="p-10">
      {!session ? (
        <button onClick={() => signIn('google', { callbackUrl: '/' })
        } className="bg-blue-500 text-white p-2 rounded">
          Sign in with Google
        </button>
      ) : (
        <div>
          <p>Welcome, {session.user?.name}</p>
          <button onClick={() => signOut()} className="bg-gray-700 text-white p-2 rounded mt-2">
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
