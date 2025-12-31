import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { KeyValueAPI } from "@/lib/api/key-value";
import type {
  CreateKeyValueDto,
  UpdateKeyValueDto,
  QueryKeyValueDto,
} from "@/lib/interface/key-value.interface";

export const KEY_VALUE_QUERY_KEY = ["admin", "key-value"];

/**
 * Hook for fetching and managing key-value pairs
 */
export function useKeyValues(query?: QueryKeyValueDto) {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: [...KEY_VALUE_QUERY_KEY, "list", query ?? {}],
    queryFn: async () => {
      const data = await KeyValueAPI.getKeyValues(query);
      // API returns { result, metaData }
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async (dto: CreateKeyValueDto) => {
      return await KeyValueAPI.createKeyValue(dto);
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: KEY_VALUE_QUERY_KEY });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateKeyValueDto }) => {
      return await KeyValueAPI.updateKeyValue(id, dto);
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: KEY_VALUE_QUERY_KEY });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await KeyValueAPI.deleteKeyValue(id);
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: KEY_VALUE_QUERY_KEY });
    },
  });

  return {
    listQuery,
    create,
    update,
    remove,
  };
}

/**
 * Hook for fetching a single key-value pair by ID
 */
export function useKeyValue(id: string) {
  return useQuery({
    queryKey: [...KEY_VALUE_QUERY_KEY, id],
    queryFn: async () => {
      return await KeyValueAPI.getKeyValueById(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook for fetching a single key-value pair by key
 */
export function useKeyValueByKey(key: string, namespace?: string) {
  return useQuery({
    queryKey: [...KEY_VALUE_QUERY_KEY, "key", key, namespace],
    queryFn: async () => {
      return await KeyValueAPI.getKeyValueByKey(key, namespace);
    },
    enabled: !!key,
  });
}

/**
 * Hook for key-value mutations (separate from list hook)
 */
export function useKeyValueMutations() {
  const qc = useQueryClient();

  const createKeyValue = useMutation({
    mutationFn: async (dto: CreateKeyValueDto) => {
      return await KeyValueAPI.createKeyValue(dto);
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: KEY_VALUE_QUERY_KEY });
    },
  });

  const updateKeyValue = useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateKeyValueDto }) => {
      return await KeyValueAPI.updateKeyValue(id, dto);
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: KEY_VALUE_QUERY_KEY });
    },
  });

  const deleteKeyValue = useMutation({
    mutationFn: async (id: string) => {
      await KeyValueAPI.deleteKeyValue(id);
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: KEY_VALUE_QUERY_KEY });
    },
  });

  const cleanupExpired = useMutation({
    mutationFn: async () => {
      return await KeyValueAPI.cleanupExpired();
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: KEY_VALUE_QUERY_KEY });
    },
  });

  return {
    createKeyValue,
    updateKeyValue,
    deleteKeyValue,
    cleanupExpired,
  };
}

export default useKeyValues;
