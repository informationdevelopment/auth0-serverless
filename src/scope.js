// Functions for verifying scope
const getScopeArray = scope => scope.split(' ').filter(s => s !== '');
const verifyScopeArray = (funcScope, tokenScope) => funcScope.every(scope => getScopeArray(tokenScope).includes(scope));
const verifyScopeString = (funcScope, tokenScope) => verifyScopeArray(getScopeArray(funcScope), tokenScope);
const verifyScopeFunction = (funcScope, tokenScope) => funcScope(tokenScope);

module.exports.verify = (funcScope, tokenScope) => {
    // Choose the appropriate scope verification function depending on funcScope's datatype.
    const verifyScope =
        Array.isArray(funcScope) ? verifyScopeArray
        : typeof funcScope === 'string' ? verifyScopeString
        : typeof funcScope === 'function' ? verifyScopeFunction
        : () => false;    // If scope isn't a string, function, or array, fail the scope check.
    
    return verifyScope(funcScope, tokenScope);
};
