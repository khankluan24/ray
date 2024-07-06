import { CLMM_PROGRAM_ID } from '@raydium-io/raydium-sdk-v2'
import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import Decimal from 'decimal.js'
import { initSdk, txVersion } from '../test-config'

export const createPool = async () => {
  const raydium = await initSdk({ loadToken: true })

  // you can call sdk api to get mint info or paste mint info from api: https://api-v3.raydium.io/mint/list
  // RAY
  const mint1 = await raydium.token.getTokenInfo('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R')
  // USDT
  const mint2 = await raydium.token.getTokenInfo('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB')
  const clmmConfigs = await raydium.api.getClmmConfigs()
  // const clmmConfigs = devConfigs // devnet configs

  const { execute } = await raydium.clmm.createPool({
    programId: CLMM_PROGRAM_ID,
    // programId: DEVNET_PROGRAM_ID.CLMM,
    mint1,
    mint2,
    ammConfig: { ...clmmConfigs[0], id: new PublicKey(clmmConfigs[0].id), fundOwner: '' },
    initialPrice: new Decimal(1),
    startTime: new BN(0),
    txVersion,
    // optional: set up priority fee here
    // computeBudgetConfig: {
    //   units: 600000,
    //   microLamports: 100000000,
    // },
  })
  // don't want to wait confirm, set sendAndConfirm to false or don't pass any params to execute
  const { txId } = await execute({ sendAndConfirm: true })
  console.log('clmm pool created:', { txId })
}

/** uncomment code below to execute */
// createPool()
