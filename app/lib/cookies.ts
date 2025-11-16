import Cookies from 'js-cookie'

const COOKIE_NAME = 'voter_session'
const COOKIE_EXPIRES = 7 // days

export interface VoterSession {
  warga_id: number
  no_kk: string
  nama_kepala: string
  nomor_rumah: string
  blok: string
}

export function setVoterSession(session: VoterSession) {
  Cookies.set(COOKIE_NAME, JSON.stringify(session), {
    expires: COOKIE_EXPIRES,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  })
}

export function getVoterSession(): VoterSession | null {
  const cookie = Cookies.get(COOKIE_NAME)
  if (!cookie) return null
  
  try {
    return JSON.parse(cookie)
  } catch {
    return null
  }
}

export function removeVoterSession() {
  Cookies.remove(COOKIE_NAME, { path: '/' })
}

export function isAuthenticated(): boolean {
  return getVoterSession() !== null
}