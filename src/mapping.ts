import { bigInt, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  ApproverAdded,
  CommunityRegistered,
  ApprovedBadge,
  Transfer,
  POCP as POCPContract,
  ClaimedBadge
} from "../generated/POCP/POCP"
import { ApprovedToken, Approver, Community, PocpToken, TransferMeta } from "../generated/schema"

// export function handleApproval(event: Approval): void {}
// export function handleApprovalForAll(event: ApprovalForAll): void {}
// export function handleApproverRemoved(event: ApproverRemoved): void {}
// export function handleBeaconUpgraded(event: BeaconUpgraded): void {}
// export function handlePaused(event: Paused): void {}
// export function handleRoleAdminChanged(event: RoleAdminChanged): void {}
// export function handleRoleGranted(event: RoleGranted): void {}
// export function handleRoleRevoked(event: RoleRevoked): void {}
// export function handleSetTokenUri(event: SetTokenUri): void {}
// export function handleUnpaused(event: Unpaused): void {}
// export function handleUpgraded(event: Upgraded): void {}
// export function handleVoucher(event: Voucher): void {}

export function handleApprovedBadge(event: ApprovedBadge): void {
  let approvedToken = ApprovedToken.load(event.params.tokenId.toString())
  if(!approvedToken){
    approvedToken = new ApprovedToken(event.params.tokenId.toString())
    approvedToken.community =  event.params.communityId.toString()
    approvedToken.id = event.params.tokenId.toString()
    approvedToken.identifier = event.params.customIdentifier
    approvedToken.save()
  }
}

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
    community.txhash = event.transaction.hash
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
