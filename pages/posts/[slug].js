import { createClient } from 'contentful';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../components/layout';
import DateComponent from '../../components/date';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getStaticPaths() {
  const res = await client.getEntries({
    content_type: 'blogPost',
  });

  const paths = res.items.map((item) => {
    return { params: { slug: item.fields.slug } };
  });

  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const res = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': params.slug,
  });

  return {
    props: { post: res.items[0] },
  };
}

export default function BlogPost({ post }) {
  const { fields } = post;
  const { title, body, featuredImage, date } = fields;

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <article>
        <h1 className='text-4xl font-bold mb-3'>{title}</h1>
        <div className='text-lg mb-2 text-slate-700'>
          <DateComponent dateString={date} />
        </div>
        <Image
          src={`https:${featuredImage.fields.file.url}`}
          width={featuredImage.fields.file.details.image.width}
          height={featuredImage.fields.file.details.image.height}
        ></Image>
        <ReactMarkdown children={body} className='markdown' />
      </article>
    </Layout>
  );
}
