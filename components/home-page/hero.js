import Image from 'next/image';

import classes from './hero.module.css';

function Hero() {
  return (
    <section className={classes.hero}>
      <div className={classes.image}>
        <Image
          src="/images/site/g1.jpg"
          alt="An image showing a rainbow gradient."
          width={300}
          height={300}
        />
      </div>
      <h1>
        40 YEARS OF DRIVING <br />
        DIVERSITY IN JOURNALISM
      </h1>
    </section>
  );
}

export default Hero;
