/* ==========================================================================
   WealthGuides Calculator Engine
   Pure, dependency-free financial calculation functions.
   Every function is deterministic and documented — used by all calculators
   so the math is defined once and stays consistent site-wide.
   ========================================================================== */

var CalcEngine = (function () {

  // Future value of a lump sum + regular monthly contributions, compounded monthly.
  // principal: starting amount, monthlyContribution: added each month,
  // annualRatePct: e.g. 7 for 7%, years: time horizon.
  function compoundGrowth(principal, monthlyContribution, annualRatePct, years) {
    var r = (annualRatePct / 100) / 12;
    var n = years * 12;
    var fvPrincipal = principal * Math.pow(1 + r, n);
    var fvContributions;
    if (r === 0) {
      fvContributions = monthlyContribution * n;
    } else {
      fvContributions = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    }
    var totalContributed = principal + monthlyContribution * n;
    var futureValue = fvPrincipal + fvContributions;
    return {
      futureValue: futureValue,
      totalContributed: totalContributed,
      totalGrowth: futureValue - totalContributed
    };
  }

  // Compares ending value of an investment at expense ratio A vs B, same gross return.
  function feeDrag(principal, monthlyContribution, grossAnnualReturnPct, years, expenseRatioPctA, expenseRatioPctB) {
    var netA = grossAnnualReturnPct - expenseRatioPctA;
    var netB = grossAnnualReturnPct - expenseRatioPctB;
    var resultA = compoundGrowth(principal, monthlyContribution, netA, years);
    var resultB = compoundGrowth(principal, monthlyContribution, netB, years);
    return {
      fundA: resultA,
      fundB: resultB,
      difference: resultB.futureValue - resultA.futureValue
    };
  }

  // Rough Roth vs Traditional comparison: same pre-tax contribution amount,
  // compares after-tax ending balances given current vs retirement marginal rates.
  function rothVsTraditional(annualContribution, years, annualRatePct, currentMarginalRatePct, retirementMarginalRatePct) {
    var growth = compoundGrowth(0, annualContribution / 12, annualRatePct, years);
    var traditionalPretaxBalance = growth.futureValue;
    var traditionalAfterTax = traditionalPretaxBalance * (1 - retirementMarginalRatePct / 100);

    // Roth: contribution is already after-tax, so less goes in for the same take-home cost,
    // but grows tax-free.
    var afterTaxContribution = annualContribution * (1 - currentMarginalRatePct / 100);
    var rothGrowth = compoundGrowth(0, afterTaxContribution / 12, annualRatePct, years);
    var rothAfterTax = rothGrowth.futureValue; // no tax on qualified withdrawal

    return {
      traditionalAfterTaxBalance: traditionalAfterTax,
      rothAfterTaxBalance: rothAfterTax,
      difference: rothAfterTax - traditionalAfterTax
    };
  }

  // Simple retirement-readiness projection.
  function retirementProjection(currentAge, retirementAge, currentSavings, monthlyContribution, annualRatePct) {
    var years = Math.max(retirementAge - currentAge, 0);
    return compoundGrowth(currentSavings, monthlyContribution, annualRatePct, years);
  }

  function formatCurrency(value) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  }

  return {
    compoundGrowth: compoundGrowth,
    feeDrag: feeDrag,
    rothVsTraditional: rothVsTraditional,
    retirementProjection: retirementProjection,
    formatCurrency: formatCurrency
  };
})();
