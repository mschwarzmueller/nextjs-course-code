import Head from 'next/head';
import PostsGrid from '../posts/posts-grid';

function FeaturedPosts(props) {
  return (
    <>
    <Head>
      <title>Mije</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap" rel="stylesheet" />
    </Head>
    <section className="bg-gray-400 flex justify-center items-center flex-col">
      <h2 className="text-6xl font-extrabold p-10"
      style={{
        fontFamily: 'Oswald',
      }}
      >Maynard News</h2>
      <PostsGrid posts={props.posts} />
    </section>
    </>
    
  );
}

export default FeaturedPosts;
