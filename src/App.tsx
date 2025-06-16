import { useState } from 'react'
import './App.css'

function App() {
  const [phone, setPhone] = useState<null | string>(null)
  // const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id ?? 2
  // const [tickets, setTickets] = useState([])

  async function getPhoneNumber() {
    if (window.Telegram.WebApp) {
      try {
        // Use the correct requestPhone method that returns a Promise
        const phoneNumber = await window.Telegram.WebApp.requestPhone()
        console.log('Phone number received:', phoneNumber)
        setPhone(phoneNumber)
      } catch (error) {
        console.error('Error getting phone number:', error)
      }
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
