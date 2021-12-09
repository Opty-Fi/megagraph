#!/bin/sh

# symbols can be different between chains

if [[ "$CONFIG" == "arbitrum" ]]
then
  ln -s CurvePoolX22pool      generated/CurvePoolX2
  ln -s CurvePoolX3tricrypto  generated/CurvePoolX3
  # PoolX4 is not used
  ln -s generated/CurvePoolX3tricrypto  generated/CurvePoolX4
elif [[ "$CONFIG" == "polygon" ]]
then
  ln -s CurvePoolX2aAAVE generated/CurvePoolX2
  # PoolX2 and X3 are not used
  ln -s CurvePoolX2aAAVE generated/CurvePoolX3
  ln -s CurvePoolX2aAAVE generated/CurvePoolX4
elif [[ "$CONFIG" == "sushi" ]]
then
  ln -s SushiKashiPairMediumRiskV1kmWBTC\&\#x2F\;WMATIC-LINK generated/SushiKashiPairMediumRiskV1
else # mainnet or dev
  ln -s CurvePoolX2ankrCRV            generated/CurvePoolX2
  ln -s CurvePoolX3aDAI+aUSDC+aUSDT   generated/CurvePoolX3
  ln -s CurvePoolX4DAI+USDC+USDT+sUSD generated/CurvePoolX4
fi
