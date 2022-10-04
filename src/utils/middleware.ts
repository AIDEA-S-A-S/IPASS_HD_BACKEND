import riteLimit from 'express-rate-limit'

export const limiter = riteLimit({
  windowMs: 1000 * 30,
  max: 2,
  message: 'Too many request from this IP, please trye again later.'
})
