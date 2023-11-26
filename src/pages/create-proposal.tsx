import AuthWrapper from '@/components/AuthWrapper'
import Layout from '@/components/Layout'
import { TOKEN_CONTRACT } from '@/constants/addresses'
import { useDAOAddresses } from '@/hooks/fetch'
import { useCurrentThreshold } from '@/hooks/fetch/useCurrentThreshold'
import { useUserVotes } from '@/hooks/fetch/useUserVotes'
import { useDebounce } from '@/hooks/useDebounce'
import { useIsMounted } from '@/hooks/useIsMounted'
import { GovernorABI } from '@buildersdk/sdk'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import { parseEther } from 'ethers/lib/utils.js'
import {
  Field,
  FieldArray,
  Form,
  Formik,
  useField,
  useFormikContext,
} from 'formik'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
interface Transaction {
  address: string
  valueInETH: number
}
interface Values {
  title: string
  summary: string
  transactions: Transaction[]
}

export default function Create() {
  return (
    <Layout>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[650px]">
          <div className="flex items-center">
            <Link
              href="/vote"
              className="mr-4 flex items-center rounded-full border border-skin-stroke p-2 hover:bg-skin-muted"
            >
              <ArrowLeftIcon className="h-4" />
            </Link>

            <div className="relative font-heading text-2xl font-bold text-skin-base sm:text-4xl">
              Create your proposal
            </div>
          </div>

          <Formik
            initialValues={{ title: '', transactions: [], summary: '' }}
            onSubmit={() => {}}
            render={({ values }) => (
              <Form className="mt-6 flex w-full flex-col">
                <label className="text-md relative font-heading text-skin-base">
                  Proposal title
                </label>

                <Field
                  name="title"
                  placeholder="My New Proposal"
                  className="text-md mt-2 w-full rounded-lg bg-skin-muted p-3 text-skin-base placeholder:text-skin-muted focus:outline-none"
                />

                <label className="text-md relative mt-6 font-heading text-skin-base">
                  Transactions
                </label>

                <FieldArray
                  name="transactions"
                  render={(arrayHelpers) => (
                    <div className="mt-2">
                      {values.transactions.map((_, index) => (
                        <div
                          key={index}
                          className="mb-4 flex flex-col rounded-md border p-4"
                        >
                          <div className="flex items-center justify-between">
                            <label className="w-52 text-sm">Recipent</label>
                            <button onClick={() => arrayHelpers.remove(index)}>
                              <XMarkIcon className="h-6" />
                            </button>
                          </div>
                          <Field
                            name={`transactions[${index}].address`}
                            placeholder="0x04bfb0034F24E..."
                            className="text-md mt-2 w-full rounded-lg bg-skin-muted p-3 text-skin-base placeholder:text-skin-muted focus:outline-none"
                          />

                          <label className="mt-4 text-sm">Value</label>
                          <div className="mt-2 flex items-center">
                            <Field
                              name={`transactions.${index}.valueInETH`}
                              placeholder="0.1"
                              type="number"
                              className="text-md w-full rounded-l-lg bg-skin-muted p-3 text-skin-base placeholder:text-skin-muted focus:outline-none"
                            />
                            <label className="flex h-12 items-center border-l bg-skin-muted px-4">
                              ETH
                            </label>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() =>
                          arrayHelpers.push({ address: '', valueInETH: 0 })
                        }
                        className={`text-md flex h-12 w-full items-center justify-around rounded-lg bg-skin-muted text-skin-muted`}
                      >
                        Add Transaction
                      </button>

                      <div className="mt-6 text-sm text-skin-muted">
                        Add one or more transactions and describe your proposal
                        for the community. The proposal cannot modified after
                        submission, so please verify all information before
                        submitting.
                      </div>
                    </div>
                  )}
                />

                <label className="text-md relative mt-6 font-heading text-skin-base">
                  Summary
                </label>

                <HTMLTextEditor />

                <SubmitButton />
              </Form>
            )}
          />
        </div>
      </div>
    </Layout>
  )
}

const SubmitButton = () => {
  const { values: formValues } = useFormikContext<Values>()
  const { transactions, title, summary } = formValues || {}
  const { data: addresses } = useDAOAddresses({
    tokenContract: TOKEN_CONTRACT,
  })

  const { data: userVotes } = useUserVotes()
  const { data: currentThreshold } = useCurrentThreshold({
    governorContract: addresses?.governor,
  })

  const targets = transactions?.map((t) => t.address as `0x${string}`) || []

  const values =
    transactions?.map((t) => parseEther(t.valueInETH.toString() || '0')) || []
  const callDatas = transactions?.map(() => '0x' as `0x${string}`) || []
  const description = `${title}&&${summary}`

  const args = [targets, values, callDatas, description] as const
  const debouncedArgs = useDebounce(args)

  const { config } = usePrepareContractWrite({
    address: addresses?.governor,
    abi: GovernorABI,
    functionName: 'propose',
    args: debouncedArgs,
    enabled: debouncedArgs && !values.find((x) => x.isZero()),
  })
  const { data, write } = useContractWrite(config)
  const { isLoading, isSuccess, status } = useWaitForTransaction({
    hash: data?.hash,
  })

  const isMounted = useIsMounted()

  if (!isMounted) return <Fragment />

  const hasBalance = userVotes && userVotes >= (currentThreshold || 0)

  const buttonClass = `${
    write
      ? 'bg-skin-button-accent hover:bg-skin-button-accent-hover'
      : 'bg-skin-button-muted'
  } text-skin-inverted rounded-lg text-md w-full h-12 mt-4 flex items-center justify-around`

  return (
    <AuthWrapper className={buttonClass}>
      <button
        onClick={() => write?.()}
        disabled={!hasBalance || !write || isSuccess || isLoading}
        type="button"
        className={buttonClass}
      >
        {!hasBalance ? (
          "You don't have enough votes to submit a proposal"
        ) : isSuccess ? (
          <div className="flex items-center">
            <div className="mr-2">Proposal Submitted</div>
            <CheckCircleIcon className="h-5" />
          </div>
        ) : isLoading ? (
          <Image src="/spinner.svg" alt="spinner" width={25} height={25} />
        ) : (
          'Submit Proposal'
        )}
      </button>
    </AuthWrapper>
  )
}

const RichTextEditor = dynamic(() => import('@mantine/rte'), {
  ssr: false,
  loading: () => (
    <div className="mt-2 min-h-[250px] animate-pulse rounded-md bg-gray-100" />
  ),
})

const HTMLTextEditor = () => {
  const props = { name: 'summary', type: 'text', id: 'summary' }
  const [_, meta, helpers] = useField(props.name)

  const { value } = meta
  const { setValue } = helpers

  return (
    <RichTextEditor
      controls={[
        ['bold', 'italic', 'underline', 'link'],
        ['unorderedList', 'h1', 'h2', 'h3'],
      ]}
      className="mt-2 min-h-[250px]"
      value={value}
      onChange={(value) => setValue(value)}
      {...props}
    />
  )
}
