import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

const BiyaHeroSelect = ({ id, ariaLabel, value, options, onChange, disabled = false, className = '' }) => {
    const generatedId = useId()
    const listboxId = `${id || generatedId}-options`
    const rootRef = useRef(null)
    const triggerRef = useRef(null)
    const optionRefs = useRef([])
    const selectedIndex = Math.max(0, options.findIndex(option => option.value === value))
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(selectedIndex)
    const selectedOption = options[selectedIndex]

    useEffect(() => {
        if (!isOpen) return undefined
        const handlePointerDown = event => {
            if (!rootRef.current?.contains(event.target)) setIsOpen(false)
        }
        document.addEventListener('mousedown', handlePointerDown)
        document.addEventListener('touchstart', handlePointerDown)
        return () => {
            document.removeEventListener('mousedown', handlePointerDown)
            document.removeEventListener('touchstart', handlePointerDown)
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) optionRefs.current[activeIndex]?.focus()
    }, [isOpen, activeIndex])

    const chooseOption = index => {
        const option = options[index]
        if (!option || option.disabled) return
        onChange(option.value)
        setIsOpen(false)
        triggerRef.current?.focus()
    }

    const handleTriggerKeyDown = event => {
        if (disabled) return
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            setActiveIndex(selectedIndex)
            setIsOpen(true)
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setActiveIndex(selectedIndex)
            setIsOpen(open => !open)
        } else if (event.key === 'Escape') {
            setIsOpen(false)
        }
    }

    const handleOptionKeyDown = event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            const direction = event.key === 'ArrowDown' ? 1 : -1
            setActiveIndex(index => (index + direction + options.length) % options.length)
        } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault()
            setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            chooseOption(activeIndex)
        } else if (event.key === 'Escape') {
            event.preventDefault()
            setIsOpen(false)
            triggerRef.current?.focus()
        } else if (event.key === 'Tab') {
            setIsOpen(false)
        }
    }

    return (
        <div ref={rootRef} className={`relative mt-1 ${className}`}>
            <button
                ref={triggerRef}
                id={id}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                aria-label={ariaLabel}
                disabled={disabled}
                onClick={() => {
                    setActiveIndex(selectedIndex)
                    setIsOpen(open => !open)
                }}
                onKeyDown={handleTriggerKeyDown}
                className="input-field flex w-full items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:opacity-60"
            >
                <span>{selectedOption?.label || 'Select an option'}</span>
                <ChevronDown size={18} aria-hidden="true" className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div
                    id={listboxId}
                    role="listbox"
                    aria-label={ariaLabel}
                    className="absolute z-[60] mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-xl dark:border-gray-700 dark:bg-gray-800"
                >
                    {options.map((option, index) => (
                        <button
                            key={option.value}
                            ref={element => { optionRefs.current[index] = element }}
                            id={`${listboxId}-${index}`}
                            type="button"
                            role="option"
                            aria-selected={option.value === value}
                            disabled={option.disabled}
                            tabIndex={index === activeIndex ? 0 : -1}
                            onFocus={() => setActiveIndex(index)}
                            onKeyDown={handleOptionKeyDown}
                            onClick={() => chooseOption(index)}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors disabled:opacity-50 ${
                                option.value === value
                                    ? 'bg-primary-50 font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-cyan-300'
                                    : 'text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <span>{option.label}</span>
                            {option.value === value && <Check size={16} aria-hidden="true" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default BiyaHeroSelect
