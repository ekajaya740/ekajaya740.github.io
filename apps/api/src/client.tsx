import './styles/index.css'
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start/client'

hydrateRoot(document, <StartClient />)
