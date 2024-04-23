import Head from 'next/head'

const curl = `
curl --request POST \\
  --url https://beef.xn--nda.network/api \\
  --header 'Content-Type: application/json' \\
  --data '{"rawtx": "0200000001b2faffe1e1d3c88f4092f34646c060ea2b6a93acc3010484c747ed4c051c2555080000006a4730440220392bcec91f190ce38db9bf53d03886ab63d9bd24fcf7174e8a8df21d23382ba7022038f20c1f3f6583951d01af0be30612a6c0b46d949b4aae60f42644ce513f3e55412103ea0ff49ec6fbb9cbc942d9c1fce9c04e12a91c1209b239466e0a29147da55db1ffffffff0390010000000000001976a9144d255baa50a14bef4cce1eb8012a02768e8ffaa888acd3600000000000001976a91447e22d8011bb446cc3f606179e333f64a9b6206b88ac04915500000000001976a914d24cb016397008a85c88b1278a36434fdd4e801f88ac00000000"}'
`

export default function Home() {
    return (
        <div>
            <Head>
                <title>Background Evaluation Extended Format Tx Translation</title>
                <meta name="description" content="Created by Deggen using BSVA's TypeScript SDK" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1>🥩 BEEF 🥩</h1>
                <h2>Background Evaluation Extended Format Service API</h2>
                <p>Send your rawtx to the /api endpoint to get the BEEF Tx in the response.</p>
                <code style={{ textAlign: 'left' }}>
                    <pre>{curl}</pre>
                </code>
            </main>
        </div>
    )
}