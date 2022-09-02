import { Fragment } from 'react';
import Head from 'next/head';
import ContactUs from '../components/contact/contact-us';

function ContactPage() {
  return (
    <Fragment>
      <Head>
        <title>Contact Us</title>
        <meta name="description" content="Send me your messages!" />
      </Head>
      <ContactUs />
    </Fragment>
  );
}

export default ContactPage;
