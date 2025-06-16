import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>(
    'Click the button to request your phone number'
  )
  const [initialUser, setInitialUser] = useState<WebAppUser | null>(null)
  const [isTelegramEnv, setIsTelegramEnv] = useState(false)

  // Initialize Telegram WebApp and set up event listener
  useEffect(() => {
    // Check if app is running in Telegram environment
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      setIsTelegramEnv(true)

      // Initialize the WebApp
      tg.ready()

      // Get initial user data if available
      const user = tg.initDataUnsafe?.user
      if (user) {
        setInitialUser(user)
      }

      // Handler for contactRequested event
      const handleContactRequested = (data: ContactRequestedData) => {
        console.log('Contact requested event:', data)
        if (
          data.status === 'sent' &&
          data.responseUnsafe?.contact?.phone_number
        ) {
          // Extract phone number from the responseUnsafe object
          const phoneNumber = data.responseUnsafe.contact.phone_number
          setPhoneNumber(phoneNumber)
          setStatusMessage(
            `Success! Your phone number ${phoneNumber} has been received.`
          )
        } else if (data.status === 'sent') {
          // Phone number was shared but not available in the response
          setPhoneNumber('Phone number shared but not accessible')
          setStatusMessage(
            'Your phone number was shared, but we cannot access it directly.'
          )
        } else {
          // User declined to shares
          setStatusMessage(
            'You declined to share your phone number. Please try again.'
          )
        }
      }

      // Set up event listener for contactRequested event
      tg.onEvent('contactRequested', handleContactRequested)

      // Clean up event listener when component unmounts
      return () => {
        tg.offEvent('contactRequested', handleContactRequested)
      }
    } else {
      console.warn(
        'Telegram WebApp not found. Running outside of Telegram environment.'
      )
      setStatusMessage('This app must be run inside Telegram.')
      setIsTelegramEnv(false)
    }
  }, [])

  // Function to request phone number from user
  const handleRequestContact = () => {
    if (!isTelegramEnv || !window.Telegram) {
      setStatusMessage('Action only available within Telegram app.')
      return
    }

    setStatusMessage('Waiting for you to share your contact...')

    // Request contact from user
    window.Telegram.WebApp.requestContact((isShared: boolean) => {
      if (isShared) {
        // User agreed to share contact
        // Actual data will come through the contact_received event
        console.log('User agreed to share contact. Waiting for data...')
        setStatusMessage('Permission granted. Receiving data...')
      } else {
        // User declined to share contact
        console.log('User declined to share contact')
        setStatusMessage('You cancelled the request. Please try again.')
      }
    })
  }

  return (
    <div>
      <div>Hello {initialUser?.first_name || 'there'}!</div>
      <div>{statusMessage}</div>

      {phoneNumber ? (
        <div>Your phone number: {phoneNumber}</div>
      ) : (
        <button onClick={handleRequestContact} disabled={!isTelegramEnv}>
          Share My Phone Number
        </button>
      )}
    </div>
  )
}

export default App
