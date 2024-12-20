import { MerklePath, Transaction } from '@bsv/sdk'

// https://api.whatsonchain.com/v1/bsv/main/exchangerate
/**
 *  WocClient
 * @class
 * @classdesc A class for interacting with the Whatsonchain API
 * @example
 * const woc = new WocClient()
 * const utxos = await woc.getUtxos('1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu')
 */
export class WocClient {
    constructor() {
        this.api = 'https://api.whatsonchain.com/v1/bsv/main'
    }

    setNetwork(network) {
        this.api = `https://api.whatsonchain.com/v1/bsv/${network}`
    }

    async getJson(route) {
        return await (await fetch(this.api + route, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })).json()
    }

    async get(route) {
        return await (await fetch(this.api + route, {
            method: 'GET',
            headers: {
                'Accept': 'plain/text',
            },
        })).text()
    }

    async post(route, body) {
        return await (await fetch(this.api + route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body)
        })).json()
    }

    async getUtxos(address) {
        console.log({ getUtxo: address })
        let confirmed = { results: [] }
        let unconfirmed = { results: [] }
        try {
            confirmed = await this.getJson(`/address/${address}/confirmed/unspent`)
        } catch (error) {
            console.log({ error })
        }
        try {
            unconfirmed = await this.getJson(`/address/${address}/unconfirmed/unspent`)
        } catch (error) {
            console.log({ error })
        }
        const combined = []
        confirmed?.result?.map(utxo => combined.push(utxo))
        unconfirmed?.result?.map(utxo => combined.push(utxo))
        const script = confirmed?.script || unconfirmed?.script || ''
        const formatted = combined.map(u => ({ txid: u.tx_hash, vout: u.tx_pos, satoshis: u.value, script }))
        console.log({ confirmed, unconfirmed, combined, formatted })
        return formatted
    }

    async getTx(txid) {
        return this.get(`/tx/${txid}/hex`)
    }

    async getMerklePath(txid) {
        return this.getJson(`/tx/${txid}/proof/tsc`)
    }

    async getHeader(hash) {
        return this.getJson(`/block/${hash}/header`)
    }

    async convertTSCtoBUMP(tsc) {
        const txid = tsc.txOrId
        const header = await this.getHeader(tsc.target)
        const bump = {}
        bump.blockHeight = header.height
        bump.path = []
        const leafOfInterest = { hash: txid, txid: true, offset: tsc.index }
        tsc.nodes.map((hash, idx) => {
            const offset = tsc.index >> idx ^ 1
            const leaf = { offset }
            if (hash === '*') leaf.duplicate = true
            else leaf.hash = hash
            if (idx === 0) {
                if (tsc.index % 2) bump.path.push([leafOfInterest, leaf])
                else bump.path.push([leaf, leafOfInterest])
            }
            else bump.path.push([leaf])
        })
        const merklePath = new MerklePath(bump.blockHeight, bump.path)
        if (header.merkleroot !== merklePath.computeRoot(txid)) throw new Error('Invalid Merkle Path')
        return merklePath
    }

    async getMerklePathOrParents(tx) {
        const tscRes = await this.getMerklePath(tx.id('hex'))
        if (tscRes !== null) {
            tx.merklePath = await this.convertTSCtoBUMP(tscRes[0])
            return tx
        }
        await Promise.all(tx.inputs.map(async (input, idx) => {
            const rawtx = await this.getTx(input.sourceTXID)
            const inputTx = Transaction.fromHex(rawtx)
            const st = await this.getMerklePathOrParents(inputTx)
            tx.inputs[idx].sourceTransaction = st
        }))
        return tx
    }
}