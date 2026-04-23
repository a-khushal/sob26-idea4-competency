# Node.js + Python IPC Demo

Demonstrates inter-process communication between Node.js and Python using stdio streams. Built as a competency test for [Summer of Bitcoin 2026 - Idea 4: Autonomous DVM Orchestrator for Nostream](https://github.com/cameri/nostream).

## What it does

- Node.js spawns a Python child process
- Sends JSON payload via stdin
- Python performs string manipulation (reversal)
- Returns JSON result via stdout
- Node.js parses the result asynchronously
- Handles crashes and timeouts gracefully

## Run

```bash
npm install
npm start
```

## Output

```
=== Node.js + Python IPC Demo ===

Test 1: Normal worker
Result: { result: 'rtson olleh', length: 11 }

Test 2: Crash handling
Caught: Exit code 1: Simulated crash

Test 3: Timeout handling
Caught: Timeout after 1000ms

=== Done ===
```
