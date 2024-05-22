# ContractUpgrade

## Test

`npx blueprint build --all`

`npm test -t ./tests/Upgrade.test.ts `

## Issue

tact_v0 -> tact_v1 : upgrade code by adding new methods and getters -- OK
tact_v1 -> tact_v2 : upgrade data by adding just new data -- OK, but the actual data remains the same (as in not init data)
v2 -> v3 : upgrade code by adding new methods and getters -- FAIL

if calling v2 when v3 deployed:
Exit code 9: Cell underflow. Read from slice primitive tried to read more bits or references than there are.

if calling v3 when v3 deployed:
Exit code 11

Upgrading code and data at the same time does not solve the issue

NOTE: upgrading only data with setData does not overwrite the existing data, the addition of the new one is up to be verified by reconstructing the similar architecture in pure func

