export class EffectDie extends DiceTerm {
  constructor(termData) {
    super(termData);
    this.faces = 6;
  }

  /**@override */
  static DENOMINATION = 'e';

  static faceValues() {
    return {
      1: 1,
      2: 2,
      3: 0,
      4: 0,
      5: 1,
      6: 1,
    };
  }

  /** @override */
  static getResultLabel(result) {
    return {
      '1': '1',
      '2': '2',
      '3': '&nbsp;',
			'4': '&nbsp;',
			'5': '<i class="fas fa-bahai"></i>',
			'6': '<i class="fas fa-bahai"></i>',
    }[result];
  }

  /** @override */
  get total() {
    if (!this._evaluated)
      return null;
    return this.results.reduce((t,r) => {
      if(!r.active)
        return t;
      if (r.count !== undefined)
        return t + r.count;
      return t + EffectDie.faceValues()[r.result];
    }, 0)
    }


  /** @override */
  roll(options) {
    const roll = super.roll(options);
    roll.effect = roll.result === 5 || roll.result === 6;
    console.log("Effect Die Roll ", roll);
    return roll;
  }  
}

