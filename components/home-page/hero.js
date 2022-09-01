import Image from 'next/image';

function Hero() {
  return (
    <section className="bg-gray">
      <div className='p-7 flex justify-center class'>
        <Image
          src="/images/site/g1.jpg"
          alt="An image showing a rainbow gradient."
          width={300}
          height={300}
          className="rounded-full"
        />
      </div>
      <div className='uppercase flex justify-center'>
        <h1 className="text-gray-300 text-5xl text-center pb-7 font-extrabold">
        40 YEARS OF DRIVING <br />
        DIVERSITY IN JOURNALISM
      </h1>
    </div>
      
    </section>
  );
}

export default Hero;
