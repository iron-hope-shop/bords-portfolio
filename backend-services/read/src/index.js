const fastify = require('fastify')({ logger: true });
const axios = require('axios');
const cors = require('@fastify/cors');

console.log('Environment variables:', {
  APP_SEARCH_BASE_URL: process.env.APP_SEARCH_BASE_URL,
  APP_SEARCH_API_KEY: process.env.APP_SEARCH_API_KEY ? 'Set' : 'Not set',
  ENGINE_NAME: process.env.ENGINE_NAME,
});

fastify.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://dev-dot-border-than-u.uc.r.appspot.com', 'https://bordsearch.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

const VALID_INDICES = [
  'conditions', 'identifiers', 'inputs', 'notes',
  'outcomes', 'provenance', 'reaction_id', 'id'
];

const appSearchClient = axios.create({
  baseURL: process.env.APP_SEARCH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.APP_SEARCH_API_KEY}`
  }
});

fastify.get('/api/read/hi', async (request, reply) => {
  reply.send('Hi');
});

const MAX_PAGES = 20;

fastify.post('/api/read/search', async (request, reply) => {
  const { query, search_fields, result_fields, page = 1, size = 10, conditions = [] } = request.body;

  if (typeof query !== 'string') {
    return reply.code(400).send({ error: 'Invalid query' });
  }

  const currentPage = parseInt(page, 10);
  const pageSize = parseInt(size, 10);
  if (isNaN(currentPage) || isNaN(pageSize) || currentPage < 1 || pageSize < 1) {
    return reply.code(400).send({ error: 'Invalid pagination parameters' });
  }

  if (currentPage > MAX_PAGES) {
    return reply.code(400).send({ error: `Page number exceeds the maximum limit of ${MAX_PAGES}` });
  }

  const finalSearchFields = search_fields || VALID_INDICES.reduce((acc, field) => {
    acc[field] = {};
    return acc;
  }, {});

  const finalResultFields = result_fields || VALID_INDICES.reduce((acc, field) => {
    acc[field] = { raw: {} };
    return acc;
  }, {});

  try {
    let filters = [];

    conditions.forEach(group => {
      const groupFilters = group.conditions.map(condition => {
        switch (condition.condition) {
          case 'equals':
            return { [condition.field]: condition.value };
          case 'contains':
            return { [condition.field]: { $contains: condition.value } };
          case 'starts_with':
            return { [condition.field]: { $prefix: condition.value } };
          case 'ends_with':
            return { [condition.field]: { $suffix: condition.value } };
          case 'greater_than':
            return { [condition.field]: { $gt: condition.value } };
          case 'less_than':
            return { [condition.field]: { $lt: condition.value } };
          default:
            return null;
        }
      }).filter(Boolean);

      if (groupFilters.length > 0) {
        filters.push({ [group.operator === 'AND' ? '$all' : '$any']: groupFilters });
      }
    });

    const searchResponse = await appSearchClient.post(`/api/as/v1/engines/${process.env.ENGINE_NAME}/search`, {
      query,
      search_fields: finalSearchFields,
      result_fields: finalResultFields,
      page: {
        size: pageSize,
        current: currentPage
      },
      filters: filters.length > 0 ? { $all: filters } : undefined
    });

    const results = searchResponse.data.results.map(result => {
      const { _meta, ...rest } = result;
      return {
        ...rest,
        conditions: result.conditions?.raw ? JSON.parse(result.conditions.raw) : undefined
      };
    });

    const { meta } = searchResponse.data;
    const totalPages = Math.ceil(meta.page.total_results / pageSize);

    reply.send({
      results,
      pagination: {
        currentPage,
        pageSize,
        totalResults: meta.page.total_results,
        totalPages
      }
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    reply.code(500).send({ error: 'An error occurred while searching' });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 8080, host: '0.0.0.0' });
    console.log(`Server running on port ${process.env.PORT || 8080}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

module.exports = fastify;