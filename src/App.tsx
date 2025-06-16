import { useEffect } from 'react'
import './App.css'

function App() {
  // const [phone, setPhone] = useState<null | string>(null)
  // const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id ?? 2
  // const [tickets, setTickets] = useState([])

  useEffect(function () {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.requestContact(x => {
        console.log('x', x)
      })
    }
    // smth
    
  }, [])

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
      <div>{userId}</div>
      <div>{tickets}</div>
    </div>
  )
}

export default App
