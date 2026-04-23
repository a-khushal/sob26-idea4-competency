import { spawn } from 'child_process'
import * as path from 'path'

interface Request { text: string }
interface Response { result: string; length: number }

function runWorker(request: Request, workerScript = 'worker.py', timeoutMs = 5000): Promise<Response> {
  return new Promise((resolve, reject) => {
    const workerPath = path.join(__dirname, '..', 'workers', workerScript)
    const proc = spawn('python3', [workerPath])
    let stdout = '', stderr = ''

    const timer = setTimeout(() => {
      proc.kill('SIGKILL')
      reject(new Error(`Timeout after ${timeoutMs}ms`))
    }, timeoutMs)

    proc.stdout.on('data', (chunk) => { stdout += chunk })
    proc.stderr.on('data', (chunk) => { stderr += chunk })

    proc.on('close', (code) => {
      clearTimeout(timer)
      if (code !== 0) return reject(new Error(`Exit code ${code}: ${stderr}`))
      try {
        resolve(JSON.parse(stdout.trim()))
      } catch {
        reject(new Error(`Invalid JSON: ${stdout}`))
      }
    })

    proc.on('error', (err) => {
      clearTimeout(timer)
      reject(err)
    })

    proc.stdin.write(JSON.stringify(request))
    proc.stdin.end()
  })
}

async function main() {
  console.log('=== Node.js + Python IPC Demo ===\n')

  // Test 1: Normal
  console.log('Test 1: Normal worker')
  try {
    const res = await runWorker({ text: 'hello nostr' })
    console.log('Result:', res, '\n')
  } catch (e) { console.log('Error:', (e as Error).message, '\n') }

  // Test 2: Crash
  console.log('Test 2: Crash handling')
  try {
    await runWorker({ text: 'test' }, 'worker_crash.py')
  } catch (e) { console.log('Caught:', (e as Error).message, '\n') }

  // Test 3: Timeout
  console.log('Test 3: Timeout handling')
  try {
    await runWorker({ text: 'test' }, 'worker_slow.py', 1000)
  } catch (e) { console.log('Caught:', (e as Error).message, '\n') }

  console.log('=== Done ===')
}

main()
