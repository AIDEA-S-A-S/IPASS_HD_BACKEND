import { spawn } from 'child_process'

export function runPython(pythonPath: string, args: string[]): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const process = spawn('python3', [pythonPath, ...args])
    const out: string[] = []
    process.stdout.on('data', data => {
      out.push(data.toString())
    })

    const err = []
    process.stderr.on('data', data => {
      err.push(data.toString())
    })

    process.on('exit', (code, signal) => {
      resolve(out)
    })
  })
}
