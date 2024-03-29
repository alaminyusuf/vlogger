import {
  dedupExchange,
  fetchExchange,
  Exchange,
  stringifyVariables,
} from 'urql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../generated/graphql';
import { pipe, tap } from 'wonka';
import Router from 'next/router';

const errorExchange: Exchange = ({ forward }) => (ops$) =>
  pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes('Not authenticated')) {
        Router.replace('/login');
      }
    })
  );

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      'posts'
    );
    info.partial = !isItInTheCache;
    const results: string[] = [];
    let hasMore = true;
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, 'posts') as string[];
      const _hasMore = cache.resolve(key, 'hasMore') as boolean;
      if (_hasMore) {
        hasMore = _hasMore;
      }

      results.push(...data);
    });
    return {
      __typename: 'PaginatedPosts',
      hasMore,
      posts: results,
    };
  };
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        paginatedPosts: () => null,
      },
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          createPost: (_result, _args, cache, _info) => {
            const allFields = cache.inspectFields('Query');
            const fieldInfos = allFields.filter(
              (info) => info.fieldName === 'posts'
            );
            fieldInfos.forEach((field) => {
              cache.invalidate('Query', 'posts', field.arguments || {});
            });
          },
          logout: (res, _args, cache, _info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              res,
              () => ({ me: null })
            );
          },
          login: (res, _args, cache, _info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              res,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },

          register: (res, _args, cache, _info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              res,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
