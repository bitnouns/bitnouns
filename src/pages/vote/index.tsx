import Layout from '@/components/Layout'
import ProposalStatus from '@/components/ProposalStatus'
import { useCurrentThreshold } from '@/hooks/fetch/useCurrentThreshold'
import { useUserVotes } from '@/hooks/fetch/useUserVotes'
import { Proposal } from '@/services/nouns-builder/governor'
import { formatTreasuryBalance } from '@/utils/formatTreasuryBalance'
import { getProposalName } from '@/utils/getProposalName'
import { TOKEN_CONTRACT } from 'constants/addresses'
import { promises as fs } from 'fs'
import { useDAOAddresses, useGetAllProposals, useTreasuryBalance } from 'hooks'
import { GetStaticPropsResult, InferGetStaticPropsType } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Link from 'next/link'
import path from 'path'
import { Fragment } from 'react'

export const getStaticProps = async (): Promise<
  GetStaticPropsResult<{
    descriptionSource: MDXRemoteSerializeResult<Record<string, unknown>>
  }>
> => {
  // Get description markdown
  const templateDirectory = path.join(process.cwd(), 'templates')
  const descFile = await fs.readFile(
    templateDirectory + '/vote/description.md',
    'utf8',
  )
  const descMD = await serialize(descFile)

  return {
    props: {
      descriptionSource: descMD,
    },
    revalidate: 60,
  }
}

export default function Vote({
  descriptionSource,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: addresses } = useDAOAddresses({
    tokenContract: TOKEN_CONTRACT,
  })
  const { data: proposals } = useGetAllProposals({
    governorContract: addresses?.governor,
  })
  const { data: treasuryBalance } = useTreasuryBalance({
    treasuryContract: addresses?.treasury,
  })
  const { data: userVotes } = useUserVotes()
  const { data: currentThreshold } = useCurrentThreshold({
    governorContract: addresses?.governor,
  })

  console.log('userVotes', userVotes)
  console.log('currentThreshold', currentThreshold)

  const getProposalNumber = (i: number) => {
    if (!proposals) return 0
    return proposals.length - i
  }

  return (
    <Layout>
      <div className="relative font-heading text-2xl text-skin-muted">
        Governance
      </div>

      <div className="wrapper prose prose-skin h-full w-full max-w-none break-words pt-4 lg:prose-xl focus:outline-none prose-headings:font-heading">
        <MDXRemote {...descriptionSource} />
      </div>

      <div className="mt-6 flex flex-col justify-between rounded-2xl border border-skin-stroke p-6 sm:h-32 sm:flex-row sm:items-center sm:py-0">
        <div className="h-full sm:py-6">
          <div className="font-heading text-2xl text-skin-muted">Treasury</div>
          <div className="mt-2 font-heading text-4xl font-bold text-skin-base">
            Ξ {treasuryBalance ? formatTreasuryBalance(treasuryBalance) : '0'}
          </div>
        </div>
        <div className="mt-4 flex h-full items-center border-skin-stroke text-skin-muted sm:mt-0 sm:w-1/3 sm:border-l sm:pl-6">
          This treasury exists for DAO participants to allocate resources for
          the long-term growth and prosperity of the project.
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between">
          <div className="font-heading text-4xl text-skin-base">Proposals</div>
          {userVotes && userVotes >= (currentThreshold || 0) ? (
            <Link
              href={'/create-proposal'}
              className="flex h-8 w-36 items-center justify-around rounded-lg bg-skin-muted text-sm text-skin-muted hover:bg-skin-button-accent-hover hover:text-skin-inverted"
            >
              Submit proposal
            </Link>
          ) : (
            <Fragment />
          )}
        </div>
        <div>
          {proposals?.map((x, i) => (
            <ProposalPlacard
              key={i}
              proposal={x}
              proposalNumber={getProposalNumber(i)}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}

const ProposalPlacard = ({
  proposal,
  proposalNumber,
}: {
  proposal: Proposal
  proposalNumber: number
}) => {
  return (
    <Link
      href={`/vote/${proposal.proposalId}`}
      className="my-6 flex w-full items-center justify-between rounded-2xl border border-skin-stroke bg-skin-muted p-4 hover:bg-skin-backdrop"
    >
      <div className="flex items-center pr-4">
        <div className="text-xl font-semibold text-skin-base">
          <span className="mr-3 text-skin-muted sm:ml-2 sm:mr-4">
            {proposalNumber}
          </span>
          {getProposalName(proposal.description)}
        </div>
      </div>
      <ProposalStatus proposal={proposal} />
    </Link>
  )
}
