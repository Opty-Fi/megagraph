import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { MaiCamTokenData } from "../../../generated/schema";
import { MaiCamToken } from "../../../generated/MaiCamTokencamWMATIC/MaiCamToken";
import { MaiFinanceFarmAddress, ZERO_BD, ZERO_BI } from "../../utils/constants";
export function handleCamToken(txnHash: Bytes, blockNumber: BigInt, timestamp: BigInt, camTokenAddress: Address) {
  let entity = MaiCamTokenData.load(txnHash.toHex());
  if (!entity) entity = new MaiCamTokenData(txnHash.toHex());
  let camContract = MaiCamToken.bind(camTokenAddress);
  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  let totalSupplyResult = camContract.try_totalSupply();
  if (totalSupplyResult.reverted) {
    log.warning("totalSupply() reverted", []);
  } else {
  }
}
