
function seed() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function getUUID() {
    return (seed() + seed() + "_" + seed() + "_" + seed() + "_" + seed() + "_" + seed() + seed() + seed());
}

module.exports=getUUID;