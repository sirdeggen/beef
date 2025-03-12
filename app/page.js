import Head from 'next/head'

const alias = `alias beef='beef_func'
beef_func() {
    curl https://beef.xn--nda.network/$1
}

alias rawbeef='rawbeef_func'
rawbeef_func() {
    curl --request POST \ 
    --url https://beef.xn--nda.network/api \ 
    --header 'Content-Type: application/json' \ 
    --data "{\"rawtx\": \"$1\"}" 
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
                <h1 style={{ textAlign: 'center' }}>BEEF</h1>
                <h2 style={{ textAlign: 'center' }}>Background Evaluation Extended Format</h2>
                <p style={{ textAlign: 'center' }}>Get BEEF for any txid or rawtx.</p>
                <a className="white" href="/e797cde97b653d58f64c7e1f48afba140b8ad5acd53539203a83b29aacfe9376">example</a>
                <h2>MacOS Install</h2>
                <p>Append these functions to your ~/.zshrc</p>
                <code style={{ textAlign: 'left' }}>
                    <pre>{alias}</pre>
                </code>
                <h2>Usage</h2>
                <h3>1. beef  &lt;txid&gt;</h3>
                <p>Any time you need to get BEEF for a txid, just type:</p>
                <code style={{ textAlign: 'left' }}>
                    <pre>beef e797cde97b653d58f64c7e1f48afba140b8ad5acd53539203a83b29aacfe9376</pre>
                </code>

                <h3>2. rawbeef &lt;rawtx&gt;</h3>
                <p>Any time you need to get BEEF from a new rawtx, just type:</p>
                <code style={{ textAlign: 'left' }}>
                    <pre>rawbeef 01000000017652614aaa977365339cbbbb9ab66dfba52de7bf98ebabf705712e6c7f5e42ae010000006b483045022100c30a41075cf83c27a492e926c300a85ec48c451e4e8d3011ec43883f4fe86e050220476135dd4aa544aa5d97dba3221c9de61dcc4dcdea3791d57a9354d8ee5a4205412103f1e8297b4fd692cb89356e91ac32edb4b3560c116397799a276fc7c8c8494390ffffffff02c6d20000000000001976a9146f126db8e0ef9db75a65c1ea0507881a2e1f0f5488acf7680700000000001976a914944d91ba2f21fdddaf8d3fc59ae62cfbe0092d8f88ac00000000</pre>
                </code>
            </main>
        </div>
    )
}