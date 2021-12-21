#!/bin/sh

# symbols can be different between chains

if [[ "$CONFIG" == "arbitrum" ]]
then
  ln -s CurvePoolX22pool     generated/CurvePoolX2
  ln -s CurvePoolX3tricrypto generated/CurvePoolX3
  # PoolX4 is not used
  ln -s CurvePoolX3tricrypto generated/CurvePoolX4
  ln -s CurvePoolX3.ts       generated/CurvePoolX4/CurvePoolX4.ts
elif [[ "$CONFIG" == "polygon" ]]
then
  ln -s CurvePoolX2eurtusd      generated/CurvePoolX2
  ln -s CurvePoolX3aave         generated/CurvePoolX3
  ln -s CurvePoolX4crvAUR-JRT-f generated/CurvePoolX4
else # mainnet or dev
  ln -s CurvePoolX2ankrCRV            generated/CurvePoolX2
  ln -s CurvePoolX3aDAI+aUSDC+aUSDT   generated/CurvePoolX3
  ln -s CurvePoolX4DAI+USDC+USDT+sUSD generated/CurvePoolX4
fi
