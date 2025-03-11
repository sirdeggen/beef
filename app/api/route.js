import { Transaction } from '@bsv/sdk'
import { WocClient, getMerklePathOrParents } from '../woc'

export const fetchCache = 'force-no-store';

const woc = new WocClient()

export async function POST(req) {
    try {
        const body = await req.json()
        const { rawtx } = body
        const tx = Transaction.fromHex(rawtx)
        const beef = await woc.getMerklePathOrParents(tx)
        return Response.json({ beef: beef.toHexBEEF() }, { status: 200 })
    } catch (error) {
        console.log({ error })
        return Response.json({ error: error.message }, { status: 400 })
    }
}