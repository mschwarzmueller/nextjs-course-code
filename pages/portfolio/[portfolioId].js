import React from 'react'
import { useRouter } from 'next/router'

const PortfolioDynamicPage = () => {
    const routerObj = useRouter();
    console.log(routerObj,'router object')
  return (
    <div>PortfolioDynamicPage</div>
  )
}

export default PortfolioDynamicPage