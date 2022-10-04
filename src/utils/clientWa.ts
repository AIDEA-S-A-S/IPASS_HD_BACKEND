import { Client } from 'whatsapp-web.js'
import { updateClientWaState, updateQrWa } from './subscriptions/sendPub'

export let clientWa: Client

/**
 * Generamos un QRCODE para iniciar sesión
 */
export const withOutSession = async () => {
  clientWa = new Client({
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // <- this one doesn't works in Windows
        '--disable-gpu'
      ]
    },
    qrMaxRetries: 4
  })

  clientWa.on('qr', async (qr: any) => {
    updateQrWa({ qr, reload: true })
    updateClientWaState()
  })

  clientWa.on('ready', () => {
    updateClientWaState()
  })

  clientWa.on('auth_failure', () => {
    console.log('error')
  })

  clientWa.on('authenticated', () => {
    console.log('Sesión iniciada')
  })

  clientWa.on('disconnected', async (err: string) => {
    updateClientWaState()
    if (err === 'Max qrcode retries reached') {
      console.log('Desconectado', err)
      updateQrWa({ qr: '', reload: false })
    }
    await clientWa.destroy()
  })

  try {
    await clientWa.initialize()
  } catch (error) {
    console.log(error)
  }
}
