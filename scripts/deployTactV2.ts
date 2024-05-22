import { toNano } from '@ton/core';
import { TactV2 } from '../wrappers/TactV2';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const tactV2 = provider.open(await TactV2.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await tactV2.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(tactV2.address);

    console.log('ID', await tactV2.getId());
}
