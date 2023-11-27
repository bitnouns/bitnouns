import { theme } from '@/../theme.config'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  runtime: 'nodejs',
  unstable_allowDynamic: ['**/.pnpm/**/node_modules/lodash*/*.js'],
}

const handler = (_: NextApiRequest, res: NextApiResponse) => {
  res.send(theme)
}

export default handler
