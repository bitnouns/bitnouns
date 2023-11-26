import { Proposal } from '@/services/nouns-builder/governor'
import { Fragment } from 'react'

export default function ProposalStatus({ proposal }: { proposal: Proposal }) {
  const { state } = proposal

  switch (state) {
    case 0:
      return (
        <div className="w-24 rounded-md bg-skin-proposal-success p-1 px-2 text-center text-white">
          Pending
        </div>
      )
    case 1:
      return (
        <div className="w-24 rounded-md bg-skin-proposal-success p-1 px-2 text-center text-white">
          Active
        </div>
      )
    case 2:
      return (
        <div className="w-24 rounded-md bg-skin-proposal-muted p-1 px-2 text-center text-white">
          Canceled
        </div>
      )
    case 3:
      return (
        <div className="w-24 rounded-md bg-skin-proposal-danger p-1 px-2 text-center text-white">
          Defeated
        </div>
      )
    case 4:
      return (
        <div className="w-24 rounded-md bg-skin-proposal-success p-1 px-2 text-center text-white">
          Succeeded
        </div>
      )
    case 5:
      return (
        <div className="w-24 rounded-md bg-skin-proposal-muted p-1 px-2 text-center text-white">
          Queued
        </div>
      )
    case 6:
      return (
        <div className="w-24 rounded-md bg-skin-proposal-muted p-1 px-2 text-center text-white">
          Expired
        </div>
      )
    case 7:
      return (
        <div className="w-24 rounded-md bg-skin-proposal-highlighted p-1 px-2 text-center text-white">
          Executed
        </div>
      )
    case 8:
      return (
        <div className="w-24 rounded-md bg-skin-proposal-danger p-1 px-2 text-center text-white">
          Vetoed
        </div>
      )
    default:
      return <Fragment />
  }
}
