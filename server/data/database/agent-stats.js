module.exports = function(db) {
  async function getLastCreditForAgent(_id) {
    const credits = await db.collection('agent_credits').find().sort({createdAt: -1}).toArray();
    for (const credit of credits) {
      if (credit.agentId === _id) {
        return credit;
      }
    }
    return null;
  }

  async function getTotalPaidTripsForAgent(_id) {
    const credits = await db.collection('agent_credits').find({ paid: true }).toArray();
    return credits.filter((c) => c.agentId === _id).length;
  }

  async function getTotalUnpaidTripsForAgent(_id) {
    const credits = await db.collection('agent_credits').find({ paid: false }).toArray();
    return credits.filter((c) => c.agentId === _id).length;
  }

  async function getTotalUnpaidMoneyForAgent(_id) {
    const credits = await db.collection('agent_credits').find({ paid: false }).toArray();
    return credits.filter((c) => c.agentId === _id).reduce((acc, c) => acc + c.amount, 0);
  }

  async function getTotalPaidMoneyForAgent(_id) {
    const credits = await db.collection('agent_credits').find({ paid: true }).toArray();
    return credits.filter((c) => c.agentId === _id).reduce((acc, c) => acc + c.amount, 0);
  }

  async function getAveragePayPerTripForAgent(_id) {
    const allCredits = await db.collection('agent_credits').find({ paid: true }).toArray();
    const credits = allCredits.filter((c) => c.agentId === _id);
    const trips = credits.length;
    const sum = credits.reduce((acc, c) => acc + c.amount, 0);
    return trips && (sum / trips) || 0;
  }

  return {
    getLastCreditForAgent,
    getTotalPaidTripsForAgent,
    getTotalUnpaidTripsForAgent,
    getTotalUnpaidMoneyForAgent,
    getTotalPaidMoneyForAgent,
    getAveragePayPerTripForAgent,
  };
};
