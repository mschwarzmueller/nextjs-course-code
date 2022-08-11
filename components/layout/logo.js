import Head from "next/head";

function Logo() {
  return(
      <>
      <Head>
      <title>Mije</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap" rel="stylesheet" />
    </Head>
    <div className="text-white uppercase text-3xl font-bold ml-25"
      style={{
      fontFamily: 'Oswald',
      fontSize: '2rem'
      }}
  >Maynard Institute</div>

      </>
      
    
  )
}

export default Logo;
