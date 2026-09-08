import { Hono } from 'hono'
import { accessAuth } from './middleware/auth'
const app = new Hono()

app.use(accessAuth)
app.get('/api/health', (c) => {
    // accessAuth က စစ်ပြီး ထည့်ပေးလိုက်တဲ့ user data ကို ရယူခြင်း


    return c.json("healthy")
})
export default app
