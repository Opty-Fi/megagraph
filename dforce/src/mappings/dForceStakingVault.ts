import { log } from '@graphprotocol/graph-ts'
import { RewardAdded as RewardAddedEvent } from '../../generated/DAI_Staking_Vault/DForce_Staking_Vault'
import { handleDTokenEntity } from './helpers'

export function handleRewardRate(event: RewardAddedEvent): void {
  log.info('logging RewardRateEvent handler: ', [])
  handleDTokenEntity(
    null,
    event.address,
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
  )
}
