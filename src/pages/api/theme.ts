import { theme } from '@/../theme.config'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
  unstable_allowDynamic: ['**/.pnpm/**/node_modules/lodash*/*.js'],
}

const handler = async (req: NextRequest) => {
  console.log(req.url)
  return Response.json(theme)
}

export default handler
