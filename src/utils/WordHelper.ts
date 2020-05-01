import sentencer from 'sentencer';

export class WordHelper {
    static generateNoun(){
       return sentencer.make("{{ noun }}");
    }
}