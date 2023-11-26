import { NextApiRequest, NextApiResponse } from 'next'
import { theme } from 'theme.config'

export const config = {
  runtime: 'edge',
  unstable_allowDynamic: ['**/.pnpm/**/node_modules/lodash*/*.js'],
}

const handler = (_: NextApiRequest, res: NextApiResponse) => {
  res.send(theme)
}

export default handler
