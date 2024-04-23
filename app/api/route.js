import { Transaction, MerklePath } from '@bsv/sdk'

export async function POST(req) {
    try {
        const body = await req.json()
        const { rawtx } = body
        const tx = Transaction.fromHex(rawtx)
        console.log({ tx })
        return Response.json({ beef: tx.toHex() }, { status: 200 })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 400 })
    }
}