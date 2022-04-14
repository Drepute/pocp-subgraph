import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  // POCP,
  // AdminChanged,
  // Approval,
  // ApprovalForAll,
  ApproverAdded,
  // ApproverRemoved,
  // BeaconUpgraded,
  CommunityRegistered,
  ApprovedBadge,
  // Paused,
  // RoleAdminChanged,
  // RoleGranted,
  // RoleRevoked,
  Transfer,
  // Unpaused,
  // Upgraded,
  // Voucher,
  POCP as POCPContract,
  ClaimedBadge
} from "../generated/POCP/POCP"
import { Approver, Community, PocpToken, TransferMeta } from "../generated/schema"

// export function handleAdminChanged(event: AdminChanged): void {
//   // Entities can be loaded from the store using a string ID; this ID
//   // needs to be unique across all entities of the same type
//   let entity = ExampleEntity.load(event.transaction.from.toHex())

//   // Entities only exist after they have been saved to the store;
//   // `null` checks allow to create entities on demand
//   if (!entity) {
//     entity = new ExampleEntity(event.transaction.from.toHex())

//     // Entity fields can be set using simple assignments
//     entity.count = BigInt.fromI32(0)
//   }

//   // BigInt and BigDecimal math are supported
//   entity.count = entity.count + BigInt.fromI32(1)

//   // Entity fields can be set based on event parameters
//   entity.previousAdmin = event.params.previousAdmin
//   entity.newAdmin = event.params.newAdmin

//   // Entities can be written to the store with `.save()`
//   entity.save()

//   // Note: If a handler doesn't require existing field values, it is faster
//   // _not_ to load the entity from the store. Instead, create it fresh with
//   // `new Entity(...)`, set the fields that should be updated and save the
//   // entity back to the store. Fields that were not set or unset remain
//   // unchanged, allowing for partial updates to be applied.

//   // It is also possible to access smart contracts from mappings. For
//   // example, the contract that has emitted the event can be connected to
//   // with:
//   //
//   // let contract = Contract.bind(event.address)
//   //
//   // The following functions can then be called on this contract to access
//   // state variables and other data:
//   //
//  // - contract.DEFAULT_ADMIN_ROLE(...)
//  // - contract.PAUSER_ROLE(...)
//  // - contract.UPGRADER_ROLE(...)
//  // - contract.balanceOf(...)
//  // - contract.community(...)
//  // - contract.communityTokens(...)
//  // - contract.getApproved(...)
//  // - contract.getRoleAdmin(...)
//  // - contract.getTrustedForwarder(...)
//  // - contract.hasRole(...)
//  // - contract.isApprovedForAll(...)
//  // - contract.isApprover(...)
//  // - contract.isTrustedForwarder(...)
//  // - contract.lastId(...)
//  // - contract.name(...)
//  // - contract.ownerOf(...)
//  // - contract.paused(...)
//  // - contract.supportsInterface(...)
//  // - contract.symbol(...)
//  // - contract.tokenByIndex(...)
//  // - contract.tokenOfOwnerByIndex(...)
//  // - contract.tokenURI(...)
//  // - contract.totalCommunities(...)
//  // - contract.totalSupply(...)
//  // - contract.userBadge(...)
//  // - contract.userBadgeIds(...)
// }

// export function handleApproval(event: Approval): void {}
export function handleApprovedBadge(event: ApprovedBadge): void {}

// export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleApproverAdded(event: ApproverAdded): void {
  let approver = Approver.load(event.params.account)
  if(approver){
    let community = approver.community 
    community.push(event.params.communityId.toString())
    approver.community = community
  }else{
    approver = new Approver(event.params.account)
    let community = approver.community 
    community.push(event.params.communityId.toString())
    approver.community = community
  }
  approver.save()
}

// export function handleApproverRemoved(event: ApproverRemoved): void {}

// export function handleBeaconUpgraded(event: BeaconUpgraded): void {}

export function handleClaimedBadge(event: ClaimedBadge): void {
  let pocpToken = PocpToken.load(event.params.tokenId.toString())
  if(!pocpToken){
    let pocpContract = POCPContract.bind(event.address);
    pocpToken = new PocpToken(event.params.tokenId.toString())
    pocpToken.community = event.params.communityId.toString()
    pocpToken.ipfsMetaUri = pocpContract.tokenURI(event.params.tokenId)

  }
  pocpToken.save()
}

export function handleCommunityRegistered(event: CommunityRegistered): void {
  let community = Community.load(event.params.communityId.toString())
  if(!community){
    community = new Community(event.params.communityId.toString())
    community.name = event.params.communityName
    community.txSigner = event.params.txSigner
  }
  community.save()
}

export function handleTransfer(event: Transfer): void {
  let transfer = TransferMeta.load(event.params.tokenId.toString())
  if(!transfer){
    transfer = new TransferMeta(event.params.tokenId.toString())
    transfer.from = event.params.from
    transfer.to = event.params.to
  }
  let pocpToken = PocpToken.load(event.params.tokenId.toString())
  if(pocpToken){
    pocpToken.approver = event.params.from
    pocpToken.claimer = event.params.to
    pocpToken.save()
  }else{
    return
  }
  transfer.save()
}

// export function handlePaused(event: Paused): void {}

// export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

// export function handleRoleGranted(event: RoleGranted): void {}

// export function handleRoleRevoked(event: RoleRevoked): void {}

// export function handleSetTokenUri(event: SetTokenUri): void {}

// export function handleUnpaused(event: Unpaused): void {}

// export function handleUpgraded(event: Upgraded): void {}

// export function handleVoucher(event: Voucher): void {}
