import { theme } from '@/../theme.config'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
  unstable_allowDynamic: ['**/.pnpm/**/node_modules/lodash*/*.js'],
}

export default async function handler(req: NextRequest) {
  console.log(req.url)
  return NextResponse.json(theme)
}
