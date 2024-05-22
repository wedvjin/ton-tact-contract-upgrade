import { toNano } from '@ton/core';
import { TactV0 } from '../wrappers/TactV0';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const tactV0 = provider.open(await TactV0.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await tactV0.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(tactV0.address);

    console.log('ID', await tactV0.getId());
}
