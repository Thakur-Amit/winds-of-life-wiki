/**
 * Sanity Client Configuration for Next.js App Router
 */

export const clientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dummy-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-01',
  useCdn: process.env.NODE_ENV === 'production',
};

// Placeholder client helper for Next.js server components
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: Record<string, any>;
  tags?: string[];
}): Promise<T> {
  // In a live Next.js environment with @sanity/client:
  // return client.fetch<T>(query, params, { next: { revalidate: 60, tags } });
  console.log('Executing GROQ query:', query, params, tags);
  return {} as T;
}
