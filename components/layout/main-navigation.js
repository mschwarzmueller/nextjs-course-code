import Link from 'next/link';
import Logo from './logo';

function MainNavigation() {
  return (
    <header className="flex justify-between bg-blue-900 p-6 place-items-center">
      <Link href="/">
        <a>
          <Logo />
        </a>
      </Link>
      <nav>
        <ul className='flex'>
          <li className='p-4 text-white'>
            <Link href="/news">News</Link>
          </li>
          <li className='p-4 text-white'>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;