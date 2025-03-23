import axios from "axios";
import apiConfig from "./api.config.json";
import { supabase } from "./supabase";

const client = axios.create(apiConfig.host);
const graphqlClient = axios.create(apiConfig.host);

type PayloadTypes = {
    QueryPayload: {
        [propertyKey: string]: any
    }
    MutatePayload: {
        options?: {
            debounce?: number
        }
        [propertyKey: string]: any
    }
};

type SupabaseQueryOptions = {
    table: string;
    select?: string;
};

type DebounceType = (...args: any) => any;
const debounce: DebounceType = (fn, ms) => setTimeout(() => fn(), ms);

// general app queries
const queries = ({
    /**
     * General Query to use any query with a passed queryPath
     * @param {string} queryPath Path to the rest API
     * @param {any} [payload] Payload to send with the query
     * @param {string} [method] HTTP method to use, defaults to "get"
     * @returns {import("react-query").UseQueryOptions} An object suitable for use with the `useQuery` hook
     */
    query: (queryPath: string, payload?: PayloadTypes["QueryPayload"], method?: string) => ({
        queryKey: [queryPath],
        queryFn: async () => payload 
            ? (await (client as any)[method || "post"](queryPath, payload)).data
            : (await (client as any)[method || "get"](queryPath)).data
    }),
    supabaseQuery: (options: SupabaseQueryOptions) => ({
        queryKey: [`supabase-${options.table}-${options.select}`],
        queryFn: async () => await supabase.from(options.table).select(options?.select ? options.select : "*")
    }),
    mutate: (queryPath: string) => ({
        mutationKey: [queryPath],
        mutationFn: async (payload?: PayloadTypes["MutatePayload"]) => payload?.options?.debounce
            ? (await debounce(client.post(queryPath, payload), payload.options.debounce)).data
            : (await client.post(queryPath, payload)).data
    }),
    /**
     * Queries the GraphQL API
     * @param {string} queryPath Path to the GraphQL API
     * @returns {import("react-query").UseQueryOptions} An object suitable for use with the `useQuery` hook
     */
    graphQuery: (query: string) => ({
        queryKey: ["graphql", query],
        queryFn: async () => graphqlClient.post(query),
    }),
});

const paths = apiConfig.paths;
export { client, paths, queries };