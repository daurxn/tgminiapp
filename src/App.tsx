import { useEffect, useState } from 'react'
import './App.css'

function App() {
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

  // Request phone number
  const requestPhoneNumber = () => {
    if (window.Telegram?.WebApp) {
      setStatusMessage('Waiting for permission...')
      window.Telegram.WebApp.requestContact(isShared => {
        if (!isShared) setStatusMessage('Request cancelled. Try again.')
      })
    }
  }

  return (
    <div>
      {phoneNumber ? (
        <div>Phone: {phoneNumber}</div>
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
