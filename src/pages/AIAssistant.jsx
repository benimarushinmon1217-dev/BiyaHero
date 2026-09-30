import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import { getAIResponse } from '../utils/aiResponses'
import { getAssistantSuggestions } from '../services/accountService'
import { getPlaceSuggestions } from '../services/geocodingService'
import { useAuth } from '../context/AuthContext'

const getCommutePlaceQueries = message => {
    const explicitTrip = message.match(/\b(?:from|galing sa)\s+(.+?)\s+(?:to|papuntang|papunta sa|hanggang)\s+(.+?)(?:[?.!]|$)/i)
    if (explicitTrip) return { origin: explicitTrip[1].trim(), destination: explicitTrip[2].trim() }

    const destination = message.match(/\b(?:to|towards?|papuntang|papunta sa|pumunta sa|magpunta sa|hanggang)\s+(.+?)(?:[?.!]|$)/i)
    return { origin: '', destination: destination?.[1]?.trim() || '' }
}

const AIAssistant = () => {
    const { activeLocation, user } = useAuth()
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: 'Kumusta! I\'m your BiyaHero AI assistant. Ask me anything about commuting in Batangas! 🚌',
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [suggestedPrompts, setSuggestedPrompts] = useState([])
    const [suggestionError, setSuggestionError] = useState('')
    const [routeContext, setRouteContext] = useState(null)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        getAssistantSuggestions(activeLocation)
            .then(setSuggestedPrompts)
            .catch((error) => {
                setSuggestionError(error.friendlyMessage || 'Location-based questions are temporarily unavailable.')
                setSuggestedPrompts(activeLocation
                    ? [`May verified route mula ${activeLocation.name}?`, 'Nasaan ang pinakamalapit na transport hub?']
                    : ['Paano makakahanap ng verified route sa Batangas?', 'Nasaan ang pinakamalapit na transport hub?'])
            })
    }, [activeLocation])

    const handleSend = async (text = input) => {
        if (!text.trim()) return

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: text.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsTyping(true)

        try {
            const queries = getCommutePlaceQueries(text.trim())
            let originPlace = null
            let destinationPlace = null
            let placeLookupError = ''
            if (queries.origin) {
                try {
                    originPlace = (await getPlaceSuggestions(queries.origin, 1))[0] || null
                } catch (error) {
                    console.error('AI origin place lookup failed:', error)
                    placeLookupError = 'OpenStreetMap could not resolve the typed origin.'
                }
            }
            if (queries.destination) {
                try {
                    destinationPlace = (await getPlaceSuggestions(queries.destination, 1))[0] || null
                    if (!destinationPlace) placeLookupError = 'No matching OpenStreetMap place was found for the destination.'
                } catch (error) {
                    console.error('AI destination place lookup failed:', error)
                    placeLookupError = 'OpenStreetMap could not resolve the typed destination.'
                }
            }
            const responseText = await getAIResponse(text.trim(), {
                activeLocation,
                routeContext,
                originPlace,
                destinationPlace,
                passengerType: user.passengerType,
                preference: user.routePreference
            })
            if (responseText.routeContext) setRouteContext(responseText.routeContext)
            else if (responseText.clearRouteContext) setRouteContext(null)
            const answer = placeLookupError && responseText.responseType === 'location-needed'
                ? `${responseText.response}\n\n${placeLookupError}`
                : responseText.response
            const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                text: answer,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, botResponse])
        } catch (error) {
            console.error('AI response error:', error)
            const errorResponse = {
                id: Date.now() + 1,
                type: 'bot',
                text: 'Sorry, I encountered an error. Please try again! 😊',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorResponse])
        } finally {
            setIsTyping(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-center"
            >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Sparkles size={32} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2">AI Commute Assistant</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Ask me anything about commuting in Taglish!
                </p>
                {activeLocation && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Active location: {activeLocation.formattedAddress || activeLocation.name}
                    </p>
                )}
            </motion.div>

            {/* Suggested Prompts */}
            {messages.length === 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Try asking:</p>
                    {suggestionError && <p className="mb-2 text-xs text-amber-700 dark:text-amber-300">{suggestionError}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {suggestedPrompts.map((prompt, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSend(prompt)}
                                className="card text-left text-sm hover:border-primary-500 dark:hover:border-cyan-500 transition-all"
                            >
                                {prompt}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Chat Messages */}
            <div className="card mb-6 h-[500px] overflow-y-auto">
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'bot'
                                    ? 'bg-gradient-to-br from-purple-600 to-pink-500'
                                    : 'bg-gradient-to-br from-primary-600 to-cyan-500'
                                    }`}>
                                    {message.type === 'bot' ? (
                                        <Bot size={20} className="text-white" />
                                    ) : (
                                        <User size={20} className="text-white" />
                                    )}
                                </div>

                                {/* Message Bubble */}
                                <div>
                                    <div className={`rounded-2xl px-4 py-3 ${message.type === 'bot'
                                        ? 'bg-gray-100 dark:bg-gray-800'
                                        : 'bg-gradient-to-r from-primary-600 to-cyan-500 text-white'
                                        }`}>
                                        <p className="whitespace-pre-wrap">{message.text}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 px-2">
                                        {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center space-x-3 mb-4"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                            <Bot size={20} className="text-white" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                            <div className="flex space-x-2">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6, repeat: Infinity }}
                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
            >
                <div className="flex space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your question here..."
                        className="flex-1 px-4 py-3 rounded-xl glass focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSend()}
                        disabled={!input.trim()}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    )
}

export default AIAssistant
