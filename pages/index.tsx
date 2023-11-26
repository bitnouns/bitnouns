import FaqElement from '@/components/FaqElement'
import Footer from '@/components/Footer'
import { getAddresses } from '@/services/nouns-builder/manager'
import { AuctionInfo, getCurrentAuction } from 'data/nouns-builder/auction'
import {
  ContractInfo,
  TokenInfo,
  getContractInfo,
  getTokenInfo,
} from 'data/nouns-builder/token'
import { promises as fs } from 'fs'
import { useIsMounted } from 'hooks/useIsMounted'
import { GetStaticPropsResult, InferGetStaticPropsType } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import path from 'path'
import { Fragment } from 'react'
import { SWRConfig } from 'swr'
import Header from '../components/Header'
import Hero from '../components/Hero/Hero'

type MarkdownSource = MDXRemoteSerializeResult<Record<string, unknown>>

export const getStaticProps = async (): Promise<
  GetStaticPropsResult<{
    tokenContract: string
    tokenId: string
    contract: ContractInfo
    token: TokenInfo
    auction: AuctionInfo
    descriptionSource: MarkdownSource
    faqSources: MarkdownSource[]
  }>
> => {
  // Get token and auction info
  const tokenContract = process.env.NEXT_PUBLIC_TOKEN_CONTRACT! as `0x${string}`

  const addresses = await getAddresses({ tokenAddress: tokenContract })

  const [contract, auction] = await Promise.all([
    getContractInfo({ address: tokenContract }),
    getCurrentAuction({ address: addresses.auction }),
  ])

  const tokenId = auction.tokenId
  const token = await getTokenInfo({
    address: tokenContract,
    tokenid: tokenId,
  })

  // Get description and faq markdown

  const templateDirectory = path.join(process.cwd(), 'templates')
  const descFile = await fs.readFile(
    templateDirectory + '/home/description.md',
    'utf8',
  )
  const descMD = await serialize(descFile)

  let faqSources: MarkdownSource[] = []
  try {
    const faqFiles = await fs.readdir(templateDirectory + '/home/faq', {
      withFileTypes: true,
    })

    faqSources = await Promise.all(
      faqFiles
        .filter((dirent) => dirent.isFile())
        .map(async (file) => {
          const faqFile = await fs.readFile(
            templateDirectory + '/home/faq/' + file.name,
            'utf8',
          )

          return serialize(faqFile, { parseFrontmatter: true })
        }),
    ).then((x) =>
      x.sort(
        (a, b) =>
          Number(a.frontmatter?.order || 0) - Number(b.frontmatter?.order || 0),
      ),
    )
  } catch {
    //Do Nothing (no FAQ directory)
  }

  if (!contract.image) contract.image = ''

  return {
    props: {
      tokenContract,
      tokenId,
      contract,
      token,
      auction,
      descriptionSource: descMD,
      faqSources,
    },
    revalidate: 60,
  }
}

export default function SiteComponent({
  tokenContract,
  tokenId,
  contract,
  token,
  auction,
  descriptionSource,
  faqSources,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const isMounted = useIsMounted()

  if (!isMounted) return <Fragment />

  return (
    <SWRConfig
      value={{
        fallback: {
          [`/api/token/${tokenContract}`]: contract,
          [`/api/token/${tokenContract}/${tokenId}`]: token,
          [`/api/auction/${contract.auction}`]: auction,
        },
      }}
    >
      <div className="flex min-h-screen flex-col items-center justify-around bg-skin-backdrop text-skin-base">
        <div className="flex w-full items-center justify-around bg-skin-fill pb-8 lg:pb-0">
          <div className="max-w-[1400px]">
            <Header />
            <Hero />
          </div>
        </div>
        <div className="w-full max-w-[1400px]">
          <div>
            <div className="mt-8 bg-skin-backdrop lg:px-24 xl:px-52">
              <div className="wrapper prose prose-skin h-full w-full max-w-none break-words p-6 pt-12 lg:prose-xl focus:outline-none prose-headings:font-heading">
                <MDXRemote {...descriptionSource} />
              </div>

              <div className="p-8 pt-12 ">
                {faqSources.map((x, i) => (
                  <div key={i} className="mb-10">
                    <FaqElement
                      className={
                        'flex w-full items-center justify-between text-left font-heading text-4xl font-semibold text-skin-base hover:text-skin-highlighted'
                      }
                      title={x.frontmatter?.title || ''}
                    >
                      <div className="prose prose-skin mt-8 max-w-none break-words prose-headings:font-heading">
                        <MDXRemote {...x} />
                      </div>
                    </FaqElement>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </SWRConfig>
  )
}
