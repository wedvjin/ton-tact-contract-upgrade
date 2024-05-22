import { toNano } from '@ton/core';
import { TactV3 } from '../wrappers/TactV3';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const tactV3 = provider.open(await TactV3.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await tactV3.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(tactV3.address);

    console.log('ID', await tactV3.getId());
}
