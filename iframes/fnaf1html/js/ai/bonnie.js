import { BaseAI } from './baseAI.js';

export class Bonnie extends BaseAI {
    constructor(aiLevel = 0) {
        const bonniePath = ['Showstage', 'Dining Area', 'Backstage', 'West Hall', 'Supply Closet', 'West Hall Corner', 'Office Door'];
        super('Bonnie', aiLevel, bonniePath);
    }
}
