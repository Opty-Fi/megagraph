import { BigDecimal, Address } from "@graphprotocol/graph-ts";
import { ConvexERC20 } from "../../../generated/ConvexBooster/ConvexERC20";
import { ConvexTokenAddress, ZERO_BD } from "../../utils/constants";
import { convertBINumToDesiredDecimals } from "../../utils/converters";

// https://docs.convexfinance.com/convexfinanceintegration/cvx-minting
let cliffSize = BigDecimal.fromString("100_000"); // new cliff every 100k tokens
let cliffCount = BigDecimal.fromString("1000");
let maxSupply = BigDecimal.fromString("100_000_000"); // 100m tokens

export function getCvxMintAmount(crvEarned: BigDecimal): BigDecimal {
  // first get total supply
  let cvxToken = ConvexERC20.bind(ConvexTokenAddress);
  let supply = cvxToken.try_totalSupply();
  if (supply.reverted) {
    return ZERO_BD;
  }
  let totalSupply = convertBINumToDesiredDecimals(supply.value, 18);

  // get current cliff
  let currentCliff = totalSupply.div(cliffSize);

  // if current cliff is under the max
  if (currentCliff.lt(cliffCount)) {
    // get remaining cliffs
    let remaining = cliffCount.minus(currentCliff);

    // multiply ratio of remaining cliffs to total cliffs against amount CRV received
    let cvxEarned = crvEarned.times(remaining).div(cliffCount);

    // double check we have not gone over the max supply
    let amountTillMax = maxSupply.minus(totalSupply);
    if (cvxEarned.gt(amountTillMax)) {
      cvxEarned = amountTillMax;
    }
    return cvxEarned;
  }
  return ZERO_BD;
}
