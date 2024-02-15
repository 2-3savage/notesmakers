import React, { useEffect, useState} from 'react';
import styles from './Menu.module.css';
import Header from './components/Header';
import MainMenu from './components/MainMenu';

const Menu = ({children, logoutUser}) => {
  const [switchNav, setSwitch] = useState(localStorage.getItem('switchNav') || 'white');
  const [navbar, setNavbar] = useState(localStorage.getItem('sidebar') || 'open') // true = open, false = close toggle
  useEffect(() =>{
    localStorage.setItem('switchNav', switchNav)
    localStorage.setItem('sidebar', navbar)
  }, [navbar, switchNav])

  const switchNavbar = () => {
    setSwitch(switchNav === 'white' ? 'dark' : 'white')
  }
  const toggleNavbar = () => {
    setNavbar(navbar === 'open' ? 'close' : 'open' )
  }
  const toggleNav = navbar === 'close' ? styles.close :  null  // true = open, false = close toggle
  switchNav === 'dark' ? document.body.classList.add('dark') : document.body.classList.remove('dark') 
  const switchDarkMode = switchNav === 'dark' ? styles.dark : null
  const mainText = 'Notion.so'
  const additionalText = 'Web development'
  return (<>
    <nav className={`${styles.sidebar} ${toggleNav} ${switchDarkMode}`}>
      <Header toggleNavbar={toggleNavbar} mainText={mainText} additionalText={additionalText} switchNav={switchNav} switchNavbar={switchNavbar} logoutUser={logoutUser}/>
      <div className={styles.menu_bar}>
          <MainMenu toggleNavbar={toggleNavbar} navbar={navbar}/>
      </div>
    </nav>
    
    
    <main className={styles.home}>
      <div className={styles.text}>
      { children }
      </div>
      
    </main>
  </>)
    
  
}
export default Menu
