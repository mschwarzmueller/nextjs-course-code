import Head from 'next/head';
import Image from 'next/image';

import classes from './post-header.module.css';

function PostHeader(props) {
  const { title, image } = props;

  return (
    <>
    <Head>
      <title>{title}</title>
    </Head>
    <header className="border-b-4 border-orange-300 flex justify-between m-4 p-4">
      <h1
      className="break-normal font-oswald text-5xl"
      >{title}</h1>
      <Image src={image} alt={title} width={200} height={150} />
    </header>
    </>
    
  );
}

export default PostHeader;
