import { useEffect, useState } from 'react'
import './App.css'
import { getGlpiSessionToken, processPhoneNumber } from './services/glpi'
import { getMyTicketsInProgress } from './services/tickets'

function App() {
  const [tickets, setTickets] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>(
    'Click to share phone number'
  )

  useEffect(() => {
    // Initialize and set up Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()

      // Register event handler for phone number
      const handleContactRequested = (data: ContactRequestedData) => {
        if (
          data.status === 'sent' &&
          data.responseUnsafe?.contact?.phone_number
        ) {
          setPhoneNumber(data.responseUnsafe.contact.phone_number)
        } else if (data.status === 'sent') {
          setPhoneNumber('Phone number shared but not accessible')
        }
      }

      // Set up event listener
      window.Telegram.WebApp.onEvent('contactRequested', handleContactRequested)

      // Clean up on unmount
      return () => {
        window.Telegram.WebApp.offEvent(
          'contactRequested',
          handleContactRequested
        )
      }
    }
  }, [])

  // useEffect(() => {
  //   getGlpiSessionToken()
  // }, [])

  useEffect(() => {
    if (phoneNumber) {
      // Process the phone number with GLPI
      const checkUserInGlpi = async () => {
        const result = await processPhoneNumber(phoneNumber)
        setStatusMessage(result.message)

        // If you need to use the GLPI user ID
        if (result.success && result.glpiUserId) {
          console.log('GLPI User ID:', result.glpiUserId)
          setUserId(result.glpiUserId)
          // Here you could store the GLPI user ID or perform additional actions
        }
      }

      checkUserInGlpi()
    }
  }, [phoneNumber])

  useEffect(() => {
    async function getTickets() {
      const ticketsInProgress = await getMyTicketsInProgress(userId!)

      console.log('tickets: ', ticketsInProgress)
      setTickets(ticketsInProgress)
    }

    if (userId) {
      getTickets()
    }
  }, [userId])

  // Request phone number
  const requestPhoneNumber = () => {
    if (window.Telegram?.WebApp) {
      setStatusMessage('Waiting for permission...')
      window.Telegram.WebApp.requestContact(isShared => {
        if (!isShared) setStatusMessage('Request cancelled. Try again.')
      })
    }
  }

  const ticketsListItems = tickets.map(ticket => (
    <li key={ticket.id}>{JSON.stringify(ticket)}</li>
  ))

  return (
    <div>
      {phoneNumber ? (
        <>
          <div>Phone: {phoneNumber}</div>
          <ul>{ticketsListItems}</ul>
        </>
      ) : (
        <>
          <div>{statusMessage}</div>
          <button onClick={requestPhoneNumber}>Share Phone Number</button>
        </>
      )}
    </div>
  )
}

export default App
