import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [phone, setPhone] = useState<null | string>(null)
  // const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id ?? 2
  // const [tickets, setTickets] = useState([])

  useEffect(function () {
    if (window.Telegram.WebApp) {
      console.log(window.Telegram.WebApp)
    }
  }, [])

  function getPhoneNumber() {
    if (window.Telegram.WebApp) {
      const xd = window.Telegram.WebApp.requestContact(x => {
        console.log('x', x)
        setPhone(x)
      })
      console.log('xd', xd)
    }
  }

  // useEffect(function () {
  //   if (window.Telegram.WebApp) {
  //     window.Telegram.WebApp.requestContact(x => {
  //       console.log('x', x)
  //       setPhone(x[0])
  //     })
  //   }
  //   // smth
  // }, [])

  // useEffect(
  //   function () {
  //     async function getTickets() {
  //       const ticketsFromGlpi = await getMyTicketsInProgress(userId)
  //       setTickets(ticketsFromGlpi)
  //     }

  //     getTickets()
  //   },
  //   [userId]
  // )

  return (
    <div>
      <div>Hello my friend</div>
      <button onClick={getPhoneNumber}>Get phone number</button>
      <div>{phone}</div>
    </div>
  )
}

export default App
