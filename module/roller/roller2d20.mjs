export class Roller2d20{

  static roll2d20({
    targetNumber,
    extraDice = 0,
    difficulty = 1,
    doubleRange = 1,
    complicationRange = 1
  }){
    console.log("Attributes: ", targetNumber, extraDice, difficulty, doubleRange, complicationRange);
    const totalDice = 2+extraDice;
    const roll = new Die({faces: 20, number: totalDice});
    roll.evaluate();

    const results = roll.results.map((die) => {
      return parseInt(die.result);
    });

    //count successes
    const successes = results.reduce((total, result) => {
      if (result <= targetNumber) total++;

      if (result <= doubleRange) total++;

      return total;
    }, 0);

    console.log("Results ", results);
    console.log("Total successes ", successes);

    //Determine complication range
    const minComplicationValue = 21 - complicationRange;

    const complications = results.reduce((total, result) => {
      if (result >= minComplicationValue) total++;
      return total;
    }, 0);

    console.log("Complications ", complications);

    const succeeded = successes >= difficulty;

    const advantage = Math.max(successes - difficulty, 0);


    return {
      results,
      successes,
      complications,
      succeeded,
      advantage,
    };
  }
}
