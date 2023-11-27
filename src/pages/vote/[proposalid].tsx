import Layout from '@/components/Layout'
import ModalWrapper from '@/components/ModalWrapper'
import ProposalStatus from '@/components/ProposalStatus'
import VoteModal from '@/components/VoteModal'
import { TOKEN_CONTRACT } from '@/constants/addresses'
import { ETHERSCAN_BASEURL, ETHER_ACTOR_BASEURL } from '@/constants/urls'
import { useDAOAddresses, useGetAllProposals } from '@/hooks/fetch'
import { useUserVotes } from '@/hooks/fetch/useUserVotes'
import { Proposal } from '@/services/nouns-builder/governor'
import { getProposalDescription } from '@/utils/getProposalDescription'
import { getProposalName } from '@/utils/getProposalName'
import { shortenAddress } from '@/utils/shortenAddress'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { BigNumber, ethers } from 'ethers'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import useSWR from 'swr'
import { useEnsName } from 'wagmi'

export default function ProposalComponent() {
  const { data: addresses } = useDAOAddresses({
    tokenContract: TOKEN_CONTRACT,
  })
  const { data: proposals } = useGetAllProposals({
    governorContract: addresses?.governor,
  })

  const {
    query: { proposalid },
  } = useRouter()

  const proposalNumber = proposals
    ? proposals.length - proposals.findIndex((x) => x.proposalId === proposalid)
    : 0

  const proposal = proposals?.find((x) => x.proposalId === proposalid)

  const { data: ensName } = useEnsName({
    address: proposal?.proposal.proposer,
  })

  if (!proposal)
    return (
      <Layout>
        <div className="mt-8 flex items-center justify-around">
          <Image src={'/spinner.svg'} alt="spinner" width={30} height={30} />
        </div>
      </Layout>
    )

  const { forVotes, againstVotes, abstainVotes, voteEnd, voteStart } =
    proposal?.proposal || {}

  const getVotePercentage = (votes: number) => {
    if (!proposal || !votes) return 0
    const total = forVotes + againstVotes + abstainVotes

    const value = Math.round((votes / total) * 100)
    if (value > 100) return 100
    return value
  }

  const getDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)

    const month = date.toLocaleString('default', { month: 'long' })
    return `${month} ${date.getDate()}, ${date.getFullYear()}`
  }

  const getTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000)

    const hours = date.getHours() % 12
    const minutes = date.getMinutes()

    return `${hours}:${minutes} ${date.getHours() >= 12 ? 'PM' : 'AM'}`
  }

  return (
    <Layout>
      <div className="flex flex-col items-baseline justify-between sm:flex-row">
        <div className="flex items-baseline">
          <Link
            href="/vote"
            className="mr-4 flex items-center rounded-full border border-skin-stroke p-2 hover:bg-skin-muted"
          >
            <ArrowLeftIcon className="h-4" />
          </Link>

          <div className="">
            <div className="flex items-center">
              <div className="mr-4 break-words font-heading text-2xl text-skin-muted">
                Proposal {proposalNumber}
              </div>
              <ProposalStatus proposal={proposal} />
            </div>
            <div className="mt-2 font-heading text-5xl font-semibold text-skin-base">
              {getProposalName(proposal.description)}
            </div>
            <div className="mt-4 font-heading text-2xl text-skin-muted">
              Proposed by{' '}
              <Link
                href={`${ETHERSCAN_BASEURL}/address/${proposal.proposal.proposer}`}
                rel="noopener noreferrer"
                target="_blank"
                className="text-skin-highlighted underline"
              >
                {ensName || shortenAddress(proposal.proposal.proposer)}
              </Link>
            </div>
          </div>
        </div>

        <VoteButton proposal={proposal} proposalNumber={proposalNumber} />
      </div>

      <div className="mt-12 grid w-full grid-cols-3 items-center gap-4">
        <div className="w-full rounded-xl border border-skin-stroke bg-skin-muted p-6">
          <ProgressBar
            label="For"
            type="success"
            value={forVotes}
            percentage={getVotePercentage(forVotes)}
          />
        </div>
        <div className="w-full rounded-xl border border-skin-stroke bg-skin-muted p-6">
          <ProgressBar
            label="Against"
            type="danger"
            value={againstVotes}
            percentage={getVotePercentage(againstVotes)}
          />
        </div>
        <div className="w-full rounded-xl border border-skin-stroke bg-skin-muted p-6">
          <ProgressBar
            label="Abstain"
            type="muted"
            value={abstainVotes}
            percentage={getVotePercentage(abstainVotes)}
          />
        </div>
      </div>

      <div className="mt-4 grid w-full items-center gap-4 sm:grid-cols-3">
        <div className="flex w-full items-center justify-between rounded-xl border border-skin-stroke p-6 sm:items-baseline">
          <div className="font-heading text-xl text-skin-muted">Threshold</div>
          <div className="text-right">
            <div className="text-skin-muted">Current Threshold</div>
            <div className="font-semibold">
              {proposal.proposal.quorumVotes || 1} Quorum
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-between rounded-xl border border-skin-stroke p-6 sm:items-baseline">
          <div className="font-heading text-xl text-skin-muted">Ends</div>
          <div className="text-right">
            <div className="text-skin-muted">{getTime(voteEnd)}</div>
            <div className="font-semibold">{getDate(voteEnd)}</div>
          </div>
        </div>

        <div className="flex w-full items-center justify-between rounded-xl border border-skin-stroke p-6 sm:items-baseline">
          <div className="font-heading text-xl text-skin-muted">Snapshot</div>
          <div className="text-right">
            <div className="text-skin-muted">{getTime(voteStart)}</div>
            <div className="font-semibold">{getDate(voteStart)}</div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="font-heading text-2xl font-bold text-skin-base">
          Description
        </div>

        <ReactMarkdown
          className="prose prose-skin mt-4 max-w-[90vw] break-words prose-img:w-auto sm:max-w-[1000px]"
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          remarkPlugins={[remarkGfm]}
        >
          {getProposalDescription(proposal.description)}
        </ReactMarkdown>
      </div>

      <div className="mt-8 font-heading text-2xl font-bold text-skin-base">
        Proposed Transactions
      </div>

      <div className="mt-4 max-w-[75vw]">
        {proposal.targets.map((_, index) => (
          <ProposedTransactions
            key={index}
            target={proposal.targets[index]}
            value={proposal.values[index]}
            calldata={proposal.calldatas[index]}
          />
        ))}
      </div>
    </Layout>
  )
}

type EtherActorResponse = {
  name: string
  decoded: string[]
  functionName: string
  isVerified: boolean
}

const ProposedTransactions = ({
  target,
  value,
  calldata,
}: {
  target: string
  value: number
  calldata: string
}) => {
  const { data, error } = useSWR<EtherActorResponse>(
    calldata
      ? `${ETHER_ACTOR_BASEURL}/decode/${target}/${calldata}`
      : undefined,
  )
  const valueBN = BigNumber.from(value)

  if (!data || error) return <Fragment />

  const linkIfAddress = (value: string) => {
    if (ethers.utils.isAddress(value))
      return (
        <Link
          href={`${ETHERSCAN_BASEURL}/address/${value}`}
          rel="noopener noreferrer"
          target="_blank"
          className="text-skin-highlighted underline"
        >
          {value}
        </Link>
      )

    return value
  }

  return (
    <div className="w-full">
      <div className="break-words">
        {linkIfAddress(target)}
        <span>{`.${data?.functionName || 'transfer'}(`}</span>
      </div>
      {!data?.decoded && !valueBN.isZero() && (
        <div className="ml-4">{`${ethers.utils.formatEther(valueBN)} ETH`}</div>
      )}
      {data?.decoded?.map((decoded, index) => (
        <div className="ml-4" key={index}>
          {linkIfAddress(decoded)}
        </div>
      ))}
      <div>{')'}</div>
    </div>
  )
}

const VoteButton = ({
  proposal,
  proposalNumber,
}: {
  proposal: Proposal
  proposalNumber: number
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const { data: userVotes } = useUserVotes({
    timestamp: proposal.proposal.timeCreated,
  })

  if (proposal.state !== 1 || !userVotes || userVotes < 1) return <Fragment />

  return (
    <Fragment>
      <ModalWrapper
        className="w-full max-w-lg bg-skin-muted"
        open={modalOpen}
        setOpen={setModalOpen}
      >
        <VoteModal
          proposal={proposal}
          proposalNumber={proposalNumber}
          setOpen={setModalOpen}
        />
      </ModalWrapper>
      <button
        className="mt-8 w-full rounded-xl bg-skin-button-accent px-4 py-3 font-semibold text-skin-inverted sm:mt-0 sm:w-auto"
        onClick={() => setModalOpen(true)}
      >
        Submit vote
      </button>
    </Fragment>
  )
}

const ProgressBar = ({
  label,
  type,
  value,
  percentage,
}: {
  label: string
  value: number
  percentage: number
  type: 'success' | 'danger' | 'muted'
}) => {
  let textColor
  let baseColor
  let bgColor

  switch (type) {
    case 'success':
      textColor = 'text-skin-proposal-success'
      baseColor = 'bg-skin-proposal-success'
      bgColor = 'bg-skin-proposal-success bg-opacity-10'
      break
    case 'danger':
      textColor = 'text-skin-proposal-danger'
      baseColor = 'bg-skin-proposal-danger'
      bgColor = 'bg-skin-proposal-danger bg-opacity-10'
      break
    case 'muted':
      textColor = 'text-skin-proposal-muted'
      baseColor = 'bg-skin-proposal-muted'
      bgColor = 'bg-skin-proposal-muted bg-opacity-10'
      break
  }

  return (
    <div className="w-full">
      <div className="mb-1 flex flex-col items-center justify-between sm:flex-row sm:items-start">
        <div className={`${textColor} font-heading text-xl`}>{label}</div>
        <div className="mt-4 text-center text-xl font-semibold sm:mt-0 sm:text-left">
          {value}
        </div>
      </div>
      <div className={`w-full ${bgColor} mt-4 h-4 rounded-full sm:mt-0`}>
        <div
          className={`${baseColor} h-4 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}
