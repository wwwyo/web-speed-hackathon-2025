import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { getRecommendedModulesResponse } from '@wsh-2025/schema/src/openapi/schema';

const $fetch = createFetch({
  baseURL: import.meta.env['VITE_API_BASE_URL'] ?? 'http://localhost:8000/api',
  schema: createSchema({
    '/recommended/:referenceId': {
      output: getRecommendedModulesResponse,
    },
  }),
  throw: true,
});

interface RecommendedService {
  fetchRecommendedModulesByReferenceId: (params: {
    referenceId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof getRecommendedModulesResponse>>;
}

export const recommendedService: RecommendedService = {
  async fetchRecommendedModulesByReferenceId({ referenceId }) {
    try {
      const data = await $fetch('/recommended/:referenceId', {
        params: { referenceId },
      });
      return data;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
};
