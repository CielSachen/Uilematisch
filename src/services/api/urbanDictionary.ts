/* eslint-disable jsdoc/require-jsdoc */
import { logger } from '@utils';

export interface DefineResponse {
  readonly list: {
    readonly definition: string;
    readonly permalink: string;
    readonly thumbs_up: number;
    readonly author: string;
    readonly word: string;
    readonly defid: number;
    readonly current_vote: string;
    readonly written_on: Date;
    readonly example: string;
    readonly thumbs_down: number;
  }[];
}

export interface DefineErrorResponse {
  readonly error: string | number;
}

/**
 * Fetches the Urban Dictionary entries for a slang word or phrase through Urban Dictionary's API.
 * @param term The slang word or phrase.
 * @returns The fetched Urban Dictionary entries for the slang word or phrase.
 * @author CielSachen
 */
export async function fetchUrbanDictionaryEntries(term: string) {
  const childLogger = logger.child({
    api: 'urbandictionary',
    parameters: { term },
  });

  childLogger.http('Fetching the Urban Dictionary API.');

  const response = await fetch(`http://api.urbandictionary.com/v0/define?term=${term}`);

  childLogger.http('Fetched the Urban Dictionary API.', { response });

  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

  const json = await response.json() as DefineResponse | DefineErrorResponse;

  if ('error' in json) throw new Error(json.error.toString());

  return json;
}
