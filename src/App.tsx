import { useState } from 'react'
import './App.css'

function App() {
  const [phone, setPhone] = useState<null | string>(null)
  // const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id ?? 2
  // const [tickets, setTickets] = useState([])

  function getPhoneNumber() {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.requestContact(contact => {
        console.log('Contact received:', contact)
        // Extract phone number from contact object
        if (contact && contact.phone_number) {
          setPhone(contact.phone_number)
        } else {
          console.error('Phone number not found in contact response')
        }
      })
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
