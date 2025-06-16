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

      // Handler for contact received event
      const handleContactReceived = (data: ContactReceivedData) => {
        console.log('Contact received:', data)
        if (data.phone_number) {
          setPhoneNumber(data.phone_number)
          setStatusMessage('Success! Your phone number has been received.')
        } else {
          setStatusMessage(
            'Error: Contact was shared, but phosne number was not provided.'
          )
        }
      }

      // Set up event listener for contact_received event
      tg.onEvent('contact_received', handleContactReceived)

      // Clean up event listener when component unmounts
      return () => {
        tg.offEvent('contact_received', handleContactReceived)
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
