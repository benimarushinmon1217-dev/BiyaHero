#!/usr/bin/env node

/**
 * BiyaHero Health Check Script
 * Verifies all services are running correctly
 */

import axios from 'axios'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
}

const log = {
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    header: (msg) => console.log(`\n${colors.cyan}${'='.repeat(50)}\n${msg}\n${'='.repeat(50)}${colors.reset}\n`)
}

async function checkNodeVersion() {
    try {
        const { stdout } = await execAsync('node --version')
        const version = stdout.trim()
        const majorVersion = parseInt(version.slice(1).split('.')[0])

        if (majorVersion >= 18) {
            log.success(`Node.js ${version} (✓ >= 18)`)
            return true
        } else {
            log.error(`Node.js ${version} (✗ < 18 required)`)
            return false
        }
    } catch (error) {
        log.error('Node.js not found')
        return false
    }
}

async function checkNpm() {
    try {
        const { stdout } = await execAsync('npm --version')
        log.success(`npm ${stdout.trim()}`)
        return true
    } catch (error) {
        log.error('npm not found')
        return false
    }
}

async function checkMySQL() {
    try {
        const { stdout } = await execAsync('mysql --version')
        log.success(`MySQL installed: ${stdout.trim().split(',')[0]}`)
        return true
    } catch (error) {
        log.warning('MySQL not found in PATH (may still be running)')
        return null // Unknown status
    }
}

async function checkBackend() {
    try {
        const response = await axios.get('http://localhost:5000/health', {
            timeout: 3000
        })

        if (response.data.success) {
            log.success('Backend API is running')
            log.info(`  Port: ${response.data.server?.port || 5000}`)
            log.info(`  Uptime: ${Math.floor(response.data.uptime || 0)}s`)
            log.info(`  Environment: ${response.data.environment || 'unknown'}`)

            // Check database
            if (response.data.database?.status === 'connected') {
                log.success('Database connection successful')
            } else {
                log.error(`Database: ${response.data.database?.message || 'disconnected'}`)
            }

            return true
        }
        return false
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            log.error('Backend is not running (connection refused)')
            log.info('  Start with: npm run dev:backend-only')
        } else {
            log.error(`Backend check failed: ${error.message}`)
        }
        return false
    }
}

async function checkFrontend() {
    try {
        const response = await axios.get('http://localhost:5173', {
            timeout: 3000
        })

        if (response.status === 200) {
            log.success('Frontend is running on http://localhost:5173')
            return true
        }
        return false
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            log.error('Frontend is not running (connection refused)')
            log.info('  Start with: npm run dev:frontend-only')
        } else {
            log.error(`Frontend check failed: ${error.message}`)
        }
        return false
    }
}

async function checkDependencies() {
    try {
        const fs = await import('fs')
        const path = await import('path')

        const hasNodeModules = fs.existsSync('node_modules')
        const hasBackendNodeModules = fs.existsSync('backend/node_modules')

        if (hasNodeModules && hasBackendNodeModules) {
            log.success('All dependencies installed')
            return true
        } else {
            if (!hasNodeModules) {
                log.error('Frontend dependencies not installed')
                log.info('  Run: npm install')
            }
            if (!hasBackendNodeModules) {
                log.error('Backend dependencies not installed')
                log.info('  Run: cd backend && npm install')
            }
            return false
        }
    } catch (error) {
        log.error('Could not check dependencies')
        return false
    }
}

async function checkEnvironmentFiles() {
    try {
        const fs = await import('fs')

        const hasRootEnv = fs.existsSync('.env')
        const hasBackendEnv = fs.existsSync('backend/.env')

        if (hasRootEnv && hasBackendEnv) {
            log.success('Environment files configured')
            return true
        } else {
            if (!hasRootEnv) {
                log.warning('.env file not found')
                log.info('  Copy: cp .env.example .env')
            }
            if (!hasBackendEnv) {
                log.warning('backend/.env file not found')
                log.info('  Copy: cp backend/.env.example backend/.env')
            }
            return false
        }
    } catch (error) {
        log.error('Could not check environment files')
        return false
    }
}

async function main() {
    log.header('🏥 BiyaHero Health Check')

    const results = {
        node: false,
        npm: false,
        mysql: null,
        dependencies: false,
        envFiles: false,
        backend: false,
        frontend: false
    }

    // Check prerequisites
    log.info('Checking prerequisites...')
    results.node = await checkNodeVersion()
    results.npm = await checkNpm()
    results.mysql = await checkMySQL()

    console.log()

    // Check project setup
    log.info('Checking project setup...')
    results.dependencies = await checkDependencies()
    results.envFiles = await checkEnvironmentFiles()

    console.log()

    // Check running services
    log.info('Checking running services...')
    results.backend = await checkBackend()
    results.frontend = await checkFrontend()

    // Summary
    log.header('📊 Health Check Summary')

    const allGood = results.node && results.npm && results.dependencies && results.backend && results.frontend
    const hasIssues = !results.dependencies || !results.envFiles || !results.backend || !results.frontend

    if (allGood) {
        log.success('All systems operational! 🎉')
        log.info('\nYour development environment is ready.')
        log.info('Access the app at: http://localhost:5173')
    } else if (hasIssues) {
        log.warning('Some issues detected')
        log.info('\nQuick fixes:')

        if (!results.dependencies) {
            log.info('  1. Install dependencies: npm install && cd backend && npm install')
        }
        if (!results.envFiles) {
            log.info('  2. Setup environment: cp .env.example .env && cp backend/.env.example backend/.env')
        }
        if (!results.backend || !results.frontend) {
            log.info('  3. Start services: npm run dev')
        }
    }

    console.log()

    // Exit code
    process.exit(allGood ? 0 : 1)
}

main().catch(error => {
    log.error(`Health check failed: ${error.message}`)
    process.exit(1)
})
