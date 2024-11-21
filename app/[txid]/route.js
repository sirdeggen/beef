import { Transaction } from '@bsv/sdk'
import { WocClient } from '../woc'

const woc = new WocClient()

export async function GET(req) {
    try {
        const txid = req.nextUrl.pathname.split('/')[1]
        if (!txid || txid.length !== 64) {
            return Response.json({ error: 'not a txid', txid }, { status: 400 })
        }

        let rawtx = await woc.getTx(txid)
        if (!rawtx) {
            woc.setNetwork('test')
            rawtx = await woc.getTx(txid)
            if (!rawtx) return Response.json({ error: 'no raw tx associated with that txid', txid }, { status: 400 })
        }
        const tx = Transaction.fromHex(rawtx)
        const beef = await woc.getMerklePathOrParents(tx)
        return Response.json({ beef: beef.toHexBEEF() }, { status: 200 })
    } catch (error) {
        console.log({ error })
        return Response.json({ error: error.message }, { status: 400 })
    }
}