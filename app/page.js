import Head from 'next/head'

const alias = `alias beef='beef_func'
beef_func() {
    txid=$1
    curl https://beef.xn--nda.network/$txid
}`

export default function Home() {
    return (
        <div>
            <Head>
                <title>Background Evaluation Extended Format Tx Translation</title>
                <meta name="description" content="Created by Deggen using BSVA's TypeScript SDK" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1 style={{ textAlign: 'center' }}>🥩 BEEF 🥩</h1>
                <h2 style={{ textAlign: 'center' }}>Background Evaluation Extended Format Service API</h2>
                <p style={{ textAlign: 'center' }}>Lookup BEEF by txid.</p>
                <a className="white" href="/e797cde97b653d58f64c7e1f48afba140b8ad5acd53539203a83b29aacfe9376">example</a>
                <h2>MacOS Install</h2>
                <p>Appending this to your ~/.zshrc</p>
                <code style={{ textAlign: 'left' }}>
                    <pre>{alias}</pre>
                </code>
                <h2>Usage</h2>
                <p>Any time you need to get BEEF for a txid, just type:</p>
                <code style={{ textAlign: 'left' }}>
                    <pre>beef e797cde97b653d58f64c7e1f48afba140b8ad5acd53539203a83b29aacfe9376</pre>
                </code>
            </main>
        </div>
    )
}