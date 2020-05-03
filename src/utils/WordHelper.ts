import sentencer from 'sentencer';

export class WordHelper {
    static newNoun(): string {
        return sentencer.make("{{ noun }}");
    }
}