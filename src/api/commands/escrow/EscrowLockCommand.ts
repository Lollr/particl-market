import { Logger as LoggerType } from '../../../core/Logger';
import { inject, named } from 'inversify';
import { validate, request } from '../../../core/api/Validate';
import { Types, Core, Targets } from '../../../constants';
import { RpcRequest } from '../../requests/RpcRequest';
import { Escrow } from '../../models/Escrow';
import { RpcCommandInterface } from '../RpcCommandInterface';
import { EscrowService } from '../../services/EscrowService';

import { EscrowLockRequest } from '../../requests/EscrowLockRequest';
import { EscrowMessageType } from '../../enums/EscrowMessageType';

export class EscrowLockCommand implements RpcCommandInterface<Escrow> {

    public log: LoggerType;
    public name: string;

    constructor(
        @inject(Types.Service) @named(Targets.Service.EscrowService) private escrowService: EscrowService,
        @inject(Types.Core) @named(Core.Logger) public Logger: typeof LoggerType
    ) {
        this.log = new Logger(__filename);
        this.name = 'lockescrow';
    }

    /**
     * data.params[]:
     * [0]: itemhash
     * [1]: nonce
     * [2]: addressId (from profile deliveryaddresses)
     * [3]: escrowId
     * [4]: memo
     * @param data
     * @returns {Promise<any>}
     */
    @validate()
    public async execute( @request(RpcRequest) data: RpcRequest): Promise<any> {
        // TODO: we have the listing hash, why is escrowId being passed here?
        // TODO: nonce, I don't think the client should pass this?
        return this.escrowService.lock({
            listing: data.params[0],
            nonce: data.params[1],
            addressId: data.params[2],
            escrowId: data.params[3],
            memo: data.params[4],
            action: EscrowMessageType.MPA_LOCK
        } as EscrowLockRequest);
    }

    public help(): string {
        return 'EscrowLockCommand: TODO: Fill in help string.';
    }
}
