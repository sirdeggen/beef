import { Transaction, MerklePath } from '@bsv/sdk'
import { WocClient } from './woc'

const woc = new WocClient()

async function convertTSCtoBUMP(tsc) {
    console.log({ tsc })
    const txid = tsc.txOrId
    const header = await woc.getHeader(tsc.target)
    console.log({ header })
    const bump = {}
    bump.blockHeight = header.height
    bump.path = []
    bump.path.push([{ hash: txid, txid: true, offset: tsc.index }])
    tsc.nodes.map((hash, idx) => {
        const offset = tsc.index >> idx ^ 1
        const leaf = { offset }
        if (hash === '*') leaf.duplicate = true
        else leaf.hash = hash
        if (idx === 0) bump.path[0].push(leaf)
        else bump.path.push([leaf])
    })
    console.dir({ bump }, { depth: null })
    const merklePath = new MerklePath(bump.blockHeight, bump.path)
    if (header.merkleroot !== merklePath.computeRoot(txid)) throw new Error('Invalid Merkle Path')
    return merklePath
}

async function getMerklePathOrParents(tx) {
    const tscRes = await woc.getMerklePath(tx.id('hex'))
    if (tscRes.length > 0) {
        tx.merklePath = await convertTSCtoBUMP(tscRes[0])
        return tx
    }
    await Promise.all(tx.inputs.map(async (input, idx) => {
        const rawtx = await woc.getTx(input.sourceTXID)
        const inputTx = Transaction.fromHex(rawtx)
        const st = await getMerklePathOrParents(inputTx)
        tx.inputs[idx].sourceTransaction = st
    }))
    return tx
}

export async function POST(req) {
    try {
        const body = await req.json()
        const { rawtx } = body
        const tx = Transaction.fromHex(rawtx)
        const beef = await getMerklePathOrParents(tx)
        console.log({ beef })
        return Response.json({ beef: beef.toHexBEEF() }, { status: 200 })
    } catch (error) {
        console.log({ error })
        return Response.json({ error: error.message }, { status: 400 })
    }
}