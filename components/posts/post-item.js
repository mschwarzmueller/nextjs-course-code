import Link from 'next/link';
import Image from 'next/image';

import classes from './post-item.module.css';
import Head from 'next/head';

function PostItem(props) {
  const { title, image, excerpt, date, slug } = props.post;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const imagePath = `/images/posts/${slug}/${image}`;
  const linkPath = `/news/${slug}`;

  return (
    <>
    <Head>
      <title>{title}</title>
    </Head>
    <li className="mb-8">
      <Link href={linkPath}>
        <a>
          <div className="width-full max-h-80 overflow-hidden">
            <Image
              src={imagePath}
              alt={title}
              width={300}
              height={200}
              layout="responsive"
              className='object-cover'
            />
          </div>
          <div className="bg-gray p-4 h-52 flex flex-col items-center"
          >
            <h3 className="text-white text-4xl font-oswald text-extrabold mb-5"
            >{title}</h3>
            <time className="text-gray-400 italic">{formattedDate}</time>
            <p className="text-white leading-8 text-center">{excerpt}</p>
          </div>
        </a>
      </Link>
    </li>
    </>
  );
}

export default PostItem;
