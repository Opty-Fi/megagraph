#!/bin/sh

# symbols can be different between chains

if test "$CONFIG" = "arbitrum"
then
  ln -s CurvePoolX22pool     generated/CurvePoolX2
  ln -s CurvePoolX3tricrypto generated/CurvePoolX3
  # PoolX4 is not used
  ln -s CurvePoolX3tricrypto generated/CurvePoolX4
  ln -s CurvePoolX3.ts       generated/CurvePoolX4/CurvePoolX4.ts
elif test "$CONFIG" = "avalanche"
then
  ln -s CurvePoolX2_256MIM3CRV-f-0  generated/Curve
  ln -s CurvePoolX2_256MIM3CRV-f-0  generated/CurvePoolX2_256
  ln -s CurvePoolX3_256atricrypto   generated/CurvePoolX3_256
  ln -s CurvePoolX4_256U.TOKEN-f-19 generated/CurvePoolX4_256

  ln -s AaveV2TokenavDAI generated/AaveV2Token
  ln -sf constants-avalanche.ts src/AaveV2/mappings/constants.ts
elif test "$CONFIG" = "fantom"
then
  ln -s CurvePoolX2_256ren       generated/Curve
  ln -s CurvePoolX2_256ren       generated/CurvePoolX2_256
  ln -s CurvePoolX3_256tricrypto generated/CurvePoolX3_256
  ln -s CurvePoolX4_2564pool-f-7 generated/CurvePoolX4_256
elif test "$CONFIG" = "polygon"
then
  ln -s CurvePoolX2_256eurtusd      generated/Curve
  ln -s CurvePoolX2_256eurtusd      generated/CurvePoolX2_256
  ln -s CurvePoolX3_256aave         generated/CurvePoolX3_256
  ln -s CurvePoolX4_256crvAUR-JRT-f generated/CurvePoolX4_256

  ln -s AaveV2TokenamDAI generated/AaveV2Token
  ln -sf constants-polygon.ts src/AaveV2/mappings/constants.ts

  ln -s SushiKashiPairMediumRiskV1kmWBTC\&\#x2F\;WMATIC-LINK generated/SushiKashiPairMediumRiskV1
else # Ethereum
  ln -s CurvePoolX2_128cDAI+cUSDC         generated/Curve
  ln -s CurvePoolX2_128cDAI+cUSDC         generated/CurvePoolX2_128
  ln -s CurvePoolX2_256ankrCRV            generated/CurvePoolX2_256
  ln -s CurvePoolX3_128renBTC+WBTC+sBTC   generated/CurvePoolX3_128
  ln -s CurvePoolX3_256aDAI+aUSDC+aUSDT   generated/CurvePoolX3_256
  ln -s CurvePoolX4_128DAI+USDC+USDT+sUSD generated/CurvePoolX4_128

  ln -s AaveV2TokenaDAI generated/AaveV2Token
  ln -sf constants-ethereum.ts src/AaveV2/mappings/constants.ts

  ln -sf gauges-ethereum.ts src/CurveGauge/mappings/gauges.ts
fi
