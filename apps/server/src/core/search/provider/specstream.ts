import { ISearchResponseResult, SearchFunc } from './types.js';

const searchWithSpecStream: SearchFunc = async (query: string) => {
  if (!query.trim()) {
    throw new Error('Query cannot be empty');
  }

  const apiKey = process.env.SPECSTREAM_KEY;
  if (!apiKey) {
    throw new Error('SpecStream API Key not set');
  }

  const count = process.env.REFERENCE_COUNT || 8;
  const url = new URL('https://api.specstream.ai/v1/web-search');
  url.searchParams.append('query', query);
  url.searchParams.append('max_results', count.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    },
  });

  if (!response.ok) {
    throw new Error(`SpecStream API error: ${response.statusText}`);
  }

  const data = await response.json();
  const results: ISearchResponseResult[] = data.results.map((item: any, index: number) => ({
    id: index + 1,
    name: item.title,
    url: item.url,
    snippet: item.content,
  }));
  return results;
};

export default searchWithSpecStream;
