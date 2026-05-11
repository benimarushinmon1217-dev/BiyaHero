import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Mock data for routes
const mockRoutes = {
    routes: [
        {
            id: 1,
            type: 'fastest',
            duration: '35-45 min',
            fare: 65,
            transfers: 1
        },
        {
            id: 2,
            type: 'cheapest',
            duration: '55-70 min',
            fare: 40,
            transfers: 2
        },
        {
            id: 3,
            type: 'balanced',
            duration: '40-55 min',
            fare: 50,
            transfers: 1
        }
    ]
}

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'BiyaHero API is running' })
})

app.post('/api/routes', (req, res) => {
    const { origin, destination } = req.body

    if (!origin || !destination) {
        return res.status(400).json({ error: 'Origin and destination are required' })
    }

    // Return mock routes
    res.json({
        origin,
        destination,
        ...mockRoutes
    })
})

app.post('/api/ai/chat', (req, res) => {
    const { message } = req.body

    if (!message) {
        return res.status(400).json({ error: 'Message is required' })
    }

    // Mock AI response
    const response = {
        message: 'This is a mock response. Integrate with OpenAI API for real responses.',
        timestamp: new Date().toISOString()
    }

    res.json(response)
})

app.get('/api/alerts', (req, res) => {
    const alerts = [
        {
            id: 1,
            type: 'warning',
            title: 'Heavy Traffic in Lipa City',
            message: 'Expect delays around city center',
            location: 'Lipa City'
        }
    ]

    res.json({ alerts })
})

// Start server
app.listen(PORT, () => {
    console.log(`🚌 BiyaHero API server running on port ${PORT}`)
})
