import React from 'react'

const extractContractModifierErrorMessage = (evmError) => {
    const prefix = "reverted with reason string '";
    const suffix = "'";
    const startIndex = evmError.indexOf(prefix) + prefix.length;
    const endIndex = evmError.indexOf(suffix,startIndex);
    if(startIndex === -1 || endIndex === -1) {
        return null;
    }
    return evmError.slice(startIndex,endIndex);
}

export default extractContractModifierErrorMessage