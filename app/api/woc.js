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
        return this
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
}