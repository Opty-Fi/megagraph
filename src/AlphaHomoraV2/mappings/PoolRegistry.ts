import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { OwnershipTransferred } from "../../../generated/AlphaHomoraV2PoolRegistry/AlphaHomoraV2PoolRegistry";
import { AlphaHomoraV2ERC20 } from "../../../generated/AlphaHomoraV2PoolRegistry/AlphaHomoraV2ERC20";
import { AlphaHomoraV2CyToken } from "../../../generated/AlphaHomoraV2PoolRegistry/AlphaHomoraV2CyToken";
import { convertToLowerCase } from "../../utils/converters";
import {
  AlphaHomoraV2WMasterChef,
  AlphaHomoraV2Token,
  AlphaHomoraV2LpPair,
  AlphaHomoraV2RewardToken,
  AlphaHomoraV2CreamToken,
} from "../../../generated/schema";

/*
Array ordered as:[
    [pool key, wMasterChefAddress, lpTokenAddress, name, pid, chefAddress, exchange, token0, token1, rewardtoken0, rewardToken1(optional)],...
]
*/

export const poolRegistry: Array<string[]> = [
  [
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb-28",
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb",
    "0xed8cbd9f0ce3c6986b22002f03c6475ceb7a6256",
    "AVAX/USDT.e",
    "28",
    "0xd6a4f121ca35509af06a0be99093d08462f53052",
    "5658919",
    "Trader Joe",
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    "0xc7198437980c041c805a1edcba50c1ce5db95118",
    "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
  ],
  [
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb-39",
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb",
    "0xa389f9430876455c36478deea9769b7ca4e3ddb1",
    "USDC.e/AVAX",
    "39",
    "0xd6a4f121ca35509af06a0be99093d08462f53052",
    "5658919",
    "Trader Joe",
    "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
  ],
  [
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb-26",
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb",
    "0xfe15c2695f1f920da45c30aae47d11de51007af9",
    "WETH.e/AVAX",
    "26",
    "0xd6a4f121ca35509af06a0be99093d08462f53052",
    "5658919",
    "Trader Joe",
    "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
  ],
  [
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb-37",
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb",
    "0x87dee1cc9ffd464b79e058ba20387c1984aed86a",
    "AVAX/DAI.e",
    "37",
    "0xd6a4f121ca35509af06a0be99093d08462f53052",
    "5658919",
    "Trader Joe",
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
  ],
  [
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb-49",
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb",
    "0x2e02539203256c83c7a9f6fa6f8608a32a2b1ca2",
    "USDC.e/USDT.e",
    "49",
    "0xd6a4f121ca35509af06a0be99093d08462f53052",
    "5658919",
    "Trader Joe",
    "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    "0xc7198437980c041c805a1edcba50c1ce5db95118",
    "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
  ],
  [
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb-27",
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb",
    "0xd5a37dc5c9a396a03dd1136fc76a1a02b1c88ffa",
    "WBTC.e/AVAX",
    "27",
    "0xd6a4f121ca35509af06a0be99093d08462f53052",
    "5658919",
    "Trader Joe",
    "0x50b7545627a5162f82a992c33b87adc75187b218",
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
  ],
  [
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb-40",
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb",
    "0x63abe32d0ee76c05a11838722a63e012008416e6",
    "USDC.e/DAI.e",
    "40",
    "0xd6a4f121ca35509af06a0be99093d08462f53052",
    "5658919",
    "Trader Joe",
    "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
  ],
  [
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb-31",
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb",
    "0xa6908c7e3be8f4cd2eb704b5cb73583ebf56ee62",
    "USDT.e/DAI.e",
    "31",
    "0xd6a4f121ca35509af06a0be99093d08462f53052",
    "5658919",
    "Trader Joe",
    "0xc7198437980c041c805a1edcba50c1ce5db95118",
    "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
  ],
  [
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb-43",
    "0xb41de9c1f50697cc3fd63f24ede2b40f6269cbcb",
    "0x781655d802670bba3c89aebaaea59d3182fd755d",
    "MIM/AVAX",
    "43",
    "0xd6a4f121ca35509af06a0be99093d08462f53052",
    "5658919",
    "Trader Joe",
    "0x130966628846bfd36ff31a822705796e8cb8c18d",
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
  ],
  [
    "0x35d9f9ea86e86e2c8c3d1e24e116797139114178-45",
    "0x35d9f9ea86e86e2c8c3d1e24e116797139114178",
    "0x7bf98bd74e19ad8eb5e14076140ee0103f8f872b",
    "UST/AVAX",
    "45",
    "0x188bed1968b795d5c9022f6a0bb5931ac4c18f00",
    "6034473",
    "Trader Joe",
    "0x260bbf5698121eb85e7a74f2e45e16ce762ebe11",
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
    "0x120ad3e5a7c796349e591f1570d9f7980f4ea9cb",
  ],
  [
    "0x094532967bf224da829bb5d1d6e710277be376b8-29",
    "0x094532967bf224da829bb5d1d6e710277be376b8",
    "0x2a8a315e82f85d1f0658c5d66a452bbdd9356783",
    "USDC.e/USDC",
    "29",
    "0x188bed1968b795d5c9022f6a0bb5931ac4c18f00",
    "6034473",
    "Trader Joe",
    "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
    "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
  ],
  [
    "0x8bbaf67ceb8eed2d5afc5d7786deeaba8268fd4a-26",
    "0x8bbaf67ceb8eed2d5afc5d7786deeaba8268fd4a",
    "0xf723feea2e376b7231cb250f7628fffc3f2dbd10",
    "ALPHA.e/AVAX",
    "26",
    "0x188bed1968b795d5c9022f6a0bb5931ac4c18f00",
    "6034473",
    "Trader Joe",
    "0x2147efff675e4a4ee1c2f918d181cdbd7a8e208f",
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
  ],
  [
    "0xa67cf61b0b9bc39c6df04095a118e53bfb9303c7-7",
    "0xa67cf61b0b9bc39c6df04095a118e53bfb9303c7",
    "0xe28984e1ee8d431346d32bec9ec800efb643eef4",
    "AVAX/USDT.e",
    "7",
    "0x1f806f7c8ded893fd3cae279191ad7aa3798e928",
    "7364784",
    "Pangolin V2",
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    "0xc7198437980c041c805a1edcba50c1ce5db95118",
    "0x60781c2586d68229fde47564546784ab3faca982",
  ],
  [
    "0xa67cf61b0b9bc39c6df04095a118e53bfb9303c7-9",
    "0xa67cf61b0b9bc39c6df04095a118e53bfb9303c7",
    "0xbd918ed441767fe7924e99f6a0e0b568ac1970d9",
    "USDC.e/AVAX",
    "9",
    "0x1f806f7c8ded893fd3cae279191ad7aa3798e928",
    "7364784",
    "Pangolin V2",
    "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    "0x60781c2586d68229fde47564546784ab3faca982",
  ],
  [
    "0xa67cf61b0b9bc39c6df04095a118e53bfb9303c7-8",
    "0xa67cf61b0b9bc39c6df04095a118e53bfb9303c7",
    "0x7c05d54fc5cb6e4ad87c6f5db3b807c94bb89c52",
    "WETH.e/AVAX",
    "8",
    "0x1f806f7c8ded893fd3cae279191ad7aa3798e928",
    "7364784",
    "Pangolin V2",
    "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    "0x60781c2586d68229fde47564546784ab3faca982",
  ],
  [
    "0xa67cf61b0b9bc39c6df04095a118e53bfb9303c7-6",
    "0xa67cf61b0b9bc39c6df04095a118e53bfb9303c7",
    "0xba09679ab223c6bdaf44d45ba2d7279959289ab0",
    "AVAX/DAI.e",
    "6",
    "0x1f806f7c8ded893fd3cae279191ad7aa3798e928",
    "7364784",
    "Pangolin V2",
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
    "0x60781c2586d68229fde47564546784ab3faca982",
  ],
];

function getDecimals(contract: AlphaHomoraV2ERC20): u32 {
  let decimals = 18; // fallback
  let decimalsResult = contract.try_decimals();
  if (decimalsResult.reverted) {
    log.warning("decimals() reverted", []);
  } else {
    decimals = decimalsResult.value;
  }
  decimals = BigInt.fromI32(decimals).toI32();
  return decimals;
}

function getSymbol(contract: AlphaHomoraV2ERC20): string {
  let symbol = "";
  let symbolResult = contract.try_symbol();
  if (symbolResult.reverted) {
    log.warning("symbol() reverted", []);
  } else {
    symbol = symbolResult.value;
  }
  return symbol;
}

export function getOrCreateToken(tokenAddress: string): AlphaHomoraV2Token | null {
  let tokenEntity = AlphaHomoraV2Token.load(tokenAddress);
  if (!tokenEntity) {
    tokenEntity = new AlphaHomoraV2Token(tokenAddress);
    let contract = AlphaHomoraV2ERC20.bind(Address.fromString(tokenAddress.toString()));

    tokenEntity.decimals = getDecimals(contract);
    tokenEntity.symbol = getSymbol(contract);

    if (tokenAddress == "0x2147efff675e4a4ee1c2f918d181cdbd7a8e208f") {
      tokenEntity.decimals = 18;
      tokenEntity.symbol = "ALPHA.e";
    }
    if (tokenAddress == "0x260bbf5698121eb85e7a74f2e45e16ce762ebe11") {
      tokenEntity.decimals = 6;
      tokenEntity.symbol = "UST";
    }
    if (tokenAddress == "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e") {
      tokenEntity.decimals = 6;
      tokenEntity.symbol = "USDC";
    }
    if (tokenAddress == "0x120ad3e5a7c796349e591f1570d9f7980f4ea9cb") {
      tokenEntity.decimals = 6;
      tokenEntity.symbol = "LUNA";
    }
    tokenEntity.save();
  }
  return tokenEntity;
}

function createRewardToken(rewardTokenAddress: string, lpToken: AlphaHomoraV2LpPair): void {
  let rewardTokenEntity = getOrCreateToken(convertToLowerCase(rewardTokenAddress));
  let rewardToken = new AlphaHomoraV2RewardToken(rewardTokenEntity.id + "_" + lpToken.id);
  rewardToken.token = rewardTokenEntity.id;
  rewardToken.address = rewardTokenEntity.id;
  rewardToken.lpToken = lpToken.id;
  rewardToken.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  for (let i = 0; i < poolRegistry.length; i++) {
    let rawData = poolRegistry[i];

    let key = rawData[0].toString();
    let wTokenAddress = convertToLowerCase(rawData[1]);
    let lpTokenAddress = convertToLowerCase(rawData[2]);
    let name = rawData[3].toString();
    let pid = BigInt.fromString(rawData[4].toString()).toI32();
    let chef = convertToLowerCase(rawData[5]);
    let exchange = rawData[7].toString();
    let token0 = convertToLowerCase(rawData[8]);
    let token1 = convertToLowerCase(rawData[9]);

    let lpToken = new AlphaHomoraV2LpPair(lpTokenAddress);
    let wMasterChef = new AlphaHomoraV2WMasterChef(wTokenAddress);

    // Addresses in the registry list for index 10 and after are reward tokens
    for (let i = 10; i < rawData.length; i++) {
      createRewardToken(rawData[i], lpToken);
    }

    lpToken.token0 = getOrCreateToken(token0).id;
    lpToken.token1 = getOrCreateToken(token1).id;
    lpToken.pid = pid;
    lpToken.name = name;
    lpToken.exchange = exchange;
    lpToken.wMasterChef = wMasterChef.id;
    lpToken.save();

    wMasterChef.key = key;
    wMasterChef.chef = chef;
    wMasterChef.save();
  }
}

export function getOrCreateCyToken(crTokenAddress: string): AlphaHomoraV2CreamToken | null {
  let crToken = AlphaHomoraV2CreamToken.load(crTokenAddress);
  if (!crToken) {
    crToken = new AlphaHomoraV2CreamToken(crTokenAddress);
    let crTokenContract = AlphaHomoraV2CyToken.bind(Address.fromString(crTokenAddress));
    let underlyingAddressCall = crTokenContract.try_underlying();
    if (!underlyingAddressCall.reverted) {
      let token = getOrCreateToken(underlyingAddressCall.value.toHexString());
      crToken.underlying = token.id;
      crToken.save();
    }
  }
  return crToken;
}
