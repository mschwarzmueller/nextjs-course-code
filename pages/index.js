import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <h1> Next</h1>
      <br/>
      <Link href="/products/subpage">Products subpage</Link>
    </div>
  )
}
