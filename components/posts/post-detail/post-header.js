import Head from 'next/head';
import Image from 'next/image';

import classes from './post-header.module.css';

function PostHeader(props) {
  const { title, image } = props;

  return (
    <>
    <Head>
      <title>Mije</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap" rel="stylesheet" />
    </Head>
    <header className="border-b-4 border-orange-300 flex justify-between m-4 p-4">
      <h1
      className="break-normal"
      style={{
        fontFamily: 'Oswald',
        fontSize: '4rem'
        }}
      >{title}</h1>
      <Image src={image} alt={title} width={200} height={150} />
    </header>
    </>
    
  );
}

export default PostHeader;
