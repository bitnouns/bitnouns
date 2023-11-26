import Layout from '@/components/Layout'
import { promises as fs } from 'fs'
import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import path from 'path'

export const getStaticPaths = async () => {
  const templateDirectory = path.join(process.cwd(), 'templates')
  const files = await fs.readdir(templateDirectory, { withFileTypes: true })
  const paths = files
    .filter((dirent) => dirent.isFile())
    .map((file) => ({
      params: {
        slug: file.name.replace(/\.md?$/, ''),
      },
    }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async (
  ctx: GetStaticPropsContext<{ slug: string }>,
): Promise<
  GetStaticPropsResult<{
    data: MDXRemoteSerializeResult<Record<string, unknown>>
  }>
> => {
  const { slug } = ctx.params!
  const templateDirectory = path.join(process.cwd(), 'templates')
  const source = await fs.readFile(`${templateDirectory}/${slug}.md`, 'utf8')
  const mdxSource = await serialize(source, { parseFrontmatter: true })

  return {
    props: {
      data: mdxSource,
    },
    revalidate: 60,
  }
}

export default function SiteComponent(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const { data } = props
  const align = data.frontmatter?.align

  const getAlignment = () => {
    switch (align) {
      case 'center':
        return 'text-center flex flex-col items-center'
      case 'right':
        return 'text-right'
      default:
        return ''
    }
  }
  return (
    <Layout>
      <div
        className={`flex h-full flex-col ${getAlignment()} wrapper prose prose-xl prose-skin w-full max-w-none break-words focus:outline-none prose-headings:font-heading`}
      >
        <MDXRemote {...data} />
      </div>
    </Layout>
  )
}
