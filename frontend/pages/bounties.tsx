import { useWeb3 } from "@/hooks/useWeb3";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";

function Bounties() {

    const handleClaimBounty = () => {
        axios.post('/api/claim-bounty', {
            userId: '0x12299cf17bce646d304b722dd2d11f2e843d763072c1be711f54b73bdbf69862',
            submittedAdress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'
        })
    }

    return (
        <div>
            <h1>Bounties</h1>
            <Button onClick={handleClaimBounty}>Claim Bounty</Button>
        </div>
    )
}

export default Bounties;